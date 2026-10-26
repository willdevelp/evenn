import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => {
  const s = process.env.TICKET_SECRET;
  if (!s || s.length < 32) throw new Error("TICKET_SECRET manquant ou trop court (32 caractères minimum)");
  return s;
};

const sign = (ticketId: string) => createHmac("sha256", secret()).update(ticketId).digest("base64url");

/** Jeton à encoder dans le QR code : "<ticketId>.<signature>". Impossible à fabriquer sans TICKET_SECRET. */
export function makeTicketToken(ticketId: string): string {
  return `${ticketId}.${sign(ticketId)}`;
}

/** Vérifie la signature et renvoie l'id du ticket, ou null si le jeton est falsifié. */
export function verifyTicketToken(token: string): string | null {
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const id = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(id));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return id;
}
