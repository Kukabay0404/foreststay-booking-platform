// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password: string;
}

interface Room {
  id: number;
  title: string;
  category: string;
  rooms: number;
  area: string;
  beds: number;
  tv: boolean;
  priceWeekdays: string;
  priceWeekend: string;
  images: string[];
}

interface Cabin {
  id: number;
  title: string;
  description: string;
  rooms: number;
  floors: number;
  beds: number;
  category: string;
  priceWeekdays: string;
  priceWeekend: string;
  pool: boolean;
  images: string[];
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // формы создания
  const [newUser, setNewUser] = useState<Partial<UserCreate>>({});
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});
  const [newCabin, setNewCabin] = useState<Partial<Cabin>>({});

  // редактируемые объекты
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roomsRes, cabinsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/user_admin/"),
          fetch("http://127.0.0.1:8000/room_admin/"),
          fetch("http://127.0.0.1:8000/cabin_admin/"),
        ]);

        const usersData = await usersRes.json();
        const roomsData = await roomsRes.json();
        const cabinsData = await cabinsRes.json();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setCabins(Array.isArray(cabinsData) ? cabinsData : []);
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- CRUD USERS ----------------
  const deleteUser = async (id: number) => {
    if (!confirm("Удалить пользователя?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/user_admin/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Ошибка удаления пользователя");
    }
  };

  const createUser = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        const created = await res.json();
        setUsers((prev) => [...prev, created]);
        setNewUser({});
      }
    } catch {
      alert("Ошибка создания пользователя");
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/${editingUser.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
      }
    } catch {
      alert("Ошибка обновления пользователя");
    }
  };
  // ---------------- CRUD ROOMS ----------------
  const deleteRoom = async (id: number) => {
    if (!confirm("Удалить номер?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/room_admin/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Ошибка удаления номера");
    }
  };

  const createRoom = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/room_admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (res.ok) {
        const created = await res.json();
        setRooms((prev) => [...prev, created]);
        setNewRoom({});
      }
    } catch {
      alert("Ошибка создания номера");
    }
  };

  const updateRoom = async () => {
    if (!editingRoom) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/room_admin/${editingRoom.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRoom),
      });
      if (res.ok) {
        const updated = await res.json();
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingRoom(null);
      }
    } catch {
      alert("Ошибка обновления номера");
    }
  };

  // ---------------- CRUD CABINS ----------------
  const deleteCabin = async (id: number) => {
    if (!confirm("Удалить сруб?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/cabin_admin/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) setCabins((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Ошибка удаления сруба");
    }
  };

  const createCabin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/cabin_admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCabin),
      });
      if (res.ok) {
        const created = await res.json();
        setCabins((prev) => [...prev, created]);
        setNewCabin({});
      }
    } catch {
      alert("Ошибка создания сруба");
    }
  };

  const updateCabin = async () => {
    if (!editingCabin) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/cabin_admin/${editingCabin.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCabin),
      });
      if (res.ok) {
        const updated = await res.json();
        setCabins((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingCabin(null);
      }
    } catch {
      alert("Ошибка обновления сруба");
    }
  };
  if (loading) return <div className="p-6 text-center">Загрузка...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Админ-панель</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-6 gap-2">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="rooms">Номера</TabsTrigger>
          <TabsTrigger value="cabins">Срубы</TabsTrigger>
          <TabsTrigger value="addUser">Создать пользователя</TabsTrigger>
          <TabsTrigger value="addRoom">Создать номер</TabsTrigger>
          <TabsTrigger value="addCabin">Создать сруб</TabsTrigger>
        </TabsList>

        {/* Пользователи */}
        <TabsContent value="users">
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Имя</th>
                <th className="border px-4 py-2">Фамилия</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Роль</th>
                <th className="border px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border px-4 py-2">{u.id}</td>
                  <td className="border px-4 py-2">{u.first_name}</td>
                  <td className="border px-4 py-2">{u.last_name}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">{u.role}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <Button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Удалить
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setEditingUser({ ...u })}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          ✏️ Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактирование пользователя</DialogTitle>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-3 mt-3">
                            <Input
                              value={editingUser.first_name}
                              onChange={(e) =>
                                setEditingUser({ ...editingUser, first_name: e.target.value })
                              }
                            />
                            <Input
                              value={editingUser.last_name}
                              onChange={(e) =>
                                setEditingUser({ ...editingUser, last_name: e.target.value })
                              }
                            />
                            <Input
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({ ...editingUser, email: e.target.value })
                              }
                            />
                            <Button onClick={updateUser} className="bg-green-600 text-white">
                              Сохранить
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        {/* Номера */}
        <TabsContent value="rooms">
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Название</th>
                <th className="border px-4 py-2">Категория</th>
                <th className="border px-4 py-2">Комнат</th>
                <th className="border px-4 py-2">Площадь</th>
                <th className="border px-4 py-2">Спальных мест</th>
                <th className="border px-4 py-2">Телевизор</th>
                <th className="border px-4 py-2">Цена будни</th>
                <th className="border px-4 py-2">Цена выходные</th>
                <th className="border px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td className="border px-4 py-2">{r.id}</td>
                  <td className="border px-4 py-2">{r.title}</td>
                  <td className="border px-4 py-2">{r.category}</td>
                  <td className="border px-4 py-2">{r.rooms}</td>
                  <td className="border px-4 py-2">{r.area}</td>
                  <td className="border px-4 py-2">{r.beds}</td>
                  <td className="border px-4 py-2">{r.tv ? "Да" : "Нет"}</td>
                  <td className="border px-4 py-2">{r.priceWeekdays}</td>
                  <td className="border px-4 py-2">{r.priceWeekend}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <Button
                      onClick={() => deleteRoom(r.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Удалить
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setEditingRoom({ ...r })}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          ✏️ Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактирование номера</DialogTitle>
                        </DialogHeader>
                        {editingRoom && (
                          <div className="space-y-3 mt-3">
                            <Input
                              value={editingRoom.title}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, title: e.target.value })
                              }
                            />
                            <Input
                              value={editingRoom.category}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, category: e.target.value })
                              }
                            />
                            <Input
                              value={editingRoom.area}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, area: e.target.value })
                              }
                            />
                            <Input
                              value={editingRoom.priceWeekdays}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, priceWeekdays: e.target.value })
                              }
                            />
                            <Input
                              value={editingRoom.priceWeekend}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, priceWeekend: e.target.value })
                              }
                            />
                            <Button onClick={updateRoom} className="bg-green-600 text-white">
                              Сохранить
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
                {/* Срубы */}
        <TabsContent value="cabins">
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Название</th>
                <th className="border px-4 py-2">Категория</th>
                <th className="border px-4 py-2">Комнат</th>
                <th className="border px-4 py-2">Этажей</th>
                <th className="border px-4 py-2">Спальных мест</th>
                <th className="border px-4 py-2">Бассейн</th>
                <th className="border px-4 py-2">Цена будни</th>
                <th className="border px-4 py-2">Цена выходные</th>
                <th className="border px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cabins.map((c) => (
                <tr key={c.id}>
                  <td className="border px-4 py-2">{c.id}</td>
                  <td className="border px-4 py-2">{c.title}</td>
                  <td className="border px-4 py-2">{c.category}</td>
                  <td className="border px-4 py-2">{c.rooms}</td>
                  <td className="border px-4 py-2">{c.floors}</td>
                  <td className="border px-4 py-2">{c.beds}</td>
                  <td className="border px-4 py-2">{c.pool ? "Да" : "Нет"}</td>
                  <td className="border px-4 py-2">{c.priceWeekdays}</td>
                  <td className="border px-4 py-2">{c.priceWeekend}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <Button
                      onClick={() => deleteCabin(c.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Удалить
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setEditingCabin({ ...c })}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          ✏️ Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактирование сруба</DialogTitle>
                        </DialogHeader>
                        {editingCabin && (
                          <div className="space-y-3 mt-3">
                            <Input
                              value={editingCabin.title}
                              onChange={(e) =>
                                setEditingCabin({ ...editingCabin, title: e.target.value })
                              }
                            />
                            <Input
                              value={editingCabin.category}
                              onChange={(e) =>
                                setEditingCabin({ ...editingCabin, category: e.target.value })
                              }
                            />
                            <Input
                              value={editingCabin.priceWeekdays}
                              onChange={(e) =>
                                setEditingCabin({
                                  ...editingCabin,
                                  priceWeekdays: e.target.value,
                                })
                              }
                            />
                            <Input
                              value={editingCabin.priceWeekend}
                              onChange={(e) =>
                                setEditingCabin({
                                  ...editingCabin,
                                  priceWeekend: e.target.value,
                                })
                              }
                            />
                            <Button onClick={updateCabin} className="bg-green-600 text-white">
                              Сохранить
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="addUser">
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Имя"
              value={newUser.first_name || ""}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, first_name: e.target.value })}
            />
            <Input
              placeholder="Фамилия"
              value={newUser.last_name || ""}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, last_name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.email || ""}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              placeholder="Пароль"
              type="password"
              onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, password: e.target.value as any })
              }
            />
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Админ</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newUser.role === "admin" ? "default" : "outline"}
                  className={newUser.role === "admin" ? "bg-green-600 text-white" : ""}
                  onClick={() => setNewUser({ ...newUser, role: "admin" })}
                >
                  Да
                </Button>
                <Button
                  type="button"
                  variant={newUser.role !== "admin" ? "default" : "outline"}
                  className={newUser.role !== "admin" ? "bg-red-600 text-white" : ""}
                  onClick={() => setNewUser({ ...newUser, role: "client" })}
                >
                  Нет
                </Button>
              </div>
            </div>
            <Button onClick={createUser} className="bg-green-700 text-white">
              Создать пользователя
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="addRoom">
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Название"
            value={newRoom.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, title: e.target.value })
            }
          />
          <Input
            placeholder="Категория"
            value={newRoom.category || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, category: e.target.value })
            }
          />
          <Input
            placeholder="Комнат"
            type="number"
            value={newRoom.rooms || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, rooms: +e.target.value })
            }
          />
          <Input
            placeholder="Площадь"
            value={newRoom.area || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, area: e.target.value })
            }
          />
          <Input
            placeholder="Спальных мест"
            type="number"
            value={newRoom.beds || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, beds: +e.target.value })
            }
          />
          <div className="flex items-center space-x-3">
            <Label htmlFor="tv">Телевизор</Label>
            <Switch
              id="tv"
              checked={newRoom.tv || false}
              onCheckedChange={(checked) =>
                setNewRoom({ ...newRoom, tv: checked })
              }
            />
            <span className="text-sm text-gray-600">
              {newRoom.tv ? "Да" : "Нет"}
            </span>
          </div>
          <Input
            placeholder="Цена будни"
            value={newRoom.priceWeekdays || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, priceWeekdays: e.target.value })
            }
          />
          <Input
            placeholder="Цена выходные"
            value={newRoom.priceWeekend || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({ ...newRoom, priceWeekend: e.target.value })
            }
          />
          {/* ✅ нормализуем URL картинок */}
          <Input
            placeholder="URL картинок (через запятую)"
            value={newRoom.images?.join(", ") || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom({
                ...newRoom,
                images: e.target.value.split(",").map((url) => url.trim()),
              })
            }
          />
          <Button onClick={createRoom} className="bg-green-700 text-white">
            Создать номер
          </Button>
        </div>
      </TabsContent>

        {/* Создать сруб */}
        <TabsContent value="addCabin">
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Название"
              value={newCabin.title || ""}
              onChange={(e) => setNewCabin({ ...newCabin, title: e.target.value })}
            />
            <Input
              placeholder="Категория"
              value={newCabin.category || ""}
              onChange={(e) => setNewCabin({ ...newCabin, category: e.target.value })}
            />
            <Input
              placeholder="Комнат"
              type="number"
              value={newCabin.rooms || ""}
              onChange={(e) => setNewCabin({ ...newCabin, rooms: +e.target.value })}
            />
            <Input
              placeholder="Этажей"
              type="number"
              value={newCabin.floors || ""}
              onChange={(e) => setNewCabin({ ...newCabin, floors: +e.target.value })}
            />
            <Input
              placeholder="Спальных мест"
              type="number"
              value={newCabin.beds || ""}
              onChange={(e) => setNewCabin({ ...newCabin, beds: +e.target.value })}
            />
            <div className="flex items-center space-x-3">
              <Label htmlFor="pool">Бассейн</Label>
              <Switch
                id="pool"
                checked={newCabin.pool || false}
                onCheckedChange={(checked) => setNewCabin({ ...newCabin, pool: checked })}
              />
              <span className="text-sm text-gray-600">
                {newCabin.pool ? "Да" : "Нет"}
              </span>
            </div>
            <Input
              placeholder="Цена будни"
              value={newCabin.priceWeekdays || ""}
              onChange={(e) =>
                setNewCabin({ ...newCabin, priceWeekdays: e.target.value })
              }
            />
            <Input
              placeholder="Цена выходные"
              value={newCabin.priceWeekend || ""}
              onChange={(e) =>
                setNewCabin({ ...newCabin, priceWeekend: e.target.value })
              }
            />
            <Input
              placeholder="URL картинок (через запятую)"
              value={newCabin.images?.join(", ") || ""}
              onChange={(e) =>
                setNewCabin({
                  ...newCabin,
                  images: e.target.value.split(",").map((url) => url.trim()),
                })
              }
            />
            <Button onClick={createCabin} className="bg-green-700 text-white">
              Создать сруб
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

