import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
  const { data: mims17 } = await supabase.from("locations").select("*").eq("id", 17).single();
  const { data: mims47 } = await supabase.from("locations").select("*").eq("id", 47).single();

  if (mims17 && mims47) {
    const images17 = mims17.images || [];
    const images47 = mims47.images || [];
    const mergedImages = [...new Set([...images17, ...images47])];
    
    console.log("Merged images:", mergedImages);
    
    // Update id: 17
    const { error } = await supabase.from("locations").update({ images: mergedImages }).eq("id", 17);
    if (error) console.error("Error updating 17:", error);
    else console.log("Updated 17 successfully!");
    
    // Delete id: 47 (optional, but probably good so they don't have duplicates)
    const { error: delError } = await supabase.from("locations").delete().eq("id", 47);
    if (delError) console.error("Error deleting 47:", delError);
    else console.log("Deleted 47 successfully!");
  } else {
    console.log("Could not find both Mims entries.");
  }
}
run();
