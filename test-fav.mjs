import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
  const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
  const uid = profiles[0].id;
  const { data, error } = await supabase.from("favorites").insert({ user_id: uid, location_id: "8" });
  console.log("Error inserting 8:", error);
}
run();
