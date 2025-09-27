// app/booking/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Plus, Minus } from "lucide-react";

interface Room {
  id: number;
  title: string;
  image: string;
  gallery: string[];
  price: number;
  capacity: string;
  size: string;
  description: string;
  available: number;
}

const rooms: Room[] = [
  {
    id: 1,
    title: "Сруб №9",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nizkaya_terrasa.jpg/1200px-Nizkaya_terrasa.jpg",
    gallery: [
      "https://lesark.ru/upload/medialibrary/749/749212af974fb3f577affa1df4962bef.jpg",
      "https://i.pinimg.com/originals/95/31/2d/95312d536a69af0e6ec1f311f5aef122.jpg",
      "https://img.ukr.bio/data/articles/img/6911/rozkishnuj_derevjanuj_bydunok_33.jpg",
      "https://sdk-putilovo.ru/images/stroitelstvo/interer-doma-iz-brevna_5d3c84b3a70f9.jpg",
    ],
    price: 200000,
    capacity: "до 8 мест",
    size: "3 комн.",
    description: "Уютный деревянный сруб для компании или семьи.",
    available: 1,
  },
  {
    id: 2,
    title: "Четырехместный номер стандарт",
    image:
      "https://i.pinimg.com/originals/1b/2d/fb/1b2dfbc27d2aed16cbab9394cbbc4b8e.jpg",
    gallery: ["/images/room2.jpg", "/images/room2b.jpg"],
    price: 110000,
    capacity: "до 4 мест",
    size: "27 м², 2 комн.",
    description: "Комфортный номер для отдыха с друзьями или семьёй.",
    available: 2,
  },
  {
    id: 3,
    title: "Улучшенный стандартный двухместный номер",
    image:
      "https://i.pinimg.com/originals/36/97/34/3697347ea945fbef52f1cd34a2a51cd7.jpg",
    gallery: ["/images/room3.jpg", "/images/room3b.jpg"],
    price: 57142,
    capacity: "до 3 мест",
    size: "41 м², 1 комн.",
    description: "Просторный номер с современным интерьером.",
    available: 1,
  },
];

