import { useEffect, useState } from "react";
import { Booking } from "../../type/Type";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/bookings/my", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load bookings");
      }

      setBookings(data);
    } catch (error: any) {
      alert(error.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      alert("Booking cancelled ✅");
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error: any) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 border-b">Booking ID</th>
                <th className="text-left px-4 py-3 border-b">Room ID</th>
                <th className="text-left px-4 py-3 border-b">Check-in</th>
                <th className="text-left px-4 py-3 border-b">Check-out</th>
                <th className="text-left px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{booking.id}</td>
                  <td className="px-4 py-3 border-b">{booking.roomId}</td>
                  <td className="px-4 py-3 border-b">{booking.checkIn}</td>
                  <td className="px-4 py-3 border-b">{booking.checkOut}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
