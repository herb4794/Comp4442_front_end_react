import React, { useContext, useEffect, useState } from "react";
import { ContextObj } from "../../store/Context";
import { ItemProps } from "../../type/Type";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Item = ({ room, images }: ItemProps) => {
  const { loginStatus } = useContext(ContextObj);
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  const roomTitle = room.title || room.name || `Room ${room.id}`;
  const today = new Date().toISOString().split("T")[0];

  const getNextDay = (dateString: string) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkIn || !checkOut) {
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
          `http://localhost:8080/bookings/check?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();
        console.log("availability response:", data);

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
  }, [checkIn, checkOut, room.id]);

  const handleBookNow = async () => {
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
      setLoading(true);

      console.log("booking room:", room);
      console.log("sending roomId:", room.id);
      console.log("sending checkIn:", checkIn);
      console.log("sending checkOut:", checkOut);

      const res = await fetch("http://localhost:8080/bookings", {
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
      console.log("booking response:", data);

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
      setLoading(false);
    }
  };

  const isBookDisabled =
    loading ||
    checkingAvailability ||
    !checkIn ||
    !checkOut ||
    isAvailable === false;

  return (
    <div className="w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
      <div className="mb-6">
        <img className="h-48 w-full rounded-base bg-gray-200 flex items-center justify-center text-gray-500" src={images} onClick={() =>
          navigate(`/rooms/${room.id}`, { state: { room, image: images } })}>
        </img>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <svg className="w-5 h-5 text-fg-yellow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg className="w-5 h-5 text-fg-yellow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg className="w-5 h-5 text-fg-yellow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg className="w-5 h-5 text-fg-yellow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg className="w-5 h-5 text-fg-yellow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
        </div>

        <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">
          4.8 out of 5
        </span>
      </div>

      <h5 className="text-xl text-heading font-semibold tracking-tight">
        {roomTitle}
      </h5>

      {room.description && (
        <p className="mt-2 text-sm text-gray-600">{room.description}</p>
      )}

      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn ? getNextDay(checkIn) : ""}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={!checkIn}
          />
        </div>

        {checkingAvailability && (
          <p className="text-sm text-blue-600">Checking availability...</p>
        )}

        {!checkingAvailability && availabilityMsg && (
          <p
            className={`text-sm font-medium ${isAvailable ? "text-green-600" : "text-red-600"
              }`}
          >
            {availabilityMsg}
          </p>
        )}

        {!checkingAvailability && isAvailable === false && (
          <p className="text-xs text-red-500">
            This time range has already been booked and cannot be reserved.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-3xl font-extrabold text-heading">
          ${Number(room.price).toFixed(1)} / Day
        </span>

        <button
          type="button"
          onClick={handleBookNow}
          disabled={isBookDisabled}
          className={`inline-flex items-center text-white box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none ${isBookDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-brand hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium"
            }`}
        >
          {loading
            ? "Booking..."
            : checkingAvailability
              ? "Checking..."
              : "Book now"}
        </button>
      </div>
    </div>
  );
};

export default Item;
