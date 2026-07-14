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
    const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const seg = () => Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join("");
    return {
      id: `l${String(i + 1).padStart(2, "0")}`,
      key: `${seg()}-${seg()}-${seg()}-${seg()}`,
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

// Massive dataset for "MODO TESTE" — 50 clientes, 120 licenças, 90 dispositivos,
// 300 ativações, 12 blacklist, 40 logs. Determinístico o suficiente para testar
// paginação, filtros, busca, seleção múltipla e exportação em escala.
export function seedHeavy(): State {
  const first = ["Ana","Bruno","Carla","Diego","Eduardo","Fernanda","Gabriel","Helena","Igor","Julia","Kaio","Larissa","Marcos","Natália","Otávio","Paula","Quésia","Rafael","Sofia","Tiago","Ulisses","Vitória","Wagner","Xavier","Yasmin","Zeca"];
  const last = ["Alves","Barbosa","Cardoso","Duarte","Esteves","Ferreira","Gomes","Henriques","Ibanez","Justino","Klein","Lima","Moreira","Nunes","Oliveira","Peixoto","Queiroz","Rocha","Santos","Teixeira"];
  const companies = ["MR Máxima","Estúdio AB","DevCM","FluxLabs","Torres Studio","Rocha Design","SatoCode","NeoNoir Labs","Pixel Forge","Nova Cria","Máxima OPS","Studio 42","BR Softworks","AlphaLoop","Cyan Ventures"];
  const products = ["MR Sem Limites","MR Sem Limites Pro","MR Ext Sem Limites","MR Sem Limites (TESTE)"];
  const oss = ["Windows 11","Windows 10","macOS 15","macOS 14","Ubuntu 24.04","Fedora 40"];
  const browsers = ["Chrome 141","Edge 141","Brave 1.79","Arc 1.8","Firefox 129","Opera 114"];
  const ips = ["189.44.12.10","177.53.98.6","201.10.44.19","45.180.220.7","191.5.223.44","138.204.11.9","187.19.55.101","201.44.78.9","152.245.66.7","179.108.203.14"];

  const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];
  const seg = (i: number) => Math.abs((i * 2654435761) >>> 0).toString(36).slice(0, 4).toUpperCase();
  const key = (i: number) => `MRSL-${seg(i)}-${seg(i * 7)}-${seg(i * 13)}-${seg(i * 19)}`;

  const customers = Array.from({ length: 50 }).map((_, i) => {
    const name = `${pick(first, i)} ${pick(last, i * 3)}`;
    return {
      id: `c${String(i + 1).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@${pick(companies, i).toLowerCase().replace(/[^a-z]/g, "")}.com`,
      phone: `+55 ${11 + (i % 80)} 9${String(10000000 + i * 137).slice(0, 8)}`,
      company: pick(companies, i),
      document: i % 2 === 0
        ? `${String(10 + i).padStart(2,"0")}.${String(100 + i).padStart(3,"0")}.${String(200 + i).padStart(3,"0")}/0001-${String(10 + (i % 89)).padStart(2,"0")}`
        : `${String(100 + i).padStart(3,"0")}.${String(200 + i).padStart(3,"0")}.${String(300 + i).padStart(3,"0")}-${String(10 + (i % 89)).padStart(2,"0")}`,
      notes: i % 7 === 0 ? "Cliente VIP" : i % 11 === 0 ? "Reembolso solicitado" : "",
      status: (i % 12 === 11 ? "inactive" : "active") as "active" | "inactive",
      createdAt: isoDaysAgo(200 - i * 3),
    };
  });

  const licenses = Array.from({ length: 120 }).map((_, i) => {
    const cust = customers[i % customers.length];
    const isTrial = i % 15 === 0;
    const status = (i % 20 === 0 ? "blocked" : i % 17 === 0 ? "expired" : i % 23 === 0 ? "pending" : "active") as any;
    const k = isTrial ? `TRIAL-${key(i)}` : key(i);
    return {
      id: `l${String(i + 1).padStart(3, "0")}`,
      key: k,
      product: isTrial ? "MR Sem Limites (TESTE)" : pick(products, i),
      customerId: cust.id,
      status,
      createdAt: isoDaysAgo(180 - (i % 180)),
      expiresAt: isTrial
        ? new Date(Date.now() + (30 + (i % 6) * 30) * 60_000).toISOString()
        : (status === "expired" ? isoDaysAgo(5 + (i % 30)) : isoDaysAhead(30 + (i % 300))),
      hwid: i % 4 === 0 ? null : `HWID-${seg(i)}${seg(i * 5)}`,
      deviceIds: [],
      history: [
        { ts: isoDaysAgo(180 - (i % 180)), action: "created", by: "sistema" },
        ...(i % 8 === 0 ? [{ ts: isoDaysAgo(20), action: "renewed +60d", by: "rogeriocftv.mr@gmail.com" }] : []),
        ...(status === "blocked" ? [{ ts: isoDaysAgo(3), action: "blocked", by: "mariocftv@gmail.com", note: "suspeita" }] : []),
      ],
    };
  });

  const devices = Array.from({ length: 90 }).map((_, i) => {
    const lic = licenses[i % licenses.length];
    return {
      id: `d${String(i + 1).padStart(3, "0")}`,
      hwid: lic.hwid || `HWID-${seg(i)}${seg(i * 11)}`,
      os: pick(oss, i),
      browser: pick(browsers, i * 2),
      firstSeen: isoDaysAgo(150 - (i % 150)),
      lastSeen: isoDaysAgo((i % 15)),
      licenseId: lic.id,
      customerId: lic.customerId,
      status: (i % 18 === 0 ? "blocked" : "active") as any,
    };
  });

  const activations = Array.from({ length: 300 }).map((_, i) => {
    const lic = licenses[i % licenses.length];
    const dev = devices[i % devices.length];
    const result = i % 11 === 0 ? "fail" : i % 19 === 0 ? "blocked" : "success";
    return {
      id: `a${String(i + 1).padStart(4, "0")}`,
      ts: isoDaysAgo(i / 6),
      customerId: lic.customerId,
      licenseId: lic.id,
      hwid: dev.hwid,
      ip: pick(ips, i),
      os: dev.os,
      version: i % 3 === 0 ? "2.1.0" : i % 5 === 0 ? "2.0.9" : "2.0.4",
      result: result as any,
    };
  });

  const blacklist = Array.from({ length: 12 }).map((_, i) => {
    const types = ["hwid","ip","license","customer"] as const;
    const type = types[i % types.length];
    const value = type === "hwid" ? `HWID-${seg(i * 3)}${seg(i * 5)}`
      : type === "ip" ? pick(ips, i)
      : type === "license" ? licenses[i % licenses.length].key
      : customers[i % customers.length].id;
    return {
      id: `b${String(i + 1).padStart(3, "0")}`,
      type,
      value,
      reason: pick(["Chave pirata","Chargeback","Força bruta","Revenda","Uso indevido","Fraude confirmada"], i),
      adminId: i % 2 === 0 ? "rogeriocftv.mr@gmail.com" : "mariocftv@gmail.com",
      createdAt: isoDaysAgo(50 - i * 3),
    };
  });

  const logActions = ["license.create","license.renew","license.block","license.unblock","license.reset_hwid","license.transfer","customer.create","customer.update","device.block","activation.record","blacklist.create"];
  const logs = Array.from({ length: 40 }).map((_, i) => ({
    id: `lg${String(i + 1).padStart(3, "0")}`,
    ts: isoDaysAgo(i / 4),
    action: pick(logActions, i),
    adminId: i % 2 === 0 ? "rogeriocftv.mr@gmail.com" : "mariocftv@gmail.com",
    target: pick(licenses, i).key,
    note: i % 6 === 0 ? "modo teste" : undefined,
  }));

  return { customers, licenses, devices, activations, blacklist, logs };
}
