import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
async function test() {
  try {
    const { data, error } = await sb.from("licencas").select("count").limit(1);
    console.log("Data:", data, "Error:", error);
  } catch (e) {
    console.log("Critical Error:", e);
  }
}
test();
