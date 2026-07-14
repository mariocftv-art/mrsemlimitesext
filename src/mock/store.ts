// Central mock store for the admin panel.
// - Persisted to localStorage (mrsl.state.v1).
// - Subscribable via useSyncExternalStore.
// - All mutating actions append an audit log entry.
import { useSyncExternalStore } from "react";
import type {
  State,
  License,
  Customer,
  Device,
  Activation,
  BlacklistEntry,
  LogEntry,
  ID,
} from "./types";
import { seed } from "./seed";
import { getSessionEmail } from "./admin";

const STORAGE_KEY = "mrsl.state.v1";

function loadState(): State {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = seed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as State;
  } catch {
    return seed();
  }
}

let state: State | null = null;
const listeners = new Set<() => void>();

function ensure(): State {
  if (!state) state = loadState();
  return state;
}
function set(updater: (s: State) => State) {
  state = updater(ensure());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(ensure()),
    () => selector(seed()),
  );
}

export function resetStore() {
  const fresh = seed();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {}
  state = fresh;
  listeners.forEach((l) => l());
}

const rid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const admin = () => getSessionEmail() ?? "sistema";

function log(action: string, target?: string, note?: string): LogEntry {
  return { id: rid(), ts: now(), action, adminId: admin(), target, note };
}
function addLog(entry: LogEntry) {
  set((s) => ({ ...s, logs: [entry, ...s.logs] }));
}

// ---------- LICENSES ----------
export const licenseActions = {
  generateKey(): string {
    const seg = () =>
      Math.random().toString(36).slice(2, 6).toUpperCase();
    return `MRSL-${seg()}-${seg()}-${seg()}-${seg()}`;
  },
  create(input: Partial<License>): License {
    const l: License = {
      id: rid(),
      key: input.key || licenseActions.generateKey(),
      product: input.product || "MR Sem Limites",
      customerId: input.customerId || null,
      status: input.status || "active",
      createdAt: now(),
      expiresAt:
        input.expiresAt ||
        new Date(Date.now() + 365 * 86400_000).toISOString(),
      hwid: input.hwid || null,
      deviceIds: input.deviceIds || [],
      history: [{ ts: now(), action: "created", by: admin() }],
    };
    set((s) => ({ ...s, licenses: [l, ...s.licenses] }));
    addLog(log("license.create", l.key));
    return l;
  },
  update(id: ID, patch: Partial<License>) {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
    addLog(log("license.update", id));
  },
  renew(id: ID, days: number) {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) => {
        if (l.id !== id) return l;
        const base = Math.max(Date.now(), new Date(l.expiresAt).getTime());
        return {
          ...l,
          expiresAt: new Date(base + days * 86400_000).toISOString(),
          status: "active",
          history: [
            { ts: now(), action: `renewed +${days}d`, by: admin() },
            ...l.history,
          ],
        };
      }),
    }));
    addLog(log("license.renew", id, `+${days}d`));
  },
  block(id: ID, reason = "") {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "blocked",
              history: [
                { ts: now(), action: "blocked", by: admin(), note: reason },
                ...l.history,
              ],
            }
          : l,
      ),
    }));
    addLog(log("license.block", id, reason));
  },
  unblock(id: ID) {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "active",
              history: [
                { ts: now(), action: "unblocked", by: admin() },
                ...l.history,
              ],
            }
          : l,
      ),
    }));
    addLog(log("license.unblock", id));
  },
  remove(id: ID) {
    set((s) => ({ ...s, licenses: s.licenses.filter((l) => l.id !== id) }));
    addLog(log("license.delete", id));
  },
  duplicate(id: ID): License | null {
    const src = ensure().licenses.find((l) => l.id === id);
    if (!src) return null;
    const copy = licenseActions.create({
      product: src.product,
      customerId: src.customerId,
      expiresAt: src.expiresAt,
      status: "pending",
    });
    addLog(log("license.duplicate", id, copy.key));
    return copy;
  },
  resetHwid(id: ID) {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              hwid: null,
              deviceIds: [],
              history: [
                { ts: now(), action: "hwid_reset", by: admin() },
                ...l.history,
              ],
            }
          : l,
      ),
    }));
    addLog(log("license.reset_hwid", id));
  },
  transfer(id: ID, toCustomerId: ID) {
    set((s) => ({
      ...s,
      licenses: s.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              customerId: toCustomerId,
              history: [
                {
                  ts: now(),
                  action: `transfer -> ${toCustomerId}`,
                  by: admin(),
                },
                ...l.history,
              ],
            }
          : l,
      ),
    }));
    addLog(log("license.transfer", id, toCustomerId));
  },
};

