// app/restaurant/page.tsx

"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { Utensils, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"

const gallery = [
  "/restaurant/img1.jpg",
  "/restaurant/img2.jpeg",
  "/restaurant/img3.jpeg",
  "/restaurant/img4.jpg",
];

const dishes = [
  {
    name: "Баранья рулька",
    image: "/restaurant/dishes/rulka.jpg",
  },
  {
    name: "Жареные манты",
    image: "/restaurant/dishes/dish2.jpeg",
  },
  {
    name: "Медальоны из говядины",
    image: "/restaurant/dishes/dish3.jpg",
  },
  {
    name: "Салат с авокадо",
    image: "/restaurant/dishes/dish4.png",
  },
];

export default function RestaurantPage() {
  return (
    <main className="pt-32 pb-20 bg-gray-50">
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-[3fr_1fr] gap-10 items-start">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Ресторан «Элемент»
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Ресторан «Элемент» находится на живописном берегу озера. 
          Здесь вас ждут изящные элементы декора, уютная атмосфера и 
          вкуснейшие блюда, приготовленные из свежих продуктов. 
          Это идеальное место как для романтического ужина, так и для 
          семейного отдыха или праздника.
        </p>
        {/* Левая часть - Галерея */}
        <Gallery />

        {/* Правая часть - Видео */}
        <div className="flex justify-center md:justify-end">
          <div className="w-[350px] h-[500px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Scxs7L0vhZ4"
              title="Restaurant Element"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-2xl font-bold text-center mb-2">ПОБАЛУЙТЕ СЕБЯ ИЗЫСКАННЫМИ БЛЮДАМИ НАШЕЙ КУХНИ</h2>
      <p className="text-center text-gray-600 mb-10">
        На выбор гостя национальная и восточная кухня.
      </p>

      {/* Слайдер */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={30}
        slidesPerView={3}
        loop
        className="mb-12"
      >
        {dishes.map((dish, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-full h-[300px] relative rounded-lg overflow-hidden shadow">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-lg text-gray-800">{dish.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Информация */}
      <div className="flex justify-center gap-12 text-gray-700 mb-8">
        <div className="flex flex-col items-center">
          <Utensils className="mb-2" />
          <span className="text-sm">национальная,<br /> восточная кухня</span>
        </div>
        <div className="flex flex-col items-center">
          <Clock className="mb-2" />
          <span className="text-sm">Время работы<br /> 09:00 — 23:00</span>
        </div>
        <div className="flex flex-col items-center">
          <Clock className="mb-2" />
          <span className="text-sm">Завтрак<br /> 09:00 — 11:00</span>
        </div>
      </div>

      {/* Кнопка */}
      <div className="flex justify-center">
        <a
          href="/restaurant-menu.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Основное меню
        </a>
        {/* border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition */}
      </div>
    </section>

      {/* --- Фото ресторана --- */}
      <section className="grid md:grid-cols-2 gap-8 mb-16 ml-4">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
          <Image src="/restaurant/interior/img1.jpg" alt="Ресторан интерьер" fill className="object-cover" />
        </div>
        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
          <Image src="/restaurant/interior/img2.jpg" alt="Ресторан на берегу" fill className="object-cover" />
        </div>
      </section>


      {/* --- Блок Банкетный зал --- */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-5 items-center">
          {/* Текст */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 ml-4">Банкетный зал</h2>
            <p className="text-lg text-gray-700 mb-6 ml-4">
              Зона отдыха «Лесное Озеро» располагает просторным банкетным залом вместимостью до 350 человек. 
              Зал оснащён современным звуковым и световым оборудованием, идеально подходит для свадеб, юбилеев и корпоративов.
            </p>

            <div className="flex flex-wrap gap-4 ml-4">
              <a
                href="https://your-virtual-tour-link.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Виртуальный тур
              </a>

              <a
                href="/banquet-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition"
              >
                Банкетное меню
              </a>
            </div>
          </div>

          {/* Фото */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/restaurant/banket/img1.jpg" alt="Банкетный зал" fill className="object-cover" />
            </div>
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/restaurant/banket/img2.jpeg" alt="Декор зала" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Блок ВИП-залы --- */}
      <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Левая часть */}
        <div className="flex items-center">
          <p className="text-3xl font-bold text-gray-900">
            Для торжеств
          </p>
        </div>

        {/* Правая часть */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-3xl font-semibold text-gray-900">VIP-залы для вашего праздника</h3>
          <p className="text-gray-600 text-lg">
            Мы предлагаем уютные VIP-залы для свадеб, юбилеев и корпоративов. Атмосфера уюта и изящный интерьер
            создадут идеальные условия для вашего мероприятия.
          </p>
        </div>
      </div>

      {/* Нижний блок: Галерея + Видео */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Галерея */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/restaurant/vip/img1.jpg"
            alt="VIP зал 1"
            className="w-full h-56 object-cover rounded-xl"
          />
          <img
            src="/restaurant/vip/img2.jpeg"
            alt="VIP зал 2"
            className="w-full h-56 object-cover rounded-xl"
          />
          <img
            src="/restaurant/vip/img3.jpg"
            alt="VIP зал 3"
            className="w-full h-56 object-cover rounded-xl"
          />
          <img
            src="/restaurant/vip/img4.jpg"
            alt="VIP зал 4"
            className="w-full h-56 object-cover rounded-xl"
          />
        </div>

        {/* Видео */}
        <div className="rounded-xl overflow-hidden shadow-lg mt-6 md:mt-12">
          <iframe
            className="w-full h-72 rounded-xl"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Видео о VIP залах"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
    
    </main>
  );
}

function Gallery() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <Image
        src={gallery[current]}
        alt="Restaurant gallery"
        fill
        className="object-cover"
      />
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        →
      </button>
    </div>
  );
}
