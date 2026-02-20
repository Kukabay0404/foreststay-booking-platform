import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Нормализует путь к изображению: позволяет передавать абсолютные URL, локальные пути
// или Windows-стиль пути. Возвращает путь, пригодный для использования в `next/image`.
export function normalizeImagePath(path?: string) {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.includes("\\") || path.includes(":")) {
    const fileName = path.split("\\").pop();
    return `/rooms/${fileName}`;
  }
  if (!path.startsWith("/")) return `/rooms/${path}`;
  return path;
}
