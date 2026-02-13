import { getSupabaseAdmin } from "./supabase";

const BUCKET = "images";

/**
 * Upload a file to Supabase Storage.
 * @returns The full public URL of the uploaded file.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new Error(`Upload gagal: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  // Extract the path from the public URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/images/<path>
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return; // Not a Supabase Storage URL, skip

  const filePath = publicUrl.slice(idx + marker.length);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);

  if (error) {
    console.error("Supabase Storage delete error:", error);
  }
}

/**
 * Get a display-ready URL for an image path.
 * Handles both full URLs (Supabase) and legacy local paths.
 */
export function getPublicUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  // Legacy local uploads fallback
  return `/uploads/${path.replace(/^\//, "")}`;
}
