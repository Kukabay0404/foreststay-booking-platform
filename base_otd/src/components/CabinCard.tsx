// components/CabinCard.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface Cabin {
  id: number;
  title: string;
  description?: string;
  category: string;
  rooms: number;
  floors: number;
  beds: number;
  priceWeekdays: number;
  priceWeekend: number;
  pool: boolean;
  images?: string[];
}

function normalizeImagePath(path: string): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.includes("\\") || path.includes(":")) {
    const fileName = path.split("\\").pop();
    return `/cabins/${fileName}`;
  }
  if (!path.startsWith("/")) return `/cabins/${path}`;
  return path;
}

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white rounded-2xl shadow-md p-6">
      {/* Галерея */}
      <div>
        <div className="relative w-full h-80 rounded-lg overflow-hidden">
          <Image
            src={
              cabin.images && cabin.images.length > 0
                ? normalizeImagePath(cabin.images[currentImage])
                : "/placeholder.jpg"
            }
            alt={cabin.title}
            fill
            className="object-cover"
          />
          {/* Навигация */}
          {cabin.images && cabin.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === 0 ? cabin.images!.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded p-2 shadow"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === cabin.images!.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded p-2 shadow"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Миниатюры */}
        {cabin.images && cabin.images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {cabin.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative w-20 h-16 cursor-pointer rounded overflow-hidden border ${
                  index === currentImage ? "border-green-600" : "border-transparent"
                }`}
              >
                <Image
                  src={normalizeImagePath(img)}
                  alt={`thumb-${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">{cabin.title}</h2>
        {cabin.description && (
          <p className="text-gray-600">{cabin.description}</p>
        )}
        <p>
          <span className="font-semibold">Категория:</span> {cabin.category}
        </p>
        <p>
          <span className="font-semibold">Этажей:</span> {cabin.floors}
        </p>
        <p>
          <span className="font-semibold">Комнат:</span> {cabin.rooms}
        </p>
        <p>
          <span className="font-semibold">Спальных мест:</span> {cabin.beds}
        </p>
        <p>
          <span className="font-semibold">Бассейн:</span>{" "}
          {cabin.pool ? "Да" : "Нет"}
        </p>
        <div className="mt-4 space-y-1">
          <p>
            Будни:{" "}
            <span className="font-semibold">
              {cabin.priceWeekdays.toLocaleString()} тг
            </span>
          </p>
          <p>
            Выходные:{" "}
            <span className="font-semibold">
              {cabin.priceWeekend.toLocaleString()} тг
            </span>
          </p>
        </div>
        <Link href={`/checkout?cabinId=${cabin.id}`}>
          <button className="mt-4 bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-lg font-semibold">
            Забронировать
          </button>
        </Link>
      </div>
    </div>
  );
}
