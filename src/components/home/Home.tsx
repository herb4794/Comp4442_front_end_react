
import room1 from "../../assets/room/room1.jpeg";
import room2 from "../../assets/room/room2.jpeg";
import room3 from "../../assets/room/room3.jpeg";
import room4 from "../../assets/room/room4.jpeg";
import room5 from "../../assets/room/room5.jpeg";
import room6 from "../../assets/room/room6.jpeg";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Item from "../room/Item";
import { Room } from "../../type/Type";

const roomImages = [room1, room2, room3, room4, room5, room6]

const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/rooms");
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to load rooms");
      }

      console.log(data)
      setRooms(data);
    } catch (error) {
      console.error(error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold">Booking System</h2>

          {loading ? (
            <p className="mt-10">Loading rooms...</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <Item key={room.id} room={room} images={roomImages[index % roomImages.length]} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mx-auto mt-32 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
          <p className="text-sm text-gray-600 max-md:text-center">
            © <a href="#">Created by Lawrence Cheng</a>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
