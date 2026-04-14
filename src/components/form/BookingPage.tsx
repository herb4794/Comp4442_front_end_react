import { useContext } from "react";
import { ContextObj } from "../../store/Context";
import MyBookings from "./MyBookings";
import AdminBookings from "./AdminBookings";
import Header from "../header/Header";

const BookingPage = () => {
  const { auth, loginStatus } = useContext(ContextObj);

  if (!loginStatus) {
    return (
      <div>
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Bookings</h1>
          <p>Please login first.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        {auth.role === 0 ? <AdminBookings /> : <MyBookings />}
      </div>
    </div>
  );
};

export default BookingPage;
