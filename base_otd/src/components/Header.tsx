"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle2 } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    updateAuth();
    window.addEventListener("storage", updateAuth);
    window.addEventListener("focus", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("focus", updateAuth);
    };
  }, [pathname]);

  return (
    <header
      className={`absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-20 ${
        isHome ? "bg-transparent border-0 shadow-none" : "bg-white shadow-md border-b border-gray-200"
      }`}
    >
      <Link
        href="/"
        className={`text-2xl font-bold transition-colors ${
          isHome ? "text-white hover:text-green-200" : "text-gray-900 hover:text-green-700"
        }`}
      >
        Лесное Озеро
      </Link>

      <nav className={`hidden md:flex gap-6 ${isHome ? "text-white" : "text-gray-800"}`}>
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
        <a href="tel:+79001234567" className={isHome ? "text-white" : "text-gray-800"}>
          +7 (900) 123-45-67
        </a>

        {isAuthenticated ? (
          <Link href="/dashboard" aria-label="Профиль">
            <UserCircle2
              className={`w-9 h-9 transition-colors ${
                isHome ? "text-white hover:text-green-200" : "text-gray-800 hover:text-green-700"
              }`}
            />
          </Link>
        ) : (
          <Link href="/auth/login">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white shadow-lg">
              Войти/Зарегистрироваться
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
