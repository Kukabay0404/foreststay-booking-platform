// app/skating/page.tsx
"use client";

import { motion } from "framer-motion";

export default function SkatingPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Отступ сверху */}
      <div className="h-12" />

      {/* Hero-блок */}
      <section className="relative h-[70vh] flex items-center justify-center bg-cover bg-center rounded-b-3xl overflow-hidden shadow-md"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1608158899438-554d5a1ebadc?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Катание на коньках
          </h1>
          <p className="mt-4 text-xl text-white/90 drop-shadow">
            Зимняя магия на льду для всей семьи
          </p>
        </motion.div>
      </section>

      {/* Описание */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Лёд, музыка и веселье</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Наш каток под открытым небом — это идеальное место для зимних развлечений. 
          Вас ждёт ухоженный лёд, тёплое освещение, музыка и горячие напитки в уютном кафе.
          Коньки можно взять напрокат на месте, а для новичков предусмотрены инструкторы.
        </p>
      </section>

      {/* Галерея с эффектом карточек */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
        {[
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1609027988307-70e3f6c8e3f4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
        ].map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            <img src={src} alt={`Коньки ${i + 1}`} className="w-full h-64 object-cover" />
          </motion.div>
        ))}
      </section>

      {/* Блок с CTA */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Погрузитесь в атмосферу зимней сказки</h2>
        <p className="mb-6 text-lg">Забронируйте катание на коньках прямо сейчас!</p>
        <a href="/booking">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Забронировать место
          </button>
        </a>
      </section>
    </main>
  );
}
