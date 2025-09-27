"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [bookings] = useState([
    { id: 1, title: "Бронирование стола", date: "2025-08-28", status: "Ожидает" },
    { id: 2, title: "Бронирование комнаты", date: "2025-08-30", status: "Подтверждено" },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Заголовок */}
        <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>

        {/* Заявки / Бронирования */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Мои заявки и брони</h2>
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{booking.title}</p>
                  <p className="text-sm text-gray-500">Дата: {booking.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    booking.status === "Подтверждено"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Профиль */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Профиль</h2>
          <div className="p-4 border rounded-lg">
            <p><span className="font-medium">Имя:</span> Иван Иванов</p>
            <p><span className="font-medium">Телефон:</span> +7 (900) 123-45-67</p>
            <p><span className="font-medium">Email:</span> ivan@example.com</p>
            <Link href="/dashboard/profile">
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
                Редактировать профиль
              </button>
            </Link>
          </div>
        </section>

        {/* Выход */}
        <div className="flex justify-end">
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
