import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const RoomDetailModal = ({ open, onClose, room }) => {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  useEffect(() => { if (open) setI(0); }, [open, room?.id]);
  if (!open || !room) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="room-detail-modal">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative reveal-scale">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white"
          data-testid="modal-close"
        >
          <i className="fa-solid fa-xmark text-slate-700 text-sm"></i>
        </button>

        {/* Header image */}
        <div className="relative h-[380px] md:h-[440px] bg-slate-100">
          <img src={room.images[i]} alt={room.name} className="w-full h-full object-cover" />
          {/* Thumbs */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {room.images.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-8" : "bg-white/50 w-3"}`} />
            ))}
          </div>
          {/* 360 pill */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="glass-dark text-white text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-vr-cardboard mr-2"></i>360° Preview
            </span>
            <span className="glass-dark text-white text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full">
              {room.tag}
            </span>
          </div>
          {/* Nav arrows */}
          <button onClick={() => setI((i - 1 + room.images.length) % room.images.length)}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass flex items-center justify-center">
            <i className="fa-solid fa-chevron-left text-slate-800 text-sm"></i>
          </button>
          <button onClick={() => setI((i + 1) % room.images.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass flex items-center justify-center">
            <i className="fa-solid fa-chevron-right text-slate-800 text-sm"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-8 md:p-12">
          <div className="lg:col-span-2">
            <p className="text-eyebrow text-[#C9A227]">Signature Suite</p>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mt-2">{room.name}</h2>
            <p className="mt-5 text-slate-600 text-[15px] leading-relaxed max-w-2xl">{room.description}</p>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { i: "expand", l: "Size", v: `${room.size} sq.ft` },
                { i: "user-group", l: "Guests", v: `Up to ${room.guests}` },
                { i: "bed", l: "Bedding", v: room.bed },
                { i: "mountain-sun", l: "View", v: room.view },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-[#C9A227] pl-4">
                  <p className="text-eyebrow text-slate-400">{s.l}</p>
                  <p className="font-serif text-xl text-slate-900 mt-1">{s.v}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="mt-10">
              <p className="font-serif text-2xl text-slate-900">Premium Amenities</p>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-slate-700 text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center text-[10px]">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Floor plan + policies */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[20px] bg-[#FAFAF8] border border-slate-200">
                <p className="font-serif text-xl text-slate-900">Floor Plan</p>
                <div className="mt-4 aspect-[4/3] rounded-[14px] bg-white border border-slate-200 grid place-items-center">
                  <svg viewBox="0 0 200 150" className="w-3/4 text-slate-300">
                    <rect x="10" y="10" width="180" height="130" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="20" y="20" width="90" height="70" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <rect x="115" y="20" width="65" height="70" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <rect x="20" y="95" width="160" height="35" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="65" y="60" textAnchor="middle" fontSize="8" fill="#94a3b8">Bedroom</text>
                    <text x="147" y="60" textAnchor="middle" fontSize="8" fill="#94a3b8">Bath</text>
                    <text x="100" y="118" textAnchor="middle" fontSize="8" fill="#94a3b8">Living & Terrace</text>
                  </svg>
                </div>
              </div>
              <div className="p-6 rounded-[20px] bg-[#FAFAF8] border border-slate-200">
                <p className="font-serif text-xl text-slate-900">Policies</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3"><i className="fa-regular fa-clock text-[#C9A227] mt-1"></i>Check-in from 14:00 · Check-out by 12:00</li>
                  <li className="flex gap-3"><i className="fa-solid fa-shield-halved text-[#C9A227] mt-1"></i>Free cancellation up to 48h before arrival</li>
                  <li className="flex gap-3"><i className="fa-solid fa-paw text-[#C9A227] mt-1"></i>Pets welcome with prior notice</li>
                  <li className="flex gap-3"><i className="fa-solid fa-utensils text-[#C9A227] mt-1"></i>Breakfast included for all guests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <p className="text-eyebrow text-slate-500">Starting Rate</p>
              <p className="font-mono text-4xl text-slate-900 mt-2">${room.price}<span className="text-base text-slate-500 font-sans"> / night</span></p>
              <p className="text-xs text-slate-500 mt-1">Excludes taxes & fees · {room.cancellation}</p>

              {/* Mini calendar strip */}
              <div className="mt-6">
                <p className="text-eyebrow text-slate-500">Availability</p>
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }).map((_, k) => {
                    const d = new Date(); d.setDate(d.getDate() + k);
                    const active = k >= 2 && k <= 5;
                    return (
                      <div key={k} className={`text-center rounded-[10px] py-2 ${active ? "bg-indigo-50 text-slate-900" : "bg-[#FAFAF8] text-slate-500"}`}>
                        <p className="text-[9px] tracking-widest uppercase">{d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}</p>
                        <p className="text-sm font-medium">{d.getDate()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600"><span>${room.price} × 3 nights</span><span className="font-mono">${room.price * 3}</span></div>
                <div className="flex justify-between text-slate-600"><span>Taxes & service</span><span className="font-mono">${Math.round(room.price * 3 * 0.18)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Butler gratuity</span><span className="text-emerald-600">Included</span></div>
                <div className="flex justify-between text-slate-900 font-medium pt-3 border-t border-slate-100 mt-3">
                  <span>Total</span>
                  <span className="font-mono text-lg">${room.price * 3 + Math.round(room.price * 3 * 0.18)}</span>
                </div>
              </div>

              <button
                onClick={() => nav("/booking")}
                className="mt-6 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm py-4 rounded-full shadow-[0_10px_28px_rgba(79,70,229,0.32)]"
                data-testid="modal-reserve-btn"
              >
                Reserve · Select Dates
              </button>
              <button className="mt-3 w-full border border-slate-200 text-slate-800 hover:bg-slate-50 text-sm py-3 rounded-full">
                <i className="fa-regular fa-heart mr-2"></i>Save for later
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
