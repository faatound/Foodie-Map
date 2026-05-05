import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
  const { data: profiles } = await supabase.from("profiles").select("*").or("full_name.ilike.%faa%,username.ilike.%faa%");
  if (profiles && profiles.length > 0) {
    const { data: favs } = await supabase.from("favorites").select("*").eq("user_id", profiles[0].id);
    if (favs && favs.length > 0) {
      const { data: locs } = await supabase.from("locations").select("name").in("id", favs.map(f => f.location_id));
      console.log("Faa locations names:", locs.map(l => l.name));
    }
  }
}
run();
