import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingPage from "./components/form/BookingPage";

const Home = lazy(() => import("./components/home/Home"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
