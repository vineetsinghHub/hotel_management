import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const monthName = (d) => d.toLocaleString("en-US", { month: "long", year: "numeric" });
const fmtShort = (d) => d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

// A luxury glassmorphism booking widget with an OPEN calendar popover, guest selector, promo field.
export const BookingWidget = ({ variant = "floating", showOpenStates = true, onChange }) => {
  const nav = useNavigate();
  const today = new Date();
  const inTwo = new Date(); inTwo.setDate(today.getDate() + 2);
  const inFive = new Date(); inFive.setDate(today.getDate() + 5);

  const [checkIn, setCheckIn] = useState(inTwo);
  const [checkOut, setCheckOut] = useState(inFive);
  const [openCal, setOpenCal] = useState(showOpenStates);
  const [openGuests, setOpenGuests] = useState(showOpenStates);
  const [openPromo, setOpenPromo] = useState(showOpenStates);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [promo, setPromo] = useState("AURA24");

  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Notify parent of state changes for filtering
  useEffect(() => {
    if (onChange) onChange({ checkIn, checkOut, adults, children, rooms, promo });
  }, [checkIn, checkOut, adults, children, rooms, promo, onChange]);

  const days = (() => {
    const first = new Date(viewMonth);
    const startDay = first.getDay();
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i));
    return cells;
  })();

  const isBetween = (d) => d && d > checkIn && d < checkOut;
  const isSame = (a, b) => a && b && a.toDateString() === b.toDateString();

  const pick = (d) => {
    if (!d) return;
    if (!checkIn || (checkIn && checkOut && d >= checkIn)) {
      if (isSame(d, checkIn)) return;
      if (d < checkIn) setCheckIn(d);
      else setCheckOut(d);
    } else {
      setCheckIn(d);
    }
  };

  const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

  const outer =
    variant === "floating"
      ? "glass rounded-[28px] p-2 md:p-3 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)]"
      : "bg-white rounded-[24px] p-2 md:p-3 border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)]";

  return (
    <div className={`${outer} w-full max-w-5xl mx-auto`} data-testid="booking-widget">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-2 items-stretch">
        {/* Check-in */}
        <button
          onClick={() => setOpenCal((v) => !v)}
          className="md:col-span-3 text-left bg-white/80 hover:bg-white rounded-[20px] px-5 py-4 transition-all"
          data-testid="widget-checkin"
        >
          <p className="text-eyebrow text-slate-500">Check-in</p>
          <p className="mt-1.5 font-serif text-xl text-slate-900">{fmtShort(checkIn)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{checkIn.toLocaleDateString("en-US", { weekday: "long" })} · from 14:00</p>
        </button>
        {/* Check-out */}
        <button
          onClick={() => setOpenCal((v) => !v)}
          className="md:col-span-3 text-left bg-white/80 hover:bg-white rounded-[20px] px-5 py-4 transition-all"
          data-testid="widget-checkout"
        >
          <p className="text-eyebrow text-slate-500">Check-out</p>
          <p className="mt-1.5 font-serif text-xl text-slate-900">{fmtShort(checkOut)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{checkOut.toLocaleDateString("en-US", { weekday: "long" })} · by 12:00</p>
        </button>
        {/* Guests */}
        <button
          onClick={() => setOpenGuests((v) => !v)}
          className="md:col-span-2 text-left bg-white/80 hover:bg-white rounded-[20px] px-5 py-4 transition-all"
          data-testid="widget-guests"
        >
          <p className="text-eyebrow text-slate-500">Guests</p>
          <p className="mt-1.5 font-serif text-xl text-slate-900">{adults + children} <span className="text-sm text-slate-500">Guests</span></p>
          <p className="text-xs text-slate-500 mt-0.5">{rooms} Room · {adults} Adults</p>
        </button>
        {/* Promo */}
        <button
          onClick={() => setOpenPromo((v) => !v)}
          className="md:col-span-2 text-left bg-white/80 hover:bg-white rounded-[20px] px-5 py-4 transition-all"
          data-testid="widget-promo"
        >
          <p className="text-eyebrow text-slate-500">Promo Code</p>
          <p className="mt-1.5 font-serif text-xl text-slate-900">{promo || "Add code"}</p>
          <p className="text-xs text-brand-accent mt-0.5">{promo ? "12% applied" : "Optional"}</p>
        </button>

        {/* Search CTA */}
        <button
          onClick={() => nav("/booking")}
          className="md:col-span-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-[20px] px-6 py-4 flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(79,70,229,0.35)] transition-all hover:-translate-y-0.5"
          data-testid="widget-search"
        >
          <i className="fa-solid fa-search text-sm"></i>
          <span className="text-sm font-medium tracking-wide">Search Availability</span>
        </button>
      </div>

      {/* OPEN popovers row */}
      {(openCal || openGuests || openPromo) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
          {/* Calendar OPEN */}
          {openCal && (
            <div className="md:col-span-6 bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]" data-testid="calendar-popover">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <i className="fa-solid fa-chevron-left text-[11px] text-slate-600"></i>
                </button>
                <p className="font-serif text-lg text-slate-900">{monthName(viewMonth)}</p>
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <i className="fa-solid fa-chevron-right text-[11px] text-slate-600"></i>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="text-[11px] tracking-widest text-slate-400 py-2">{d}</div>
                ))}
                {days.map((d, i) => {
                  if (!d) return <div key={i}></div>;
                  const selected = isSame(d, checkIn) || isSame(d, checkOut);
                  const inRange = isBetween(d);
                  const past = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <button
                      key={i}
                      disabled={past}
                      onClick={() => pick(d)}
                      className={`h-10 rounded-full text-sm transition-all ${
                        past
                          ? "text-slate-300 cursor-not-allowed"
                          : selected
                          ? "bg-brand-primary text-white font-medium"
                          : inRange
                          ? "bg-indigo-50 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">{nights} nights selected</p>
                <p className="text-xs text-brand-accent font-medium">Cancellation: free</p>
              </div>
            </div>
          )}

          {/* Guests OPEN */}
          {openGuests && (
            <div className="md:col-span-3 bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]" data-testid="guest-popover">
              <p className="font-serif text-lg text-slate-900 mb-4">Guest Selection</p>
              {[
                { label: "Adults", desc: "Ages 13+", value: adults, set: setAdults, min: 1 },
                { label: "Children", desc: "Ages 2–12", value: children, set: setChildren, min: 0 },
                { label: "Rooms", desc: "Suites & Rooms", value: rooms, set: setRooms, min: 1 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-slate-900 font-medium">{row.label}</p>
                    <p className="text-xs text-slate-500">{row.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => row.set(Math.max(row.min, row.value - 1))}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >−</button>
                    <span className="font-mono w-6 text-center text-sm">{row.value}</span>
                    <button
                      onClick={() => row.set(row.value + 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promo OPEN */}
          {openPromo && (
            <div className="md:col-span-3 bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]" data-testid="promo-popover">
              <p className="font-serif text-lg text-slate-900 mb-1">Promo Code</p>
              <p className="text-xs text-slate-500 mb-4">Enter a corporate rate or offer code.</p>
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value.toUpperCase())}
                className="w-full bg-brand-surface border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary font-mono tracking-wider"
                placeholder="AURA24"
                data-testid="promo-input"
              />
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  <i className="fa-solid fa-check text-[9px]"></i>
                  12% off applied
                </span>
              </div>
              <button className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm py-2.5 rounded-full">
                Apply Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
