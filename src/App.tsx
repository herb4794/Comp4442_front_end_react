import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingPage from "./components/form/BookingPage";
import { Toaster } from "react-hot-toast";
import RoomDetailPage from "./components/room/RoomDetailPage";

const Home = lazy(() => import("./components/home/Home"));

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#111827",
          },
        }}
      />
      <Suspense fallback={<div className="p-6">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
