"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";


const images = [
  "https://gubdaily.ru/wp-content/uploads/2021/07/38a7c3a072849af1c0319.jpg",
  "https://avatars.mds.yandex.net/get-altay/5115998/2a0000018ec1c12360bec6d53cad7ae16082/orig",
  "https://avatars.mds.yandex.net/i?id=d065ca4b025eab309ea6407b7d56e2a3_l-5270141-images-thumbs&n=13",
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  // Автоматическое переключение каждые 5 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // ---- Состояние для гостей ----
  const [showGuests, setShowGuests] = useState(false);
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);

  const updateRoom = (index: number, type: "adults" | "children", value: number) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === index ? { ...room, [type]: Math.max(type === "adults" ? 1 : 0, value) } : room
      )
    );
  };

  const addRoom = () => {
    setRooms((prev) => [...prev, { adults: 1, children: 0 }]);
  };

  const removeRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const guestsSummary = rooms
    .map(
      (room, i) =>
        `Номер ${i + 1}: ${room.adults} взрослых${
          room.children > 0 ? `, ${room.children} детей` : ""
        }`
    )
    .join("; ");


  return (
    <main className="w-full min-h-screen bg-white text-gray-800 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-20">
        <Link href="/" className="text-2xl font-bold text-white">
          Лесное Озеро
        </Link>
        {/* text-2xl font-bold text-white */}
        <nav className="hidden md:flex gap-6 text-white">
          <a href="#about" className="hover:underline">
            О базе
          </a>
          <a href="#accommodation" className="hover:underline">
            Размещение
          </a>
          <a href="#services" className="hover:underline">
            Услуги
          </a>
          <a href="#contacts" className="hover:underline">
            Контакты
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="tel:+79001234567" className="text-white">
            +7 (900) 123-45-67
          </a>
          <Link href="/auth/login">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white">
              Войти/Зарегестрироваться
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Слайд-шоу */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.img
              key={current}
              src={images[current]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Контент поверх */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Насладитесь отдыхом в гармонии с природой
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Уютные домики, тишина леса и комфорт для всей семьи
          </p>
          <Link href="/booking">
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl shadow-lg text-lg">
              Забронировать номер
            </button>
          </Link>
        </motion.div>

        {/* Стрелки переключения */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Форма бронирования */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute bottom-8 w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 z-20"
        >
          <div className="flex-1">
            <label className="block text-gray-600 text-sm">Заезд</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-sm">Выезд</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>

          {/* Гости */}
          <div className="flex-1 relative"></div>
            <label className="block text-gray-600 text-sm">Гости</label>
            <div
              onClick={() => setShowGuests(!showGuests)}
              className="w-full border rounded-lg p-2 cursor-pointer bg-white"
            >
              {guestsSummary}
            </div>

            {showGuests && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full mb-2 left-0 w-full max-w-sm bg-white shadow-lg rounded-xl border p-4 z-30"
                  style={{ maxHeight: "400px", overflowY: "auto" }} // ограничиваем высоту
                >
                  <h3 className="text-lg font-semibold mb-3">Количество гостей</h3>

                  {rooms.map((room, index) => (
                    <div
                      key={index}
                      className="mb-4 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Номер {index + 1}</p>
                        {rooms.length > 1 && (
                          <button
                            onClick={() => removeRoom(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑
                          </button>
                        )}
                      </div>

                      {/* Взрослые */}
                      <div className="flex justify-between items-center mb-3">
                        <span>Взрослые</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateRoom(index, "adults", room.adults - 1)}
                            className="px-3 py-1 border rounded-lg"
                            disabled={room.adults <= 1}
                          >
                            –
                          </button>
                          <span>{room.adults}</span>
                          <button
                            onClick={() => updateRoom(index, "adults", room.adults + 1)}
                            className="px-3 py-1 border rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Дети */}
                      <div className="flex justify-between items-center">
                        <span>Дети (до 18)</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateRoom(index, "children", room.children - 1)}
                            className="px-3 py-1 border rounded-lg"
                            disabled={room.children <= 0}
                          >
                            –
                          </button>
                          <span>{room.children}</span>
                          <button
                            onClick={() => updateRoom(index, "children", room.children + 1)}
                            className="px-3 py-1 border rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Добавить номер */}
                  <button
                    onClick={addRoom}
                    className="w-full border border-green-600 text-green-600 py-2 rounded-lg mb-3 hover:bg-green-50"
                  >
                    + Добавить номер
                  </button>

                  {/* Готово */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowGuests(false)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Готово
                    </button>
                  </div>
                </motion.div>
              )}



          <div className="flex-1">
            <label className="block text-gray-600 text-sm">Промокод</label>
            <input
              type="text"
              placeholder="Введите промокод"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <Link href="/booking">
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white self-end md:self-center">
              Найти номер
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Секция Дома = "О базе" */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          <div>
            <img
              src="https://i.pinimg.com/originals/26/0d/b0/260db0d6dfd8d2d16b1792fd42b6a5f3.jpg"
              alt="Большие дома"
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Большие деревянные дома</h2>
            <p className="text-gray-700 mb-6">
              Уютные деревянные дома для больших компаний и семей.
              Вместимость до 10 человек, просторные гостиные и собственная кухня.
            </p>
            <a href="/rooms" className="text-blue-700 font-semibold hover:underline">
              Подробнее →
            </a>
          </div>
        </div>
      </section>

      {/* Секция Природа */}
      <section id="accommodation" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">
              Природа и территория
            </h2>
            <p className="text-gray-700 mb-6">
              База отдыха окружена хвойным лесом и чистым озером.
              Здесь можно насладиться тишиной и красотой природы.
            </p>
            <video controls className="rounded-2xl shadow-lg w-full">
              <source src="/videos/nature.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/img/nature1.jpg"
              alt="Природа"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Секция Ресторан */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          <div>
            <img
              src="https://s0.rbk.ru/v6_top_pics/media/img/4/45/755126465208454.png"
              alt="Ресторан"
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Ресторан</h2>
            <p className="text-gray-700 mb-6">
              На территории базы работает ресторан, где подают блюда национальной и европейской кухни.
            </p>
            <a href="/restaurant" className="text-blue-700 font-semibold hover:underline">
              Посмотреть меню →
            </a>
          </div>
        </div>
      </section>

      {/* Секция Активности */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Активности</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <img src="https://i.pinimg.com/originals/f2/e7/71/f2e771c059ef880df98d264d77a7498d.jpg" alt="Баня" className="rounded-xl mb-4" />
              <h3 className="font-semibold">Баня</h3>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <img src="https://585327db-1738-4319-8825-b4d66fe3e73d.selstorage.ru/9c0cfdc7-3bbf-4665-bdc9-cf87ad68dcaf.jpg" alt="Прогулки" className="rounded-xl mb-4" />
              <h3 className="font-semibold">Прогулки на лошадях</h3>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <img src="https://wallpapers.com/images/featured-full/fishing-rod-p0iuhxbkev0lzuvo.jpg" alt="Рыбалка" className="rounded-xl mb-4" />
              <h3 className="font-semibold">Рыбалка</h3>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <img src="https://kartin.papik.pro/uploads/posts/2023-07/1689305730_kartin-papik-pro-p-kartinki-detskii-park-ili-detskaya-ploshch-54.jpg" alt="Детская площадка" className="rounded-xl mb-4" />
              <h3 className="font-semibold">Детская площадка</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Заголовок */}
          <h2 className="text-3xl font-bold mb-6">
            Подберем индивидуальную программу досуга по вашему запросу
          </h2>
          <p className="text-gray-600 mb-12">
            Мы всегда рады вам предложить различные виды активного отдыха
          </p>

          {/* Карточки */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Link href="/summer">
                <img
                  src="https://www.slivki.by/znijki-media/w1044_644/default/1009921/1648645030_Screenshot_1.jpg"
                  alt="Летний отдых"
                  className="w-full h-64 object-cover cursor-pointer"
                />
              </Link>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                <h3 className="text-xl font-semibold">Летний отдых</h3>
                <p className="text-sm">6 видов активностей</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Link href="/winter">
              <img
                src="https://static.tildacdn.com/tild6165-3539-4335-b565-373466663064/photo_52333324341861.jpg"
                alt="Зимний отдых"
                className="w-full h-64 object-cover cursor-pointer"
              />
              </Link>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                <h3 className="text-xl font-semibold">Зимний отдых</h3>
                <p className="text-sm">8 видов активностей</p>
              </div>
            </div>
          </div>

          {/* Текстовый блок */}
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">
              Отличное место для отдыха всей семьи и проведения праздника
            </h3>
            <p className="text-gray-600">
              Современные залы идеально подойдут для проведения мероприятия любого
              формата и масштаба на высшем уровне.
            </p>
          </div>
        </div>
      </section>

      {/* Секция Фотогалерея */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Фотогалерея базы отдыха
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Атмосфера уюта, природы и комфорта в каждом уголке
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://avatars.mds.yandex.net/i?id=d065ca4b025eab309ea6407b7d56e2a3_l-5270141-images-thumbs&n=13"
              alt="Домики"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://i.pinimg.com/originals/26/0d/b0/260db0d6dfd8d2d16b1792fd42b6a5f3.jpg"
              alt="Беседки"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/img/nature1.jpg"
              alt="Природа"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://s0.rbk.ru/v6_top_pics/media/img/4/45/755126465208454.png"
              alt="Ресторан"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://wallpapers.com/images/featured-full/fishing-rod-p0iuhxbkev0lzuvo.jpg"
              alt="Рыбалка"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://kartin.papik.pro/uploads/posts/2023-07/1689305730_kartin-papik-pro-p-kartinki-detskii-park-ili-detskaya-ploshch-54.jpg"
              alt="Детская площадка"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Секция Карта */}
      <section id="contacts" className="bg-teal-900 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-10 md:mb-0 md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">
              Запланируйте отдых в одном из самых уютных уголков Казахстана
            </h2>
            <p className="mb-6 text-lg text-gray-200">
              Примерное время в пути от Караганды до зоны отдыха «Лесное Озеро» — 20 минут.
            </p>
            <a
              href="https://2gis.kz/astana/search/Зона%20отдыха%20BalQaragаi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-teal-900 transition"
            >
              Как добраться
            </a>
          </div>

          {/* Пример карты через iframe */}
          <div className="md:w-1/2 h-72 w-full rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://widgets.2gis.com/widget?type=firmsonmap&options[company_ids]=70000001067831063&options[zoom]=12"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

    {/* Футер */}
    <footer className="bg-gray-100 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Контакты */}
        <div>
          <h3 className="font-semibold mb-4">Контакты</h3>
          <p>Зона отдыха «Лесное Озеро»</p>
          <p>Караганда, Малотимофеевка-2</p>
          <p className="mt-2">Отдел продаж: <a href="tel:+77750070030" className="hover:underline">+7 775 007 00 30</a></p>
          <p>Ресепшн: <a href="tel:+77750070037" className="hover:underline">+7 775 007 00 37</a></p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="p-2 border rounded-full hover:bg-teal-900 hover:text-white transition">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="p-2 border rounded-full hover:bg-teal-900 hover:text-white transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="p-2 border rounded-full hover:bg-teal-900 hover:text-white transition">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Проживание */}
        <div>
          <h3 className="font-semibold mb-4">Проживание</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Номера</a></li>
            <li><a href="#" className="hover:underline">Срубы</a></li>
          </ul>
        </div>

        {/* Зимний отдых */}
        <div>
          <h3 className="font-semibold mb-4">Зимний отдых</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Лыжи</a></li>
            <li><a href="#" className="hover:underline">Коньки</a></li>
            <li><a href="#" className="hover:underline">Сноуборд</a></li>
            <li><a href="#" className="hover:underline">Катание на хаски</a></li>
            <li><a href="#" className="hover:underline">Прокат снегохода</a></li>
          </ul>
        </div>

        {/* Летний отдых */}
        <div>
          <h3 className="font-semibold mb-4">Летний отдых</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Аквапарк и бассейн</a></li>
            <li><a href="#" className="hover:underline">Футбол, пейнтбол, велосипеды</a></li>
            <li><a href="#" className="hover:underline">Квадроциклы</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-12">
        © {new Date().getFullYear()} Лесное Озеро. Все права защищены.
      </div>
    </footer>

    </main>
  );
}
