import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api";

const getHeaders = () => {
  const apiKey = process.env.RESELLER_API_KEY;
  if (!apiKey) throw new Error("RESELLER_API_KEY is not configured");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
};

export const getBalance = createServerFn({ method: "GET" })
  .handler(async () => {
    const res = await fetch(`${API_BASE}/v1/balance`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
    return res.json();
  });

export const createLicense = createServerFn({ method: "POST" })
  .inputValidator((d) => 
    z.object({
      email: z.string().email(),
      name: z.string(),
      duration_days: z.number().optional().default(30),
      type: z.enum(["premium", "trial"]).optional().default("premium"),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${API_BASE}/v1/licenses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || "Failed to create license");
    }
    return res.json();
  });

export const resetLicenseHardware = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ license_id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_BASE}/v1/licenses/${data.license_id}/reset-hwid`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to reset HWID");
    return res.json();
  });
