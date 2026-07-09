import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import Confirmation from "@/pages/Confirmation";
import Dashboard from "@/pages/Dashboard";
import Experiences from "@/pages/Experiences";
import Dining from "@/pages/Dining";
import Spa from "@/pages/Spa";
import GalleryContact from "@/pages/GalleryContact";

function App() {
  useEffect(() => {
    document.title = "Aura Hotels | Timeless Heritage & Luxury";
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/gallery" element={<GalleryContact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
