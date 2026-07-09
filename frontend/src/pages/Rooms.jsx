import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import { rooms } from "@/data/mockData";

const banner = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90";
const filters = ["All Suites", "Signature", "Popular", "Waterfront", "Presidential"];

export default function Rooms() {
  const [modalRoom, setModalRoom] = useState(rooms[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("All Suites");

  const visible = filter === "All Suites" ? rooms : rooms.filter((r) => r.tag === filter);

  return (
    <div className="bg-[#FAFAF8]" data-testid="rooms-page">
      <Navbar transparent />

      {/* Editorial banner */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6" data-testid="breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-white/40"></i>
            <span className="text-white">Rooms & Suites</span>
          </nav>
          <p className="text-eyebrow text-[#E6C868]">Twenty-Two Sanctuaries</p>
          <h1 className="mt-4 font-serif text-white text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl">
            Rooms <span className="italic font-light">&</span> Suites
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl">Each residence is a private world — hand-block prints, mirrored ceilings, and views that arrive as your quiet company.</p>
        </div>
      </section>

      {/* Booking widget compact */}
      <section className="relative -mt-14 z-20 px-4 md:px-8 pb-12">
        <BookingWidget variant="floating" showOpenStates={false} />
      </section>

      {/* Filters */}
      <section className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 py-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm transition-all ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
              data-testid={`filter-${f.toLowerCase().replace(/\s/g, "-")}`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
            <span>{visible.length} residences</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <button className="text-slate-900 flex items-center gap-1.5">
              <i className="fa-solid fa-sliders text-xs"></i> Sort
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((r, i) => (
            <RoomCard key={r.id} room={r} index={i} onDetails={(room) => { setModalRoom(room); setModalOpen(true); }} />
          ))}
        </div>
      </section>

      {/* Compare bar */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto p-8 rounded-[24px] bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <p className="text-eyebrow text-[#C9A227]">Concierge</p>
            <h3 className="mt-2 font-serif text-2xl text-slate-900">Not sure which suite is right?</h3>
            <p className="text-slate-500 text-sm mt-1">Our reservations team will curate options based on your journey.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-full border border-slate-200 text-slate-900 hover:bg-slate-50 text-sm">Compare Suites</button>
            <Link to="/booking" className="px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm">Speak to Concierge</Link>
          </div>
        </div>
      </section>

      <Footer />

      <RoomDetailModal open={modalOpen} onClose={() => setModalOpen(false)} room={modalRoom} />
    </div>
  );
}
