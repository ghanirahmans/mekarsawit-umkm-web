const DEFAULT_LOCAL_PREFIX = "/uploads";

type StorageBackend = "local" | "supabase";

const backend: StorageBackend =
  (process.env.NEXT_PUBLIC_STORAGE_BACKEND as StorageBackend) || "local";

export function getPublicUrl(path?: string | null) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (backend === "local") return `${DEFAULT_LOCAL_PREFIX}/${path.replace(/^\//, "")}`;
  // For Supabase, path should already be full public URL from signed/public bucket
  return path;
}

export function describeStorage() {
  if (backend === "local") {
    return "Local upload folder (public/uploads). Move to Supabase Storage in prod.";
  }
  return "Supabase Storage (configure bucket + public URL).";
}
