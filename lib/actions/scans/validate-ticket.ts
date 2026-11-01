"use server";

import { revalidatePath } from "next/cache";

import { pool } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

export type ScanOutcome = "valid" | "already_used" | "cancelled" | "invalid";

export type ScanValidation = {
  outcome: ScanOutcome;
  message: string;
  holderName?: string;
  ticketType?: string;
  eventTitle?: string;
  scannedAt?: string | null;
};

/**
 * Contrôle d'accès : valide un billet à partir de son jeton QR.
 * L'enregistrement du scan et le passage du billet en « utilisé » sont atomiques.
 */
export async function validateTicket(
  code: string,
  deviceInfo?: string,
): Promise<ScanValidation> {
  const organization = await requireOrganization();
  const session = await requireUser();
  const rawCode = code.trim();

  if (!rawCode) {
    return { outcome: "invalid", message: "Aucun code fourni." };
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT t.id, t.status::text AS status, t.used_at,
              t.event_id, t.holder_name,
              tt.name AS ticket_type,
              e.title AS event_title,
              e.organization_id
         FROM tickets t
         JOIN events e ON e.id = t.event_id
         JOIN ticket_types tt ON tt.id = t.ticket_type_id
        WHERE t.qr_token = $1
        LIMIT 1`,
      [rawCode],
    );

    const ticket = rows[0];

    // Un billet d'une autre organisation est traité comme inconnu.
    if (!ticket || ticket.organization_id !== organization.id) {
      return {
        outcome: "invalid",
        message: "Billet introuvable ou non valable pour cet événement.",
      };
    }

    const base = {
      holderName: ticket.holder_name ?? undefined,
      ticketType: ticket.ticket_type ?? undefined,
      eventTitle: ticket.event_title ?? undefined,
    };

    if (ticket.status === "used") {
      await client.query(
        `INSERT INTO ticket_scans (event_id, ticket_id, scanned_by, result, raw_code, device_info)
         VALUES ($1, $2, $3, 'already_used', $4, $5)`,
        [ticket.event_id, ticket.id, session.user.id, rawCode, deviceInfo ?? null],
      );

      return {
        ...base,
        outcome: "already_used",
        message: "Ce billet a déjà été scanné.",
        scannedAt: ticket.used_at ? new Date(ticket.used_at).toISOString() : null,
      };
    }

    if (ticket.status !== "valid") {
      await client.query(
        `INSERT INTO ticket_scans (event_id, ticket_id, scanned_by, result, raw_code, device_info)
         VALUES ($1, $2, $3, 'cancelled', $4, $5)`,
        [ticket.event_id, ticket.id, session.user.id, rawCode, deviceInfo ?? null],
      );

      return {
        ...base,
        outcome: "cancelled",
        message: "Ce billet est annulé, remboursé ou transféré.",
      };
    }

    const { rows: updated } = await client.query(
      `UPDATE tickets
          SET status = 'used', used_at = now(), used_by = $2
        WHERE id = $1 AND status = 'valid'
        RETURNING used_at`,
      [ticket.id, session.user.id],
    );

    if (updated.length === 0) {
      return {
        ...base,
        outcome: "already_used",
        message: "Ce billet vient d'être utilisé.",
      };
    }

    await client.query(
      `INSERT INTO ticket_scans (event_id, ticket_id, scanned_by, result, raw_code, device_info)
       VALUES ($1, $2, $3, 'valid', $4, $5)`,
      [ticket.event_id, ticket.id, session.user.id, rawCode, deviceInfo ?? null],
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/scan/history");
    revalidatePath("/dashboard/participants");

    return {
      ...base,
      outcome: "valid",
      message: "Entrée validée.",
      scannedAt: updated[0]?.used_at ? new Date(updated[0].used_at).toISOString() : null,
    };
  } finally {
    client.release();
  }
}
