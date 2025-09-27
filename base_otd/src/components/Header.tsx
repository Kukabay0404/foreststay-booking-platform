"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-20 bg-white shadow-md border-b border-gray-200">
      <Link
        href="/"
        className="text-2xl font-bold text-gray-900 hover:text-green-700 transition-colors"
      >
        Лесное Озеро
      </Link>

      <nav className="hidden md:flex gap-6 text-gray-800">
        <Link href="/#about" className="hover:underline">
          О базе
        </Link>
        <Link href="/#accommodation" className="hover:underline">
          Размещение
        </Link>
        <Link href="/#services" className="hover:underline">
          Услуги
        </Link>
        <Link href="/#contacts" className="hover:underline">
          Контакты
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <a href="tel:+79001234567" className="text-gray-800">
          +7 (900) 123-45-67
        </a>
        <Link href="/auth/login">
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white shadow-lg">
            Войти/Зарегистрироваться
          </button>
        </Link>
      </div>
    </header>
  );
}
