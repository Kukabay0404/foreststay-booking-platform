const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");

export function mediaUrlFromKey(key: string): string {
  if (!mediaBaseUrl) return "/placeholder.jpg";
  return `${mediaBaseUrl}/${key.replace(/^\/+/, "")}`;
}

export function resolveMediaUrl(path?: string): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return mediaUrlFromKey(path);
}
