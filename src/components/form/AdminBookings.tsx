import { useEffect, useMemo, useState } from "react";
import { Booking, User } from "../../type/Type";
import toast from "react-hot-toast";


const getUsernameFromEmail = (email?: string) => {
  if (!email) return "";
  return email.split("@")[0];
};

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

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [bookingRes, userRes] = await Promise.all([
        fetch("http://localhost:8080/bookings/all", {
          method: "GET",
          credentials: "include",
        }),
        fetch("http://localhost:8080/admin/users", {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const bookingData = await bookingRes.json();
      const userData = await userRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to load all bookings");
      }

      if (!userRes.ok) {
        throw new Error(userData.error || "Failed to load users");
      }

      setBookings(bookingData);
      setUsers(userData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
      setBookings([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const userMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, user]));
  }, [users]);

  const enrichedBookings = useMemo(() => {
    return bookings.map((booking) => {
      const matchedUser = userMap.get(booking.userId);
      const username = matchedUser?.email
        ? getUsernameFromEmail(matchedUser.email)
        : `User #${booking.userId}`;
      const status =
        booking.checkIn && booking.checkOut
          ? getBookingStatus(booking.checkIn, booking.checkOut)
          : "Unknown";

      return {
        ...booking,
        username,
        status,
      };
    });
  }, [bookings, userMap]);

  const filteredBookings = useMemo(() => {
    return enrichedBookings.filter((booking) => {
      const matchesSearch =
        booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId.toString().includes(searchTerm) ||
        booking.id.toString().includes(searchTerm);

      const matchesRoom =
        roomFilter === "" || booking.roomId.toString() === roomFilter;

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesRoom && matchesStatus;
    });
  }, [enrichedBookings, searchTerm, roomFilter, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: enrichedBookings.length,
      upcoming: enrichedBookings.filter((b) => b.status === "Upcoming").length,
      ongoing: enrichedBookings.filter((b) => b.status === "Ongoing").length,
      completed: enrichedBookings.filter((b) => b.status === "Completed").length,
    };
  }, [enrichedBookings]);

  const uniqueRoomIds = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.roomId))].sort(
      (a, b) => a - b
    );
  }, [bookings]);

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
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(editCheckIn) >= new Date(editCheckOut)) {
      toast.error("Check-out must be after check-in");
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

      toast.success("Booking updated");
      cancelEdit();
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking");
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
      toast.success("Booking cancelled");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">All Bookings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{summary.total}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.upcoming}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Ongoing</p>
          <p className="text-2xl font-bold text-green-600">{summary.ongoing}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-700">{summary.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by username, booking ID, user ID"
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
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p>No matching bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 border-b">Booking ID</th>
                <th className="text-left px-4 py-3 border-b">Username</th>
                <th className="text-left px-4 py-3 border-b">User ID</th>
                <th className="text-left px-4 py-3 border-b">Room ID</th>
                <th className="text-left px-4 py-3 border-b">Status</th>
                <th className="text-left px-4 py-3 border-b">Check-in</th>
                <th className="text-left px-4 py-3 border-b">Check-out</th>
                <th className="text-left px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{booking.id}</td>
                  <td className="px-4 py-3 border-b font-medium">{booking.username}</td>
                  <td className="px-4 py-3 border-b">{booking.userId}</td>
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
