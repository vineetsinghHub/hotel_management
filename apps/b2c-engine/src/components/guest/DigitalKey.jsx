import { useEffect, useState } from "react";
import { toast } from "sonner";

// Simple rotating QR + NFC pulse card. Uses the fast-checkout QR generator logic
// (a copy is kept here to be self-contained — not exact same seed).
const genPattern = (code, ts) => {
  const size = 21;
  const cells = [];
  let seed = 0;
  const src = code + "::" + ts;
  for (let i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
  const rnd = (i) => { seed = (seed * 1103515245 + 12345 + i) >>> 0; return (seed % 100) / 100; };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) continue;
    if (rnd(y * size + x) > 0.52) cells.push({ x, y });
  }
  return { size, cells };
};

export const DigitalKey = ({ suite = "Maharajah Suite", roomNumber = "204", resCode = "AH-9F27C1" }) => {
  const [now, setNow] = useState(0);
  useEffect(() => {
    // Rotate every 6s
    const t = setInterval(() => setNow((n) => n + 1), 6000);
    return () => clearInterval(t);
  }, []);
  const { size, cells } = genPattern(resCode, now);

  const unlock = () => toast.success("Room unlocked · Welcome back", { description: `${suite} · Room ${roomNumber}` });

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white p-8 md:p-10" data-testid="digital-key">
      {/* Ornamental gold circle */}
      <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 rounded-full border border-brand-accent/30"></div>
      <div aria-hidden="true" className="absolute -right-40 -top-40 w-96 h-96 rounded-full border border-brand-accent/15"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-eyebrow text-brand-accent-hover">Digital Key</p>
          <h3 className="mt-1 font-serif text-3xl">Room {roomNumber}</h3>
          <p className="text-sm text-white/70 mt-2">{suite}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative w-14 h-14 grid place-items-center">
              <span className="absolute inset-0 rounded-full border-2 border-brand-accent/60 animate-ping"></span>
              <span className="absolute inset-2 rounded-full border-2 border-brand-accent/40 animate-ping" style={{ animationDelay: "0.4s" }}></span>
              <span className="relative w-8 h-8 rounded-full bg-brand-accent text-slate-900 grid place-items-center"><i className="fa-solid fa-wave-square text-[11px]"></i></span>
            </div>
            <div>
              <p className="text-xs text-white/60">NFC ready</p>
              <p className="text-sm text-white/90">Tap phone at the door reader</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={unlock} className="px-5 py-2.5 rounded-full bg-brand-accent hover:bg-[#B08D1E] text-slate-900 text-sm font-medium" data-testid="digital-key-unlock"><i className="fa-solid fa-unlock text-[10px] mr-1.5"></i>Unlock room</button>
            <button onClick={() => toast.success("Key shared", { description: "An invite has been sent to +91 98200 12346" })} className="px-5 py-2.5 rounded-full glass-dark text-white text-sm" data-testid="digital-key-share"><i className="fa-solid fa-share text-[10px] mr-1.5"></i>Share key</button>
          </div>
        </div>

        <div className="mx-auto">
          <div className="bg-white rounded-[20px] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-52 h-52" data-testid="digital-key-qr" role="img" aria-label="Digital key QR">
              <rect x="0" y="0" width={size} height={size} fill="#FFFFFF" />
              {[[0,0],[size-7,0],[0,size-7]].map(([ox,oy],i)=>(
                <g key={i}>
                  <rect x={ox} y={oy} width="7" height="7" fill="#0F172A" />
                  <rect x={ox+1} y={oy+1} width="5" height="5" fill="#FFFFFF" />
                  <rect x={ox+2} y={oy+2} width="3" height="3" fill="#0F172A" />
                </g>
              ))}
              {cells.map((c, i) => <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#0F172A" />)}
            </svg>
            <p className="mt-2 text-center font-mono text-[10px] text-slate-700 tracking-widest">{resCode} · rotating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalKey;
