// app/skiing/page.tsx
"use client";

import { motion } from "framer-motion";

export default function SkiingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      {/* Отступ сверху */}
      <div className="h-12" />

      {/* Заголовок */}
      <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605559424843-65cfa6466b68?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white text-5xl md:text-6xl font-bold text-center"
        >
          Катание на лыжах
        </motion.h1>
      </section>

      {/* Описание */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Зимние развлечения</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Наша база отдыха предлагает отличные условия для любителей лыжного спорта. 
          Живописные лесные трассы, ухоженные склоны и современное оборудование создают 
          идеальные условия для активного зимнего отдыха всей семьей.
        </p>
      </section>

      {/* Галерея */}
      <section className="max-w-6xl mx-auto px-6 pb-12 grid md:grid-cols-3 gap-6">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1613339027981-0f3f6124e6a6?auto=format&fit=crop&w=800&q=80" alt="Лыжная трасса" className="w-full h-64 object-cover" />
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" alt="Катание на лыжах" className="w-full h-64 object-cover" />
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1605559425064-3c8b6a5480a6?auto=format&fit=crop&w=800&q=80" alt="Семейный отдых" className="w-full h-64 object-cover" />
        </div>
      </section>

      {/* Блок бронирования */}
      <section className="bg-green-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Забронируйте отдых на лыжах</h2>
        <p className="mb-6 text-lg">Выберите удобные даты и насладитесь зимними приключениями</p>
        <a href="/booking">
          <button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Забронировать сейчас
          </button>
        </a>
      </section>
    </main>
  );
}