// ---------- CUSTOMERS ----------
export const customerActions = {
  create(input: Partial<Customer>): Customer {
    const c: Customer = {
      id: rid(),
      name: input.name || "Novo cliente",
      email: input.email || "",
      phone: input.phone || "",
      company: input.company || "",
      document: input.document || "",
      notes: input.notes || "",
      status: input.status || "active",
      createdAt: now(),
    };
    set((s) => ({ ...s, customers: [c, ...s.customers] }));
    addLog(log("customer.create", c.email || c.name));
    return c;
  },
  update(id: ID, patch: Partial<Customer>) {
    set((s) => ({
      ...s,
      customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    addLog(log("customer.update", id));
  },
  remove(id: ID) {
    set((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) }));
    addLog(log("customer.delete", id));
  },
  toggleStatus(id: ID) {
    set((s) => ({
      ...s,
      customers: s.customers.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c,
      ),
    }));
    addLog(log("customer.toggle_status", id));
  },
};

// ---------- DEVICES ----------
export const deviceActions = {
  create(input: Partial<Device>): Device {
    const d: Device = {
      id: rid(),
      hwid: input.hwid || `HWID-${rid().toUpperCase()}`,
      os: input.os || "Windows 11",
      browser: input.browser || "Chrome 141",
      firstSeen: now(),
      lastSeen: now(),
      licenseId: input.licenseId || null,
      customerId: input.customerId || null,
      status: input.status || "active",
    };
    set((s) => ({ ...s, devices: [d, ...s.devices] }));
    addLog(log("device.create", d.hwid));
    return d;
  },
  block(id: ID) {
    set((s) => ({
      ...s,
      devices: s.devices.map((d) => (d.id === id ? { ...d, status: "blocked" } : d)),
    }));
    addLog(log("device.block", id));
  },
  unblock(id: ID) {
    set((s) => ({
      ...s,
      devices: s.devices.map((d) => (d.id === id ? { ...d, status: "active" } : d)),
    }));
    addLog(log("device.unblock", id));
  },
  reset(id: ID) {
    set((s) => ({
      ...s,
      devices: s.devices.map((d) =>
        d.id === id ? { ...d, licenseId: null, customerId: null } : d,
      ),
    }));
    addLog(log("device.reset", id));
  },
  remove(id: ID) {
    set((s) => ({ ...s, devices: s.devices.filter((d) => d.id !== id) }));
    addLog(log("device.delete", id));
  },
};

// ---------- ACTIVATIONS ----------
export const activationActions = {
  create(input: Partial<Activation>): Activation {
    const a: Activation = {
      id: rid(),
      ts: now(),
      customerId: input.customerId || null,
      licenseId: input.licenseId || null,
      hwid: input.hwid || "HWID-UNKNOWN",
      ip: input.ip || "0.0.0.0",
      os: input.os || "Windows",
      version: input.version || "2.1.0",
      result: input.result || "success",
    };
    set((s) => ({ ...s, activations: [a, ...s.activations] }));
    addLog(log("activation.record", a.hwid, a.result));
    return a;
  },
};

// ---------- BLACKLIST ----------
export const blacklistActions = {
  create(input: Partial<BlacklistEntry>): BlacklistEntry {
    const b: BlacklistEntry = {
      id: rid(),
      type: input.type || "hwid",
      value: input.value || "",
      reason: input.reason || "",
      adminId: admin(),
      createdAt: now(),
    };
    set((s) => ({ ...s, blacklist: [b, ...s.blacklist] }));
    addLog(log("blacklist.create", `${b.type}:${b.value}`, b.reason));
    return b;
  },
  update(id: ID, patch: Partial<BlacklistEntry>) {
    set((s) => ({
      ...s,
      blacklist: s.blacklist.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
    addLog(log("blacklist.update", id));
  },
  remove(id: ID) {
    set((s) => ({ ...s, blacklist: s.blacklist.filter((b) => b.id !== id) }));
    addLog(log("blacklist.delete", id));
  },
};

// ---------- LOGS ----------
export const logActions = {
  push(action: string, target?: string, note?: string) {
    addLog(log(action, target, note));
  },
};
