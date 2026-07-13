import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import { rooms as allRooms } from "@/data/mockData";
import { useTenantPath } from "@/hooks/useTenantPath";

const banner = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90";
const filters = ["All Suites", "Signature", "Popular", "Waterfront", "Presidential"];

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price · Low to High" },
  { id: "price-desc", label: "Price · High to Low" },
  { id: "size-desc", label: "Size · Largest first" },
  { id: "capacity-desc", label: "Capacity · Most guests" },
];

export default function Rooms() {
  const t = useTenantPath();
  const [modalRoom, setModalRoom] = useState(allRooms[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("All Suites");
  const [sortId, setSortId] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [widget, setWidget] = useState({ adults: 2, children: 0, rooms: 1 });
  const [compareOpen, setCompareOpen] = useState(false);
  const [compare, setCompare] = useState([]); // room ids

  const totalGuests = widget.adults + widget.children;

  const visible = useMemo(() => {
    let list = [...allRooms];
    if (filter !== "All Suites") list = list.filter((r) => r.tag === filter);
    // capacity filter based on widget
    list = list.filter((r) => r.guests * widget.rooms >= totalGuests);
    switch (sortId) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "size-desc": list.sort((a, b) => b.size - a.size); break;
      case "capacity-desc": list.sort((a, b) => b.guests - a.guests); break;
      default: break;
    }
    return list;
  }, [filter, sortId, widget.rooms, totalGuests]);

  const toggleCompare = (id) => setCompare((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s));

  const compareRooms = compare.map((id) => allRooms.find((r) => r.id === id)).filter(Boolean);

  return (
    <div className="bg-brand-surface" data-testid="rooms-page">
      <Navbar transparent />

      {/* Editorial banner */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6" data-testid="breadcrumb">
            <Link to={t("")} className="hover:text-white">Home</Link>
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

      {/* Widget wired to filter */}
      <section className="relative -mt-14 z-20 px-4 md:px-8 pb-12">
        <BookingWidget variant="floating" showOpenStates={false} onChange={setWidget} />
      </section>

      {/* Filters + Sort */}
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
          <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
            <span data-testid="rooms-count">{visible.length} residence{visible.length !== 1 ? "s" : ""} · Up to {totalGuests} guests</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200"
                data-testid="sort-toggle"
              >
                <i className="fa-solid fa-sliders text-xs"></i>
                {sortOptions.find((o) => o.id === sortId)?.label || "Sort"}
                <i className={`fa-solid fa-chevron-down text-[9px] transition-transform ${sortOpen ? "rotate-180" : ""}`}></i>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] p-2 z-30" data-testid="sort-menu">
                  {sortOptions.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => { setSortId(o.id); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-[10px] text-sm flex items-center justify-between transition-colors ${
                        sortId === o.id ? "bg-indigo-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                      }`}
                      data-testid={`sort-${o.id}`}
                    >
                      <span>{o.label}</span>
                      {sortId === o.id && <i className="fa-solid fa-check text-[#4F46E5] text-xs"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {visible.length === 0 ? (
            <div className="p-16 text-center rounded-[24px] border border-slate-200 bg-white" data-testid="empty-state">
              <i className="fa-regular fa-face-frown text-3xl text-slate-300"></i>
              <p className="mt-4 font-serif text-2xl text-slate-900">No suites match your selection</p>
              <p className="mt-2 text-sm text-slate-500">Adjust your filters or guest count and we&apos;ll find your perfect residence.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((r, i) => (
                <div key={r.id} className="relative">
                  <RoomCard room={r} index={i} onDetails={(room) => { setModalRoom(room); setModalOpen(true); }} />
                  <button
                    onClick={() => toggleCompare(r.id)}
                    className={`absolute bottom-4 right-4 z-10 h-9 pl-3 pr-4 rounded-full text-xs flex items-center gap-2 border transition-all ${
                      compare.includes(r.id)
                        ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                        : "bg-white/95 backdrop-blur text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                    data-testid={`compare-toggle-${r.id}`}
                  >
                    <i className={`fa-solid ${compare.includes(r.id) ? "fa-check" : "fa-plus"} text-[10px]`}></i>
                    {compare.includes(r.id) ? "Comparing" : "Compare"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compare bar */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto p-8 rounded-[24px] bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between" data-testid="compare-bar">
          <div>
            <p className="text-eyebrow text-[#C9A227]">Concierge</p>
            <h3 className="mt-2 font-serif text-2xl text-slate-900">Not sure which suite is right?</h3>
            <p className="text-slate-500 text-sm mt-1">
              {compare.length > 0
                ? `${compare.length} suite${compare.length > 1 ? "s" : ""} added to compare · up to 4`
                : "Tap 'Compare' on suites you love — we&apos;ll place them side-by-side."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareOpen(true)}
              disabled={compare.length < 2}
              className="px-6 py-3 rounded-full border border-slate-200 text-slate-900 hover:bg-slate-50 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="compare-open"
            >
              Compare {compare.length > 0 ? `(${compare.length})` : "Suites"}
            </button>
            <Link to={t("booking")} className="px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-sm">Speak to Concierge</Link>
          </div>
        </div>
      </section>

      <Footer />

      <RoomDetailModal open={modalOpen} onClose={() => setModalOpen(false)} room={modalRoom} />

      {/* COMPARE MODAL */}
      {compareOpen && compareRooms.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="compare-modal">
          <div className="bg-white w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative reveal-scale">
            <button
              onClick={() => setCompareOpen(false)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full glass grid place-items-center hover:bg-white"
              data-testid="compare-close"
            >
              <i className="fa-solid fa-xmark text-slate-700 text-sm"></i>
            </button>

            <div className="p-8 md:p-10 border-b border-slate-100">
              <p className="text-eyebrow text-[#C9A227]">Suite Comparison</p>
              <h2 className="mt-2 font-serif text-4xl text-slate-900">Side by side</h2>
              <p className="mt-2 text-sm text-slate-500">Compare up to four residences. Remove any at the top right of its column.</p>
            </div>

            <div className="p-8 md:p-10 grid gap-6" style={{ gridTemplateColumns: `repeat(${compareRooms.length}, minmax(0, 1fr))` }}>
              {compareRooms.map((r) => (
                <div key={r.id} className="rounded-[20px] border border-slate-200 overflow-hidden bg-white">
                  <div className="relative aspect-[4/3]">
                    <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleCompare(r.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 grid place-items-center hover:bg-white"
                      data-testid={`compare-remove-${r.id}`}
                    >
                      <i className="fa-solid fa-xmark text-slate-700 text-xs"></i>
                    </button>
                    <span className="absolute top-3 left-3 glass-dark text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">{r.tag}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-2xl text-slate-900">{r.name}</h3>
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
                      <Row l="From" v={`$${r.price} / night`} mono />
                      <Row l="Guests" v={`Up to ${r.guests}`} />
                      <Row l="Size" v={`${r.size} ft²`} mono />
                      <Row l="Bedding" v={r.bed} />
                      <Row l="View" v={r.view} />
                      <Row l="Breakfast" v={r.breakfast ? "Included" : "—"} emerald={r.breakfast} />
                      <Row l="Cancellation" v={r.cancellation} />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-eyebrow text-slate-500 mb-2">Amenities</p>
                      <ul className="space-y-1.5">
                        {r.amenities.slice(0, 5).map((a) => (
                          <li key={a} className="text-xs text-slate-600 flex items-center gap-2">
                            <i className="fa-solid fa-check text-[#C9A227] text-[9px]"></i>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 flex flex-col gap-2">
                      <button
                        onClick={() => { setModalRoom(r); setModalOpen(true); setCompareOpen(false); }}
                        className="w-full py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs"
                      >View Details</button>
                      <Link to={t("booking")} className="w-full text-center py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-xs">Reserve</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Row = ({ l, v, mono, emerald }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-500 text-xs">{l}</span>
    <span className={`${mono ? "font-mono" : ""} text-slate-900 text-sm ${emerald ? "text-emerald-600" : ""}`}>{v}</span>
  </div>
);
