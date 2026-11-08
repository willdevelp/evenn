"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DashboardOverview = {
  organizationName: string;
  events: number;
  publishedEvents: number;
  upcomingEvents: number;
  ticketsSold: number;
  capacity: number;
  revenue: number;
  tickets: number;
  checkedIn: number;
  scans: number;
  currency: string;
  salesSeries: { date: string; sales: number }[];
  revenueSeries: { month: string; revenue: number }[];
  topEvents: TopEvent[];
  recentOrders: RecentOrder[];
};

export type TopEvent = {
  id: string;
  title: string;
  sold: number;
  capacity: number;
  revenue: number;
};

export type RecentOrder = {
  id: string;
  orderNumber: string;
  buyerName: string;
  eventTitle: string;
  amount: number;
  status: string;
  createdAt: string;
};

export type RevenueTransaction = {
  id: string;
  orderNumber: string;
  eventTitle: string;
  buyerName: string;
  amount: number;
  commission: number;
  net: number;
  status: string;
  createdAt: string;
};

export type RevenueOverview = {
  balance: number;
  currency: string;
  totalPaid: number;
  totalCommission: number;
  pendingAmount: number;
  transactions: RevenueTransaction[];
};

export type ParticipantRow = {
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  eventId: string;
  eventTitle: string;
  orderNumber: string;
  orderStatus: string;
  ticketStatus: string;
  checkedInAt: string | null;
  createdAt: string;
};

export type ParticipantsOverview = {
  rows: ParticipantRow[];
  total: number;
  checkedIn: number;
  currency: string;
};

export type ScanHistoryRow = {
  id: string;
  eventTitle: string;
  holderName: string;
  ticketType: string;
  result: string;
  scannedAt: string;
  scannedBy: string;
};

export type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  ordersCount: number;
  organizations: number;
};

export type AnalyticsData = {
  currency: string;
  ticketsSold: number;
  capacity: number;
  revenue: number;
  participants: number;
  scans: number;
  dailySales: { date: string; sales: number }[];
  ticketTypes: { name: string; sold: number }[];
  topEvents: TopEvent[];
};

export type OrganizerEvent = {
  id: string;
  title: string;
  city: string | null;
  coverUrl: string | null;
  date: string | null;
  price: number | null;
  sold: number;
  capacity: number;
};

export type OrganizerProfile = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  countryCode: string;
  verificationStatus: string;
  socialLinks: Record<string, string>;
  events: OrganizerEvent[];
  participants: number;
};

