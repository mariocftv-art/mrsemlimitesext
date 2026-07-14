// Shared type definitions for the admin panel mock data layer.
export type ID = string;
export type ISO = string;

export type LicenseStatus = "active" | "blocked" | "expired" | "pending";
export type License = {
  id: ID;
  key: string;
  product: string;
  customerId: ID | null;
  status: LicenseStatus;
  createdAt: ISO;
  expiresAt: ISO;
  hwid: string | null;
  deviceIds: ID[];
  history: { ts: ISO; action: string; by: string; note?: string }[];
};

export type Customer = {
  id: ID;
  name: string;
  email: string;
  phone: string;
  company: string;
  document: string; // CPF/CNPJ
  notes: string;
  status: "active" | "inactive";
  createdAt: ISO;
};

export type Device = {
  id: ID;
  hwid: string;
  os: string;
  browser: string;
  firstSeen: ISO;
  lastSeen: ISO;
  licenseId: ID | null;
  customerId: ID | null;
  status: "active" | "blocked";
};

export type Activation = {
  id: ID;
  ts: ISO;
  customerId: ID | null;
  licenseId: ID | null;
  hwid: string;
  ip: string;
  os: string;
  version: string;
  result: "success" | "fail" | "blocked";
};

export type BlacklistType = "hwid" | "ip" | "license" | "customer";
export type BlacklistEntry = {
  id: ID;
  type: BlacklistType;
  value: string;
  reason: string;
  adminId: string;
  createdAt: ISO;
};

export type LogEntry = {
  id: ID;
  ts: ISO;
  action: string;
  adminId: string;
  target?: string;
  note?: string;
};

export type AdminSession = { email: string; ts: number } | null;

export type State = {
  licenses: License[];
  customers: Customer[];
  devices: Device[];
  activations: Activation[];
  blacklist: BlacklistEntry[];
  logs: LogEntry[];
};
