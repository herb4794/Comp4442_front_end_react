import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Booking } from "../../type/Type";

const getBookingStatus = (checkIn: string, checkOut: string) => {
  const today = new Date();
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today < start) return "Upcoming";
  if (today >= start && today < end) return "Ongoing";
  return "Completed";
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Upcoming":
      return "bg-yellow-100 text-yellow-800";
    case "Ongoing":
      return "bg-green-100 text-green-800";
    case "Completed":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/bookings/my", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load your bookings");
      }

      setBookings(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load your bookings");
      setBookings([]);
    } finally {
      setLoading(false);
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
      toast.success(data.message || "Booking cancelled successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const enrichedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,
      status: getBookingStatus(booking.checkIn, booking.checkOut),
    }));
  }, [bookings]);

  const uniqueRoomIds = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.roomId))].sort(
      (a, b) => a - b
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return enrichedBookings.filter((booking) => {
      const matchesSearch =
        booking.id.toString().includes(searchTerm) ||
        booking.roomId.toString().includes(searchTerm);

      const matchesRoom =
        roomFilter === "" || booking.roomId.toString() === roomFilter;

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesRoom && matchesStatus;
    });
  }, [enrichedBookings, searchTerm, roomFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-3xl font-bold mb-6">My Booking History</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by booking ID or room ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          >
            <option value="">All Rooms</option>
            {uniqueRoomIds.map((roomId) => (
              <option key={roomId} value={roomId}>
                Room {roomId}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          >
            <option value="All">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <p>Loading your bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">No matching bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full bg-white text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b">Booking ID</th>
                  <th className="px-4 py-3 border-b">Room ID</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b">Check-in</th>
                  <th className="px-4 py-3 border-b">Check-out</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{booking.id}</td>
                    <td className="px-4 py-3 border-b">{booking.roomId}</td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">{booking.checkIn}</td>
                    <td className="px-4 py-3 border-b">{booking.checkOut}</td>
                    <td className="px-4 py-3 border-b">
                      {booking.status === "Upcoming" ? (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