export type TicketQrData = {
  id: string;
  code: string;
  event: string;
  logoUrl: string | null;
  ticketType: string;
  price: number;
  holderName: string;
  holderEmail: string;
  orderNumber: string | null;
  currency: string;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function getCurrency(): Promise<string> {
  const { rows } = await pool.query<{ value: unknown }>(
    `SELECT value FROM settings WHERE key = 'default_currency' LIMIT 1`,
  );
  return rows[0] ? String(rows[0].value) : "XAF";
}

const toIso = (value: Date | string | null): string | null =>
  value === null ? null : value instanceof Date ? value.toISOString() : new Date(value).toISOString();

/* ------------------------------------------------------------------ */
/* Vue d'ensemble                                                      */
/* ------------------------------------------------------------------ */

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const organization = await requireOrganization();
  const orgId = organization.id;

  const [totalsResult, salesResult, revenueResult, topResult, ordersResult, currency] =
    await Promise.all([
      pool.query(
        `SELECT
           (SELECT count(*) FROM events e
             WHERE e.organization_id = $1 AND e.deleted_at IS NULL)::int AS events,
           (SELECT count(*) FROM events e
             WHERE e.organization_id = $1 AND e.deleted_at IS NULL
               AND e.status::text = 'published')::int AS published_events,
           (SELECT count(*) FROM events e
             WHERE e.organization_id = $1 AND e.deleted_at IS NULL
               AND e.status::text = 'published'
               AND EXISTS (SELECT 1 FROM event_dates d
                            WHERE d.event_id = e.id AND d.starts_at >= now()))::int AS upcoming_events,
           (SELECT COALESCE(sum(tt.quantity_sold), 0) FROM ticket_types tt
              JOIN events e ON e.id = tt.event_id
             WHERE e.organization_id = $1 AND e.deleted_at IS NULL)::int AS tickets_sold,
           (SELECT COALESCE(sum(tt.quantity_total), 0) FROM ticket_types tt
              JOIN events e ON e.id = tt.event_id
             WHERE e.organization_id = $1 AND e.deleted_at IS NULL)::int AS capacity,
           (SELECT COALESCE(sum(v.gross_revenue), 0) FROM v_event_sales v
             WHERE v.organization_id = $1)::int AS revenue,
           (SELECT count(*) FROM tickets t
              JOIN events e ON e.id = t.event_id
             WHERE e.organization_id = $1)::int AS tickets,
           (SELECT count(*) FROM tickets t
              JOIN events e ON e.id = t.event_id
             WHERE e.organization_id = $1 AND t.status::text = 'used')::int AS checked_in,
           (SELECT count(*) FROM ticket_scans s
              JOIN events e ON e.id = s.event_id
             WHERE e.organization_id = $1)::int AS scans`,
        [orgId],
      ),
      pool.query(
        `WITH days AS (
           SELECT generate_series(current_date - 6, current_date, interval '1 day')::date AS day
         )
         SELECT days.day::text AS date, COALESCE(sum(oi.quantity), 0)::int AS sales
           FROM days
           LEFT JOIN orders o
             ON o.created_at::date = days.day
            AND o.organization_id = $1
            AND o.kind::text = 'ticket'
            AND o.status::text = 'paid'
           LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
          GROUP BY days.day
          ORDER BY days.day`,
        [orgId],
      ),
      pool.query(
        `WITH months AS (
           SELECT generate_series(
             date_trunc('month', current_date) - interval '5 months',
             date_trunc('month', current_date),
             interval '1 month'
           ) AS month
         )
         SELECT months.month::text AS month, COALESCE(sum(o.total_amount), 0)::int AS revenue
           FROM months
           LEFT JOIN orders o
             ON date_trunc('month', o.created_at) = months.month
            AND o.organization_id = $1
            AND o.kind::text = 'ticket'
            AND o.status::text = 'paid'
          GROUP BY months.month
          ORDER BY months.month`,
        [orgId],
      ),
      pool.query(
        `SELECT e.id, e.title,
                COALESCE(sum(tt.quantity_sold), 0)::int AS sold,
                COALESCE(sum(tt.quantity_total), 0)::int AS capacity,
                COALESCE((SELECT sum(v.gross_revenue) FROM v_event_sales v
                           WHERE v.event_id = e.id), 0)::int AS revenue
           FROM events e
           LEFT JOIN ticket_types tt ON tt.event_id = e.id
          WHERE e.organization_id = $1 AND e.deleted_at IS NULL
          GROUP BY e.id
          ORDER BY sold DESC, e.created_at DESC
          LIMIT 5`,
        [orgId],
      ),
      pool.query(
        `SELECT o.id, o.order_number, o.buyer_name, o.total_amount,
                o.status::text AS status, o.created_at,
                string_agg(DISTINCT e.title, ', ') AS event_title
           FROM orders o
           LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
           LEFT JOIN ticket_types tt ON tt.id = oi.ticket_type_id
           LEFT JOIN events e ON e.id = tt.event_id
          WHERE o.organization_id = $1 AND o.kind::text = 'ticket'
          GROUP BY o.id
          ORDER BY o.created_at DESC
          LIMIT 6`,
        [orgId],
      ),
      getCurrency(),
    ]);

  const totals = totalsResult.rows[0];

  return {
    organizationName: organization.name,
    events: Number(totals.events),
    publishedEvents: Number(totals.published_events),
    upcomingEvents: Number(totals.upcoming_events),
    ticketsSold: Number(totals.tickets_sold),
    capacity: Number(totals.capacity),
    revenue: Number(totals.revenue),
    tickets: Number(totals.tickets),
    checkedIn: Number(totals.checked_in),
    scans: Number(totals.scans),
    currency,
    salesSeries: salesResult.rows.map((row) => ({
      date: row.date,
      sales: Number(row.sales),
    })),
    revenueSeries: revenueResult.rows.map((row) => ({
      month: row.month,
      revenue: Number(row.revenue),
    })),
    topEvents: topResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      sold: Number(row.sold),
      capacity: Number(row.capacity),
      revenue: Number(row.revenue),
    })),
    recentOrders: ordersResult.rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      buyerName: row.buyer_name ?? "—",
      eventTitle: row.event_title ?? "—",
      amount: Number(row.total_amount),
      status: row.status,
      createdAt: toIso(row.created_at) ?? "",
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Revenus                                                             */
/* ------------------------------------------------------------------ */

