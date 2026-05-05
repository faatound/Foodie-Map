import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: profiles } = await supabase.from("profiles").select("*").or("full_name.ilike.%faa%,username.ilike.%faa%");
  console.log("Faa profiles:", profiles);

  if (profiles && profiles.length > 0) {
    const { data: favs } = await supabase.from("favorites").select("*").eq("user_id", profiles[0].id);
    console.log("Faa favs:", favs);
    
    if (favs && favs.length > 0) {
      const { data: locs } = await supabase.from("locations").select("*").in("id", favs.map(f => f.location_id));
      console.log("Faa locations:", locs.map(l => ({ name: l.name, desc: l.description, img: l.image_url || l.hero_image })));
    }
  }
}
run();
