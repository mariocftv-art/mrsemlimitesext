// Admin identity + password handling.
// Passwords are hashed with SHA-256(salt + password) via WebCrypto.
// Persisted to localStorage (mrsl.admins.v1). Session: mrsl.admin.session.

const KEY_ADMINS = "mrsl.admins.v1";
const KEY_SESSION = "mrsl.admin.session";

export const ADMIN_EMAILS = [
  "rogeriocftv.mr@gmail.com",
  "mariocftv@gmail.com",
] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

type StoredAdmins = Record<string, { salt: string; hash: string }>;

function b64(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return typeof btoa !== "undefined" ? btoa(s) : Buffer.from(s, "binary").toString("base64");
}
async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function readAdmins(): StoredAdmins {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY_ADMINS) || "{}");
  } catch {
    return {};
  }
}
function writeAdmins(a: StoredAdmins) {
  window.localStorage.setItem(KEY_ADMINS, JSON.stringify(a));
}

export function isFirstRun(): boolean {
  // Só considera "primeira execução" quando NENHUM admin tem senha.
  // Assim, se um dos administradores já configurou a senha, o painel
  // vai direto para a tela de login em vez de pedir setup novamente.
  const a = readAdmins();
  return ADMIN_EMAILS.every((e) => !a[e]);
}

export function pendingAdmins(): AdminEmail[] {
  const a = readAdmins();
  return ADMIN_EMAILS.filter((e) => !a[e]) as AdminEmail[];
}

export function hasAdmin(email: string): boolean {
  return !!readAdmins()[email];
}

export async function setPassword(email: AdminEmail, password: string) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(12));
  const salt = b64(saltBytes);
  const hash = await sha256Hex(salt + password);
  const admins = readAdmins();
  admins[email] = { salt, hash };
  writeAdmins(admins);
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const a = readAdmins()[email];
  if (!a) return false;
  const hash = await sha256Hex(a.salt + password);
  return hash === a.hash;
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const s = JSON.parse(window.localStorage.getItem(KEY_SESSION) || "null");
    return s?.email || null;
  } catch {
    return null;
  }
}

export function startSession(email: string) {
  window.localStorage.setItem(KEY_SESSION, JSON.stringify({ email, ts: Date.now() }));
}
export function endSession() {
  window.localStorage.removeItem(KEY_SESSION);
}

export function resetAllAdmins() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_ADMINS);
  window.localStorage.removeItem(KEY_SESSION);
}
