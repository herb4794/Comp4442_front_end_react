import room1 from "../../assets/room/room1.jpeg";
import room2 from "../../assets/room/room2.jpeg";
import room3 from "../../assets/room/room3.jpeg";
import room4 from "../../assets/room/room4.jpeg";
import room5 from "../../assets/room/room5.jpeg";
import room6 from "../../assets/room/room6.jpeg";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../header/Header";
import { ContextObj } from "../../store/Context";
import { LocationState, Room } from "../../type/Type";
import toast from "react-hot-toast";

const roomImages = [room1, room2, room3, room4, room5, room6];


const RoomDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const { loginStatus, api } = useContext(ContextObj);

  const [room, setRoom] = useState<Room | null>(state?.room ?? null);
  const [image, setImage] = useState<string>(state?.image ?? "");
  const [pageLoading, setPageLoading] = useState<boolean>(!state?.room);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  const getNextDay = (dateString: string) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchRoom = async () => {
      if (room) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        const res = await fetch(`${api}/rooms`);
        const data: Room[] = await res.json();

        console.log(data)

        if (!res.ok) {
          throw new Error("Failed to load room");
        }


        const foundRoom = data.find((item) => item.id === Number(id));

        if (!foundRoom) {
          throw new Error("Room not found");
        }

        setRoom(foundRoom);

        const roomIndex = data.findIndex((item) => item.id === Number(id));
        if (roomIndex >= 0) {
          setImage(roomImages[roomIndex % roomImages.length]);
        }
      } catch (error) {
        console.error(error);
        setRoom(null);
      } finally {
        setPageLoading(false);
      }
    };

    fetchRoom();
  }, [id, room]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!room || !checkIn || !checkOut) {
        setIsAvailable(null);
        setAvailabilityMsg("");
        return;
      }

      if (new Date(checkIn) >= new Date(checkOut)) {
        setIsAvailable(false);
        setAvailabilityMsg("Check-out must be after check-in");
        return;
      }

      try {
        setCheckingAvailability(true);

        const res = await fetch(
          `${api}/bookings/check?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to check availability");
        }

        setIsAvailable(data.available);
        setAvailabilityMsg(data.message || "");
      } catch (error: any) {
        setIsAvailable(false);
        setAvailabilityMsg(error.message || "Failed to check availability");
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [room, checkIn, checkOut]);

  const handleBookNow = async () => {
    if (!room) return;

    if (!loginStatus) {
      toast.error("Please login first");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out must be after check-in");
      return;
    }

    if (isAvailable === false) {
      toast.error("This date range is already booked");
      return;
    }

    try {
      setBookingLoading(true);

      const res = await fetch(`${api}/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn,
          checkOut,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success("Booking success");
      setCheckIn("");
      setCheckOut("");
      setIsAvailable(null);
      setAvailabilityMsg("");
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = checkIn ? getNextDay(checkIn) : "";
  const roomTitle = room?.title || room?.name || `Room ${room?.id ?? ""}`;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-10 text-xl font-medium">
          Loading room details...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold mb-4">Room not found</h1>
          <Link
            to="/"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-block mb-6 text-blue-600 font-medium hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-6">
          <div>
            <img
              src={image || roomImages[0]}
              alt={roomTitle}
              className="w-full h-[420px] object-cover rounded-2xl"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Room ID: {room.id}</p>
              <h1 className="text-4xl font-bold mb-4">{roomTitle}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-gray-700">4.8 out of 5</span>
              </div>

              <p className="text-gray-700 leading-7 mb-6">
                {room.description || "No room description available yet."}
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-3xl font-bold text-blue-700">
                  ${Number(room.price).toFixed(1)}
                  <span className="text-base text-gray-600 font-medium">
                    {" "}
                    / day
                  </span>
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-5">
              <h2 className="text-2xl font-semibold mb-4">Book this room</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium">Check-in</label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCheckIn(value);

                      if (checkOut && value >= checkOut) {
                        setCheckOut("");
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Check-out</label>
                  <input
                    type="date"
                    min={minCheckOut || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    disabled={!checkIn}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {checkingAvailability && (
                <p className="text-sm text-blue-600 mb-3">
                  Checking availability...
                </p>
              )}

              {!checkingAvailability && availabilityMsg && (
                <p
                  className={`text-sm mb-3 ${isAvailable === false ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {availabilityMsg}
                </p>
              )}

              {!checkingAvailability && isAvailable === false && (
                <p className="text-sm text-red-600 mb-3">
                  This time range has already been booked and cannot be reserved.
                </p>
              )}

              <button
                onClick={handleBookNow}
                disabled={
                  bookingLoading ||
                  checkingAvailability ||
                  !checkIn ||
                  !checkOut ||
                  isAvailable === false
                }
                className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold disabled:opacity-50"
              >
                {bookingLoading
                  ? "Booking..."
                  : checkingAvailability
                    ? "Checking..."
                    : "Book now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
