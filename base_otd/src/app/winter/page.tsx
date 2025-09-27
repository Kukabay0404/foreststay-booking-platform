import Link from "next/link";

export default function WinterPage() {
  
    const activities = [
    { img: "https://api.gkosnova.tech/public/storage/media/2023/5/qSOrdzS978s3BfrGZHMJQOz33rCEmg8gmXoAniNC.jpg", title: "Лыжи", desc: "Экстремальные заезды по лесным тропам", href: "/winter/ski" },
    { img: "https://www.opennov.ru/sites/default/files/images/news/064409680e2f8aa51c04ea8015a75dfc.jpg", title: "Коньки", desc: "Прогулки на свежем воздухе", href: "/winter/skating" },
    { img: "https://i.pinimg.com/originals/0e/d9/e2/0ed9e296f8e4a6fcc074dd5e488593ee.jpg", title: "Сноуборд", desc: "Поле для игр и турниров", href: "/winter/snowboard" },
    { img: "https://avatars.mds.yandex.net/get-altay/6010116/2a0000018b7a94908b100a8738d6e490e323/orig", title: "Катание на хаски", desc: "Активные командные сражения", href: "/winter/husky" },
    { img: "https://avatars.dzeninfra.ru/get-zen_doc/4478350/pub_63d24945a2e35520b42a863f_63d24a8d6051d25be3fd2b68/scale_1200", title: "Прокат снегохода", desc: "Отдых для всей семьи", href: "/winter/snowmobile" },
  ];

  return (
    <div className="bg-white text-gray-900 pt-12">
      {/* Баннер */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <img
          src="https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_67483f855953c6564d312c2b_6749a4519e504d102c9ab5f2/scale_1200"
          alt="Зимний отдых"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl font-bold mb-4">Зимний отдых</h1>
          <p className="text-xl mb-6">Лыжи, коньки, катание на хаски и развлечения на природе</p>
          <a
            href="#activities"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold"
          >
            Смотреть активности
          </a>
        </div>
      </section>

      {/* Каталог активностей */}
      <section className="py-16 container mx-auto px-6 lg:px-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Выберите активность</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {activities.map((item, idx) => (
            <Link key={idx} href={item.href} className="group rounded-2xl overflow-hidden shadow-lg relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Описание */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Отдых для всей семьи</h2>
          <p className="text-gray-700 text-lg">
            Летом у нас найдется занятие для каждого: от активного спорта до спокойного отдыха у воды. 
            Уютная атмосфера, свежий воздух и современная инфраструктура делают наш курорт идеальным местом 
            для незабываемого отдыха.
          </p>
        </div>
      </section>
    </div>
  );
}
