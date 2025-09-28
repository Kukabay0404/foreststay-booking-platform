//RoomCard.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Plus, Minus } from "lucide-react";

export interface Room {
  id: number;
  title: string;
  category: string;
  rooms: number;
  area: string;
  beds: number;
  tv: boolean;
  priceWeekdays: string;
  priceWeekend: string;
  images: string[];
}

function normalizeImagePath(path: string): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.includes("\\") || path.includes(":")) {
    const fileName = path.split("\\").pop();
    return `/rooms/${fileName}`;
  }
  if (!path.startsWith("/")) return `/rooms/${path}`;
  return path;
}

export default function RoomCard({ room }: { room: Room }) {

  // даты
  const [dateRange, setDateRange] = useState<Range[]>([]);
  const [roomsGuests, setRoomsGuests] = useState([{ adults: 2, children: 0 }]);


  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const startISO = mounted && dateRange[0]?.startDate ? dateRange[0].startDate.toISOString() : "";
  const endISO = mounted && dateRange[0]?.endDate ? dateRange[0].endDate.toISOString() : "";

  const guestsQuery = roomsGuests
    .map((r, i) => `room${i + 1}=${r.adults}+${r.children}`)
    .join("&");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white rounded-2xl shadow-md p-6">
      {/* Галерея */}
      <div>
        <div className="relative w-full h-80 rounded-lg overflow-hidden">
          <Image
            src={
              room.images && room.images.length > 0
                ? normalizeImagePath(room.images[currentImage])
                : "/placeholder.jpg"
            }
            alt={room.title}
            fill
            className="object-cover"
          />
          {/* Навигация */}
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? room.images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded p-2 shadow"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === room.images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded p-2 shadow"
          >
            →
          </button>
        </div>
        {/* Миниатюры */}
        <div className="flex gap-3 mt-4">
          {room.images?.map((img, index) => (
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
      </div>

      {/* Инфо */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">{room.title}</h2>
        <p><span className="font-semibold">Категория аппартамента:</span> {room.category}</p>
        <p><span className="font-semibold">Комнат:</span> {room.rooms}</p>
        <p><span className="font-semibold">Квадратура:</span> {room.area}</p>
        <p><span className="font-semibold">Спальных мест:</span> {room.beds}</p>
        <p><span className="font-semibold">Телевизор:</span> {room.tv ? "да" : "нет"}</p>
        <div className="mt-4 space-y-1">
          <p>Будни: <span className="font-semibold">{room.priceWeekdays}</span></p>
          <p>Выходные: <span className="font-semibold">{room.priceWeekend}</span></p>
        </div>
        <Link
          href={`/checkout?roomId=${room.id}&roomTitle=${encodeURIComponent(
            room.title
          )}&checkIn=${encodeURIComponent(startISO)}&checkOut=${encodeURIComponent(
            endISO
          )}&${guestsQuery}`}
        >
          <button className="mt-4 bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-lg font-semibold">
            Забронировать
          </button>
        </Link>
      </div>
    </div>
  );
}
