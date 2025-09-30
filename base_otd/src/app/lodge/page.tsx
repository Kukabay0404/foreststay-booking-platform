// app/lodge/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Plus, Minus } from "lucide-react";
import RoomCard, { Room } from "@/components/RoomCard";

const cabins: Room[] = [
  {
    id: 1,
    title: "Сруб Малый",
    category: "Сруб",
    rooms: 2,
    area: "35 м²",
    beds: 4,
    tv: true,
    priceWeekdays: "25 000 тг",
    priceWeekend: "30 000 тг",
    images: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/source/6c04da47674803.5881365ba572c.jpg",
      "https://static.tildacdn.com/tild6464-6132-4737-b263-376434653964/view_CShading_Beauty.jpg",
      "https://i.pinimg.com/originals/aa/94/91/aa9491473e395dca170826e7b2391ac0.jpg",
    ],
  },
  {
    id: 2,
    title: "Сруб Средний",
    category: "Сруб",
    rooms: 3,
    area: "50 м²",
    beds: 6,
    tv: true,
    priceWeekdays: "40 000 тг",
    priceWeekend: "45 000 тг",
    images: [
      "/rooms/203/standart.jpg",
      "/rooms/203/standart2.jpeg",
      "/rooms/203/standart3.jpg",
    ],
  },
  {
    id: 3,
    title: "Сруб Большой",
    category: "Сруб",
    rooms: 4,
    area: "70 м²",
    beds: 10,
    tv: true,
    priceWeekdays: "60 000 тг",
    priceWeekend: "70 000 тг",
    images: [
      "https://i.pinimg.com/originals/f5/6b/95/f56b95f7db83bd6ff189d43aec18b1f1.jpg",
      "https://i.pinimg.com/originals/f6/b4/90/f6b49089d0e1c61a786c75469229d80e.jpg",
      "https://st.hzcdn.com/simgs/pictures/living-rooms/modern-rustic-great-room-studiotrimble-img~11d174c00fdfb185_9-1479-1-40d8070.jpg",
      "https://elles.top/uploads/posts/2023-04/1680750330_elles-top-p-natyazhnoi-potolok-v-dome-iz-brevna-krasiv-35.jpg",
    ],
  },
];

export default function CabinsPage() {
  // гости
  const [roomsGuests, setRoomsGuests] = useState([{ adults: 2, children: 0 }]);
  const [showGuests, setShowGuests] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  // даты
  const [dateRange, setDateRange] = useState<Range[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

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

  // закрытие попапов
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuests(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // функции гостей
  const updateRoomGuests = (index: number, field: "adults" | "children", value: number) => {
    setRoomsGuests((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: Math.max(0, value) } : r))
    );
  };

  const addRoom = () => {
    setRoomsGuests((prev) => [...prev, { adults: 1, children: 0 }]);
  };

  const totalAdults = roomsGuests.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomsGuests.reduce((sum, r) => sum + r.children, 0);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Заголовок */}
        <h1 className="text-4xl font-bold">Бронирование</h1>
        <p className="text-gray-600">
          С помощью формы ниже вы можете забронировать наши срубы в режиме онлайн и получить гарантированную бронь.
        </p>

        {/* форма дат и гостей */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row gap-4 items-start">
          {/* календарь */}
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

          {/* гости */}
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
                          onClick={() => updateRoomGuests(index, "adults", roomsGuests[index].adults - 1)}
                          className="p-1 border rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{roomsGuests[index].adults}</span>
                        <button
                          onClick={() => updateRoomGuests(index, "adults", roomsGuests[index].adults + 1)}
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
                          onClick={() => updateRoomGuests(index, "children", roomsGuests[index].children - 1)}
                          className="p-1 border rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{roomsGuests[index].children}</span>
                        <button
                          onClick={() => updateRoomGuests(index, "children", roomsGuests[index].children + 1)}
                          className="p-1 border rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addRoom} className="text-teal-600 font-semibold mb-3">
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

          <button className="px-6 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 shadow">
            Найти
          </button>
        </div>

        {/* кнопки переключения */}
        <div className="flex justify-center gap-6 mb-8">
          <Link href="/rooms">
            <button className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 shadow">
              Номера
            </button>
          </Link>
          <Link href="/lodge">
            <button className="px-6 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 shadow">
              Срубы
            </button>
          </Link>
        </div>

        {/* карточки срубов */}
        <div className="space-y-12">
          {cabins.map((cabin) => (
            <RoomCard key={cabin.id} room={cabin} />
          ))}
        </div>
      </div>
    </div>
  );
}
