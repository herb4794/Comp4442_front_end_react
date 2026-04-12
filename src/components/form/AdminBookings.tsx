import { useEffect, useState } from "react";
import { Booking } from "../../type/Type";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const fetchAllBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/bookings/all", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load all bookings");
      }

      setBookings(data);
    } catch (error: any) {
      alert(error.message || "Failed to load all bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditCheckIn(booking.checkIn);
    setEditCheckOut(booking.checkOut);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCheckIn("");
    setEditCheckOut("");
  };

  const handleSave = async (bookingId: number) => {
    if (!editCheckIn || !editCheckOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (new Date(editCheckIn) >= new Date(editCheckOut)) {
      alert("Check-out must be after check-in");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkIn: editCheckIn,
          checkOut: editCheckOut,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, checkIn: data.checkIn, checkOut: data.checkOut }
            : booking
        )
      );

      alert("Booking updated ✅");
      cancelEdit();
    } catch (error: any) {
      alert(error.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
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

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      alert("Booking cancelled ✅");
    } catch (error: any) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

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
                <th className="text-left px-4 py-3 border-b">User ID</th>
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
                  <td className="px-4 py-3 border-b">{booking.userId}</td>
                  <td className="px-4 py-3 border-b">{booking.roomId}</td>

                  <td className="px-4 py-3 border-b">
                    {editingId === booking.id ? (
                      <input
                        type="date"
                        value={editCheckIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      booking.checkIn
                    )}
                  </td>

                  <td className="px-4 py-3 border-b">
                    {editingId === booking.id ? (
                      <input
                        type="date"
                        value={editCheckOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      booking.checkOut
                    )}
                  </td>

                  <td className="px-4 py-3 border-b space-x-2">
                    {editingId === booking.id ? (
                      <>
                        <button
                          onClick={() => handleSave(booking.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(booking)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
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

export default AdminBookings;
