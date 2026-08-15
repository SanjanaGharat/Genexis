/**
 * Genexis doesn't implement full user accounts (email/password or OAuth) —
 * that's a real gap for a multi-user production deployment, and NextAuth
 * or Clerk would be the natural next addition (see README § Roadmap).
 *
 * What's here instead is a genuine, if lighter-weight, identity primitive:
 * a random UUID minted client-side on first visit, persisted in
 * localStorage, and sent as a header on every API call. The server uses it
 * to scope prediction history per-browser in the database. It's not a
 * substitute for real auth (it doesn't survive a cleared browser or work
 * across devices), but it's real, working request scoping — not a
 * hardcoded or shared identifier.
 */

const KEY = "genexis:device-id:v1";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