export async function getRevenueOverview(): Promise<RevenueOverview> {
  const organization = await requireOrganization();
  const orgId = organization.id;

  const [transactions, totals, balance, currency] = await Promise.all([
    pool.query(
      `SELECT o.id, o.order_number, o.buyer_name, o.total_amount,
              o.platform_commission_amount, o.status::text AS status, o.created_at,
              string_agg(DISTINCT e.title, ', ') AS event_title
         FROM orders o
         LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
         LEFT JOIN ticket_types tt ON tt.id = oi.ticket_type_id
         LEFT JOIN events e ON e.id = tt.event_id
        WHERE o.organization_id = $1 AND o.kind::text = 'ticket'
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 200`,
      [orgId],
    ),
    pool.query(
      `SELECT
         COALESCE(sum(total_amount) FILTER (WHERE status::text = 'paid'), 0)::int AS paid,
         COALESCE(sum(platform_commission_amount) FILTER (WHERE status::text = 'paid'), 0)::int AS commission,
         COALESCE(sum(total_amount) FILTER (WHERE status::text = 'pending'), 0)::int AS pending
       FROM orders
       WHERE organization_id = $1 AND kind::text = 'ticket'`,
      [orgId],
    ),
    pool.query(
      `SELECT COALESCE(balance, 0)::int AS balance
         FROM v_organization_balance WHERE organization_id = $1`,
      [orgId],
    ),
    getCurrency(),
  ]);

  return {
    balance: Number(balance.rows[0]?.balance ?? 0),
    currency,
    totalPaid: Number(totals.rows[0]?.paid ?? 0),
    totalCommission: Number(totals.rows[0]?.commission ?? 0),
    pendingAmount: Number(totals.rows[0]?.pending ?? 0),
    transactions: transactions.rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      eventTitle: row.event_title ?? "—",
      buyerName: row.buyer_name ?? "—",
      amount: Number(row.total_amount),
      commission: Number(row.platform_commission_amount),
      net: Number(row.total_amount) - Number(row.platform_commission_amount),
      status: row.status,
      createdAt: toIso(row.created_at) ?? "",
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Participants                                                        */
/* ------------------------------------------------------------------ */

export async function getParticipants(): Promise<ParticipantsOverview> {
  const organization = await requireOrganization();
  const orgId = organization.id;

  const [rows, currency] = await Promise.all([
    pool.query(
      `SELECT t.id, t.holder_name, t.holder_email, t.holder_phone,
              t.status::text AS ticket_status, t.used_at, t.created_at,
              tt.name AS ticket_type,
              e.id AS event_id, e.title AS event_title,
              o.order_number, o.status::text AS order_status
         FROM tickets t
         JOIN events e ON e.id = t.event_id
         JOIN ticket_types tt ON tt.id = t.ticket_type_id
         LEFT JOIN orders o ON o.id = t.order_id
        WHERE e.organization_id = $1
        ORDER BY t.created_at DESC
        LIMIT 500`,
      [orgId],
    ),
    getCurrency(),
  ]);

  const participants = rows.rows.map((row) => ({
    ticketId: row.id,
    name: row.holder_name ?? "—",
    email: row.holder_email ?? "",
    phone: row.holder_phone ?? "",
    ticketType: row.ticket_type ?? "—",
    eventId: row.event_id,
    eventTitle: row.event_title,
    orderNumber: row.order_number ?? "—",
    orderStatus: row.order_status ?? "—",
    ticketStatus: row.ticket_status,
    checkedInAt: toIso(row.used_at),
    createdAt: toIso(row.created_at) ?? "",
  }));

  return {
    rows: participants,
    total: participants.length,
    checkedIn: participants.filter((participant) => participant.ticketStatus === "used").length,
    currency,
  };
}

/* ------------------------------------------------------------------ */
/* Historique des scans                                                */
/* ------------------------------------------------------------------ */

export async function getScanHistory(): Promise<ScanHistoryRow[]> {
  const organization = await requireOrganization();

  const { rows } = await pool.query(
    `SELECT s.id, s.result::text AS result, s.scanned_at,
            e.title AS event_title,
            t.holder_name,
            tt.name AS ticket_type,
            COALESCE(u.name, u.email, '—') AS scanned_by
       FROM ticket_scans s
       JOIN events e ON e.id = s.event_id
       JOIN tickets t ON t.id = s.ticket_id
       JOIN ticket_types tt ON tt.id = t.ticket_type_id
       LEFT JOIN "user" u ON u.id = s.scanned_by
      WHERE e.organization_id = $1
      ORDER BY s.scanned_at DESC
      LIMIT 200`,
    [organization.id],
  );

  return rows.map((row) => ({
    id: row.id,
    eventTitle: row.event_title,
    holderName: row.holder_name ?? "—",
    ticketType: row.ticket_type ?? "—",
    result: row.result,
    scannedAt: toIso(row.scanned_at) ?? "",
    scannedBy: row.scanned_by,
  }));
}

/* ------------------------------------------------------------------ */
/* Annuaire des utilisateurs                                           */
/* ------------------------------------------------------------------ */

export async function getUsersDirectory(): Promise<DirectoryUser[]> {
  const organization = await requireOrganization();

  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.banned, u."createdAt" AS created_at,
            (SELECT count(*) FROM orders o
              WHERE o.organization_id = $1
                AND o.kind::text = 'ticket'
                AND o.status::text = 'paid'
                AND (o.buyer_user_id = u.id
                     OR lower(o.buyer_email) = lower(u.email)))::int AS orders_count,
            (SELECT count(*) FROM organization_members m
              WHERE m.user_id = u.id)::int AS organizations
       FROM "user" u
      WHERE EXISTS (
              SELECT 1 FROM orders o
               WHERE o.organization_id = $1
                 AND o.kind::text = 'ticket'
                 AND (o.buyer_user_id = u.id
                      OR lower(o.buyer_email) = lower(u.email))
            )
         OR EXISTS (
              SELECT 1
                FROM tickets t
                JOIN events e ON e.id = t.event_id
               WHERE e.organization_id = $1
                 AND lower(t.holder_email) = lower(u.email)
            )
      ORDER BY u."createdAt" DESC`,
    [organization.id],
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? "—",
    email: row.email,
    role: row.role ?? "user",
    banned: Boolean(row.banned),
    createdAt: toIso(row.created_at) ?? "",
    ordersCount: Number(row.orders_count),
    organizations: Number(row.organizations),
  }));
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export async function getAnalytics(): Promise<AnalyticsData> {
  const organization = await requireOrganization();
  const orgId = organization.id;

  const [totals, daily, types, top, currency] = await Promise.all([
    pool.query(
      `SELECT
         (SELECT COALESCE(sum(tt.quantity_sold), 0) FROM ticket_types tt
            JOIN events e ON e.id = tt.event_id
           WHERE e.organization_id = $1 AND e.deleted_at IS NULL)::int AS sold,
         (SELECT COALESCE(sum(tt.quantity_total), 0) FROM ticket_types tt
            JOIN events e ON e.id = tt.event_id
           WHERE e.organization_id = $1 AND e.deleted_at IS NULL)::int AS capacity,
         (SELECT COALESCE(sum(v.gross_revenue), 0) FROM v_event_sales v
           WHERE v.organization_id = $1)::int AS revenue,
         (SELECT count(*) FROM tickets t
            JOIN events e ON e.id = t.event_id
           WHERE e.organization_id = $1)::int AS participants,
         (SELECT count(*) FROM ticket_scans s
            JOIN events e ON e.id = s.event_id
           WHERE e.organization_id = $1)::int AS scans`,
      [orgId],
    ),
    pool.query(
      `WITH days AS (
         SELECT generate_series(current_date - 6, current_date, interval '1 day')::date AS day
       )
       SELECT days.day::text AS date, COALESCE(sum(oi.quantity), 0)::int AS sales
         FROM days
         LEFT JOIN orders o
           ON o.created_at::date = days.day
          AND o.organization_id = $1
          AND o.kind::text = 'ticket'
          AND o.status::text = 'paid'
         LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
        GROUP BY days.day
        ORDER BY days.day`,
      [orgId],
    ),
    pool.query(
      `SELECT tt.name, COALESCE(sum(tt.quantity_sold), 0)::int AS sold
         FROM ticket_types tt
         JOIN events e ON e.id = tt.event_id
        WHERE e.organization_id = $1 AND e.deleted_at IS NULL
        GROUP BY tt.name
        ORDER BY sold DESC`,
      [orgId],
    ),
    pool.query(
      `SELECT e.id, e.title,
              COALESCE(sum(tt.quantity_sold), 0)::int AS sold,
              COALESCE(sum(tt.quantity_total), 0)::int AS capacity,
              COALESCE((SELECT sum(v.gross_revenue) FROM v_event_sales v
                         WHERE v.event_id = e.id), 0)::int AS revenue
         FROM events e
         LEFT JOIN ticket_types tt ON tt.event_id = e.id
        WHERE e.organization_id = $1 AND e.deleted_at IS NULL
        GROUP BY e.id
        ORDER BY sold DESC
        LIMIT 5`,
      [orgId],
    ),
    getCurrency(),
  ]);

  const row = totals.rows[0];

  return {
    currency,
    ticketsSold: Number(row.sold),
    capacity: Number(row.capacity),
    revenue: Number(row.revenue),
    participants: Number(row.participants),
    scans: Number(row.scans),
    dailySales: daily.rows.map((item) => ({ date: item.date, sales: Number(item.sales) })),
    ticketTypes: types.rows.map((item) => ({ name: item.name, sold: Number(item.sold) })),
    topEvents: top.rows.map((item) => ({
      id: item.id,
      title: item.title,
      sold: Number(item.sold),
      capacity: Number(item.capacity),
      revenue: Number(item.revenue),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Profil organisateur                                                 */
/* ------------------------------------------------------------------ */

export async function getOrganizerProfile(slug: string): Promise<OrganizerProfile | null> {
  const { rows } = await pool.query(
    `SELECT id, name, slug, description, logo_url, website_url, country_code,
            verification_status::text AS verification_status, social_links
       FROM organizations
      WHERE slug = $1
      LIMIT 1`,
    [slug],
  );

  const organization = rows[0];
  if (!organization) return null;

  const { rows: events } = await pool.query(
    `SELECT e.id, e.title, e.city, e.cover_url,
            d.starts_at AS date,
            (SELECT min(tt.price_amount) FROM ticket_types tt
              WHERE tt.event_id = e.id AND tt.is_active = true) AS price,
            COALESCE(sum(tt.quantity_sold), 0)::int AS sold,
            COALESCE(sum(tt.quantity_total), 0)::int AS capacity
       FROM events e
       LEFT JOIN LATERAL (
         SELECT starts_at FROM event_dates
          WHERE event_id = e.id ORDER BY starts_at ASC LIMIT 1
       ) d ON TRUE
       LEFT JOIN ticket_types tt ON tt.event_id = e.id
      WHERE e.organization_id = $1
        AND e.deleted_at IS NULL
        AND e.status::text = 'published'
      GROUP BY e.id, d.starts_at
      ORDER BY d.starts_at ASC NULLS LAST`,
    [organization.id],
  );

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    description: organization.description,
    logoUrl: organization.logo_url,
    websiteUrl: organization.website_url,
    countryCode: organization.country_code,
    verificationStatus: organization.verification_status,
    socialLinks: (organization.social_links ?? {}) as Record<string, string>,
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      city: event.city,
      coverUrl: event.cover_url,
      date: toIso(event.date),
      price: event.price === null ? null : Number(event.price),
      sold: Number(event.sold),
      capacity: Number(event.capacity),
    })),
    participants: events.reduce((total, event) => total + Number(event.sold), 0),
  };
}

/* ------------------------------------------------------------------ */
/* Billet (QR)                                                         */
/* ------------------------------------------------------------------ */

export async function getTicketForQr(ticketId: string): Promise<TicketQrData | null> {
  const organization = await requireOrganization();

  const { rows } = await pool.query(
    `SELECT t.id, t.qr_token, t.holder_name, t.holder_email,
            e.title AS event_title, e.logo_url AS event_logo_url,
            tt.name AS ticket_type, tt.price_amount,
            o.order_number
       FROM tickets t
       JOIN events e ON e.id = t.event_id
       JOIN ticket_types tt ON tt.id = t.ticket_type_id
       LEFT JOIN orders o ON o.id = t.order_id
      WHERE t.id = $1 AND e.organization_id = $2
      LIMIT 1`,
    [ticketId, organization.id],
  );

  const ticket = rows[0];
  if (!ticket) return null;

  return {
    id: ticket.id,
    code: ticket.qr_token,
    event: ticket.event_title,
    logoUrl: ticket.event_logo_url,
    ticketType: ticket.ticket_type,
    price: Number(ticket.price_amount),
    holderName: ticket.holder_name ?? "—",
    holderEmail: ticket.holder_email ?? "",
    orderNumber: ticket.order_number,
    currency: await getCurrency(),
  };
}
