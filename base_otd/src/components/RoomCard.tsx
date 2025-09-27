import Link from "next/link";

interface Room {
  id: number;
  title: string;
  area: number;
  beds: number;
  price_weekdays: number;
}

interface RoomCardProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function RoomCard({ room, checkIn, checkOut, guests }: RoomCardProps) {
  return (
    <div className="border rounded-xl p-4 shadow-md">
      <h3 className="text-xl font-bold">{room.title}</h3>
      <p>
        {room.area} м² — {room.beds} кроватей
      </p>
      <p className="font-semibold mt-2">{room.price_weekdays} ₸ / будни</p>

      <Link
        href={`/checkout?roomId=${room.id}&roomTitle=${encodeURIComponent(
          room.title
        )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&price=${
          room.price_weekdays
        }`}
        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Забронировать
      </Link>
    </div>
  );
}