export default function BookingPage() {
  const [roomsGuests, setRoomsGuests] = useState([{ adults: 2, children: 0 }]);
  const [showGuests, setShowGuests] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [dateRange, setDateRange] = useState<Range[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Монтирование (для избежания hydration mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setMounted(true);
  }, []);

  // Закрытие календаря и гостей при клике вне области
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuests(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateRoomGuests = (
    index: number,
    field: "adults" | "children",
    value: number
  ) => {
    setRoomsGuests((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, [field]: Math.max(0, value) } : r
      )
    );
  };

  const addRoom = () => {
    setRoomsGuests((prev) => [...prev, { adults: 1, children: 0 }]);
  };

  const totalAdults = roomsGuests.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomsGuests.reduce((sum, r) => sum + r.children, 0);

  const startISO =
    mounted && dateRange[0]?.startDate
      ? dateRange[0].startDate.toISOString()
      : "";
  const endISO =
    mounted && dateRange[0]?.endDate
      ? dateRange[0].endDate.toISOString()
      : "";

  // формируем query для гостей
  const guestsQuery = roomsGuests
    .map((r, i) => `room${i + 1}=${r.adults}+${r.children}`)
    .join("&");

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <h1 className="text-4xl font-bold mb-4">Бронирование</h1>
        <p className="text-gray-600 mb-8">
          С помощью формы ниже вы можете забронировать наши номера в режиме
          онлайн и получить гарантированную бронь.
        </p>

        {/* Форма выбора дат и гостей */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10 flex flex-col md:flex-row gap-4 items-start">
          {/* Поле с выбором дат */}
          <div className="relative" ref={calendarRef}>
            <div
              onClick={() => setShowCalendar((prev) => !prev)}
              className="border rounded-lg p-3 w-64 cursor-pointer bg-white"
            >
              {dateRange[0]?.startDate?.toLocaleDateString("ru-RU")} —{" "}
              {dateRange[0]?.endDate?.toLocaleDateString("ru-RU")}
            </div>

            {showCalendar && mounted && (
              <div className="absolute z-50 mt-2">
                <DateRange
                  ranges={dateRange}
                  onChange={(ranges: RangeKeyDict) => {
                    setDateRange([ranges.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  rangeColors={["#0d9488"]}
                  editableDateInputs={true}
                />
              </div>
            )}
          </div>

          {/* Выбор гостей */}
          <div className="relative w-full md:w-auto" ref={guestsRef}>
            <div
              onClick={() => setShowGuests(!showGuests)}
              className="border rounded-lg p-3 cursor-pointer bg-white w-64"
            >
              Гости: {totalAdults} взрослых
              {totalChildren > 0 && `, ${totalChildren} детей`} (
              {roomsGuests.length} номер{roomsGuests.length > 1 ? "а" : ""})
            </div>

            {showGuests && (
              <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-xl p-4 w-80">
                {roomsGuests.map((room, index) => (
                  <div key={index} className="mb-4 border-b pb-3">
                    <h3 className="font-semibold mb-2">Номер {index + 1}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span>Взрослые</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateRoomGuests(index, "adults", room.adults - 1)
                          }
                          className="p-1 border rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{room.adults}</span>
                        <button
                          onClick={() =>
                            updateRoomGuests(index, "adults", room.adults + 1)
                          }
                          className="p-1 border rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Дети младше 18 лет</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateRoomGuests(
                              index,
                              "children",
                              room.children - 1
                            )
                          }
                          className="p-1 border rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{room.children}</span>
                        <button
                          onClick={() =>
                            updateRoomGuests(
                              index,
                              "children",
                              room.children + 1
                            )
                          }
                          className="p-1 border rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addRoom}
                  className="text-teal-600 font-semibold mb-3"
                >
                  + Добавить номер
                </button>

                <button
                  onClick={() => setShowGuests(false)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-lg w-full"
                >
                  Готово
                </button>
              </div>
            )}
          </div>

          <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg">
            Найти
          </button>
        </div>

        {/* Список номеров */}
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 left-3 bg-green-600 text-white text-sm px-3 py-1 rounded-lg">
                  Осталось {room.available} номер{room.available > 1 ? "а" : ""}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                <div className="text-gray-800 text-sm mb-4">
                  👥 {room.capacity} • 📐 {room.size}
                </div>
                <div className="mt-auto">
                  <p className="text-lg font-semibold mb-2">
                    {room.price.toLocaleString()} ₸{" "}
                    <span className="text-gray-500 text-sm">/ ночь</span>
                  </p>
                  <Link
                    href={`/checkout?roomId=${room.id}&roomTitle=${encodeURIComponent(
                      room.title
                    )}&checkIn=${encodeURIComponent(startISO)}&checkOut=${encodeURIComponent(
                      endISO
                    )}&${guestsQuery}&price=${room.price}`}
                  >
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold">
                      Забронировать
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка для галереи */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedRoom.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${selectedRoom.title} photo ${i + 1}`}
                  className="rounded-lg object-cover w-full h-40"
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-3">{selectedRoom.title}</h2>
            <p className="text-gray-700 mb-4">{selectedRoom.description}</p>
            <p className="text-gray-600 mb-2">👥 {selectedRoom.capacity}</p>
            <p className="text-gray-600 mb-4">📐 {selectedRoom.size}</p>

            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">
                {selectedRoom.price.toLocaleString()} ₸{" "}
                <span className="text-gray-500 text-sm">/ ночь</span>
              </p>
              <Link
                href={`/checkout?room=${encodeURIComponent(
                  selectedRoom.title
                )}&checkIn=${encodeURIComponent(
                  startISO
                )}&checkOut=${encodeURIComponent(
                  endISO
                )}&${guestsQuery}&price=${selectedRoom.price}`}
              >
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg">
                  Забронировать
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
