import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLicense } from "./reseller-api.functions";

export const purchaseLicense = createServerFn({ method: "POST" })
  .inputValidator((d) => 
    z.object({
      email: z.string().email(),
      name: z.string(),
      duration_days: z.number().optional().default(30),
      payment_method: z.enum(["pix", "card"]),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    // In a real implementation, we would integrate with Mercado Pago / Kiwify here.
    // For now, we simulate the reseller API call as requested.
    return createLicense({ 
      data: {
        email: data.email,
        name: data.name,
        duration_days: data.duration_days,
        type: "premium"
      } 
    });
  });
