// Deterministic seed data — 15 licenses, 8 customers, 12 devices, 30 activations,
// 4 blacklist, plus initial log entries.
import type { State } from "./types";

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400_000).toISOString();
}
function isoDaysAhead(days: number): string {
  return new Date(Date.now() + days * 86400_000).toISOString();
}

export function seed(): State {
  const customers = [
    { id: "c01", name: "Rogério Fernandes", email: "rogerio@mrmaxima.com", phone: "+55 11 90000-0001", company: "MR Máxima", document: "12.345.678/0001-90", notes: "Cliente fundador.", status: "active" as const, createdAt: isoDaysAgo(180) },
    { id: "c02", name: "Mário Cavalcante", email: "mario@mrmaxima.com", phone: "+55 21 90000-0002", company: "MR Máxima", document: "234.567.890-11", notes: "Co-admin.", status: "active" as const, createdAt: isoDaysAgo(175) },
    { id: "c03", name: "Ana Beatriz Souza", email: "ana@estudioab.com.br", phone: "+55 31 90000-0003", company: "Estúdio AB", document: "22.333.444/0001-55", notes: "Assinatura anual.", status: "active" as const, createdAt: isoDaysAgo(90) },
    { id: "c04", name: "Carlos Menezes", email: "carlos@devcm.io", phone: "+55 41 90000-0004", company: "DevCM", document: "345.678.901-22", notes: "Solicitou HWID reset em 2x.", status: "active" as const, createdAt: isoDaysAgo(60) },
    { id: "c05", name: "Fernanda Lima", email: "fernanda@fluxlabs.io", phone: "+55 51 90000-0005", company: "FluxLabs", document: "33.444.555/0001-66", notes: "", status: "active" as const, createdAt: isoDaysAgo(45) },
    { id: "c06", name: "Rafael Torres", email: "rafa@torres.dev", phone: "+55 71 90000-0006", company: "Torres Studio", document: "456.789.012-33", notes: "Downgrade solicitado.", status: "inactive" as const, createdAt: isoDaysAgo(30) },
    { id: "c07", name: "Juliana Rocha", email: "juliana@rochadesign.com", phone: "+55 81 90000-0007", company: "Rocha Design", document: "44.555.666/0001-77", notes: "Beta tester Fase 2.", status: "active" as const, createdAt: isoDaysAgo(20) },
    { id: "c08", name: "Bruno Sato", email: "bruno@satocode.dev", phone: "+55 11 90000-0008", company: "SatoCode", document: "567.890.123-44", notes: "Compra corporativa.", status: "active" as const, createdAt: isoDaysAgo(7) },
  ];

  const products = ["MR Sem Limites", "MR Sem Limites Pro", "MR Ext Sem Limites"];
  const oss = ["Windows 11", "Windows 10", "macOS 15", "Ubuntu 24.04"];
  const browsers = ["Chrome 141", "Edge 141", "Brave 1.79", "Arc 1.8"];
  const ips = ["189.44.12.10", "177.53.98.6", "201.10.44.19", "45.180.220.7", "191.5.223.44"];

  const licenses = Array.from({ length: 15 }).map((_, i) => {
    const cust = customers[i % customers.length];
    const active = i % 6 !== 5;
    const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return {
      id: `l${String(i + 1).padStart(2, "0")}`,
      key: `MRSL-${seg()}-${seg()}-${seg()}-${seg()}`,
      product: products[i % products.length],
      customerId: cust.id,
      status: (i === 4 ? "blocked" : i === 9 ? "expired" : i === 12 ? "pending" : "active") as any,
      createdAt: isoDaysAgo(120 - i * 6),
      expiresAt: isoDaysAhead(active ? 120 + i * 10 : -15),
      hwid: i % 3 === 0 ? null : `HWID-${seg()}${seg()}`,
      deviceIds: [],
      history: [
        { ts: isoDaysAgo(120 - i * 6), action: "created", by: "sistema" },
        ...(i % 4 === 0
          ? [{ ts: isoDaysAgo(30), action: "renewed +90d", by: "rogeriocftv.mr@gmail.com" }]
          : []),
      ],
    };
  });

  const devices = Array.from({ length: 12 }).map((_, i) => {
    const lic = licenses[i % licenses.length];
    return {
      id: `d${String(i + 1).padStart(2, "0")}`,
      hwid: lic.hwid || `HWID-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      os: oss[i % oss.length],
      browser: browsers[i % browsers.length],
      firstSeen: isoDaysAgo(90 - i * 4),
      lastSeen: isoDaysAgo(Math.max(0, 4 - (i % 5))),
      licenseId: lic.id,
      customerId: lic.customerId,
      status: (i === 3 ? "blocked" : "active") as any,
    };
  });

  const activations = Array.from({ length: 30 }).map((_, i) => {
    const lic = licenses[i % licenses.length];
    const dev = devices[i % devices.length];
    const result = i % 9 === 0 ? "fail" : i % 13 === 0 ? "blocked" : "success";
    return {
      id: `a${String(i + 1).padStart(3, "0")}`,
      ts: isoDaysAgo(i / 3),
      customerId: lic.customerId,
      licenseId: lic.id,
      hwid: dev.hwid,
      ip: ips[i % ips.length],
      os: dev.os,
      version: i % 4 === 0 ? "2.1.0" : "2.0.4",
      result: result as any,
    };
  });

  const blacklist = [
    { id: "b01", type: "hwid" as const, value: "HWID-ABCD-EF12", reason: "Chave pirata detectada", adminId: "rogeriocftv.mr@gmail.com", createdAt: isoDaysAgo(40) },
    { id: "b02", type: "ip" as const, value: "45.180.220.7", reason: "Ataque de força bruta", adminId: "rogeriocftv.mr@gmail.com", createdAt: isoDaysAgo(22) },
    { id: "b03", type: "license" as const, value: "MRSL-XXXX-YYYY-ZZZZ-0001", reason: "Revenda não autorizada", adminId: "mariocftv@gmail.com", createdAt: isoDaysAgo(10) },
    { id: "b04", type: "customer" as const, value: "c06", reason: "Chargeback", adminId: "mariocftv@gmail.com", createdAt: isoDaysAgo(3) },
  ];

  const logs = [
    { id: "lg01", ts: isoDaysAgo(0.1), action: "system.boot", adminId: "sistema", note: "painel iniciado" },
    { id: "lg02", ts: isoDaysAgo(1), action: "license.create", adminId: "rogeriocftv.mr@gmail.com", target: licenses[0].key },
    { id: "lg03", ts: isoDaysAgo(2), action: "customer.create", adminId: "rogeriocftv.mr@gmail.com", target: customers[7].email },
    { id: "lg04", ts: isoDaysAgo(3), action: "device.block", adminId: "mariocftv@gmail.com", target: devices[3].hwid, note: "suspeita de fraude" },
  ];

  return { customers, licenses, devices, activations, blacklist, logs };
}
