// app/snowmobiles/page.tsx
"use client";

import { motion } from "framer-motion";

export default function SnowmobilesPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Отступ сверху */}
      <div className="h-12" />

      {/* Hero */}
      <section
        className="relative h-[75vh] flex items-center justify-center bg-cover bg-center rounded-b-3xl overflow-hidden shadow-xl"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1602786208749-82fb5a1f8d99?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Катание на снегоходах
          </h1>
          <p className="mt-4 text-xl text-white/90 drop-shadow">
            Почувствуйте скорость и адреналин на зимних трассах
          </p>
        </motion.div>
      </section>

      {/* Описание */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Экстремальный зимний отдых
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Катание на снегоходах — это яркие впечатления, скорость и
          незабываемые виды зимнего леса и полей.  
          Вы сможете отправиться в захватывающее путешествие по живописным
          маршрутам в сопровождении инструктора.  
          Это отличный вариант для любителей активного отдыха и драйва!
        </p>
      </section>

      {/* Галерея */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
        {[
          "https://images.unsplash.com/photo-1603384358537-3ffbc95c5c4f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1617196038449-6f99d9db6466?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1611606063062-5c5a49109169?auto=format&fit=crop&w=800&q=80",
        ].map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            <img
              src={src}
              alt={`Снегоход ${i + 1}`}
              className="w-full h-64 object-cover"
            />
          </motion.div>
        ))}
      </section>

      {/* Цены */}
      <section className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Тарифы</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "15 минут", price: "5000₸" },
            { title: "30 минут", price: "9000₸" },
            { title: "1 час", price: "16000₸" },
          ].map((tariff, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{tariff.title}</h3>
              <p className="text-2xl font-bold text-red-600">{tariff.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Готовы к приключению?</h2>
        <p className="mb-6 text-lg">
          Забронируйте катание на снегоходах прямо сейчас и испытайте драйв!
        </p>
        <a href="/booking">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Забронировать
          </button>
        </a>
      </section>
    </main>
  );
}
