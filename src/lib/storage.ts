import { supabase } from "./supabase";

/**
 * Uploads a file to a Supabase bucket
 * @param bucket The name of the bucket (e.g., 'avatars', 'photos')
 * @param path The path within the bucket (e.g., 'user_id/avatar.jpg')
 * @param file The file object from an input
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  console.log(`Tentative d'upload vers bucket: ${bucket}, chemin: ${path}`);
  
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    console.error("Erreur détaillée Supabase Storage:", error);
    throw error;
  }

  if (!data) {
    console.error("L'upload a réussi mais aucune donnée n'a été renvoyée.");
    throw new Error("Erreur de retour de données Supabase");
  }

  console.log("Upload réussi, récupération de l'URL publique pour:", data.path);
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);

  if (!publicUrl) {
    console.error("Impossible de générer l'URL publique.");
    throw new Error("Erreur de génération d'URL publique");
  }

  return publicUrl.publicUrl;
}

/**
 * Helper to upload a profile avatar
 */
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar-${Math.random()}.${fileExt}`;
  
  return uploadFile("Avatar", filePath, file);
}

/**
 * Helper to upload a location review photo
 */
export async function uploadReviewPhoto(locationId: string, userId: string, file: File) {
  const timestamp = Date.now();
  const fileExt = file.name.split(".").pop();
  const filePath = `locations/${locationId}/${userId}-${timestamp}.${fileExt}`;
  
  return uploadFile("Photos", filePath, file);
}
