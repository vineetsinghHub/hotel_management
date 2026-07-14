import { useMemo, useState } from "react";
import { toast } from "sonner";
import { guests } from "@aura/shared/admin/adminMockData";

const tagOpts = ["VIP", "Repeat", "Corporate", "Influencer", "Complaint", "Allergy"];
const tagColors = {
  VIP: "bg-brand-accent/15 text-[#8B6B1B]",
  Repeat: "bg-indigo-100 text-indigo-700",
  Corporate: "bg-slate-200 text-slate-700",
  Influencer: "bg-fuchsia-100 text-fuchsia-700",
  Complaint: "bg-rose-100 text-rose-700",
  Allergy: "bg-amber-100 text-amber-800",
};

const mockStays = [
  { id: "AH-9F27C1", suite: "Maharajah Suite", dates: "Nov 12 – 15, 2025", amount: 4460, rating: 5 },
  { id: "AH-7A19DE", suite: "Lake Pavilion", dates: "Mar 08 – 12, 2025", amount: 7920, rating: 5 },
  { id: "AH-4B02F7", suite: "Courtyard Grand", dates: "Dec 22 – 26, 2024", amount: 3960, rating: 4 },
];

const mockThread = [
  { id: "t1", from: "guest", channel: "whatsapp", text: "Can we get vegan breakfast options?", when: "Nov 05, 08:12" },
  { id: "t2", from: "staff", channel: "whatsapp", text: "Absolutely — chef has prepared a special menu.", when: "Nov 05, 08:22" },
  { id: "t3", from: "guest", channel: "email", text: "Loved the tanpura session in the courtyard.", when: "Nov 14, 22:30" },
];

const mockPrefs = [
  { key: "pillow", label: "Pillow", value: "Medium-firm feather" },
  { key: "news", label: "Newspaper", value: "Financial Times" },
  { key: "beverage", label: "Welcome drink", value: "Kokum sherbet, iced" },
  { key: "diet", label: "Dietary", value: "No shellfish; loves paneer" },
  { key: "temperature", label: "Room temp", value: "22°C" },
];

export const Guest360Modal = ({ guest, onClose }) => {
  const [tab, setTab] = useState("overview");
  const [tags, setTags] = useState(["VIP", "Repeat"]);
  const totalSpend = mockStays.reduce((s, x) => s + x.amount, 0);
  const toggleTag = (t) => { setTags((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]); toast.success(`Tag updated: ${t}`); };

  if (!guest) return null;
  const tabs = [
    { k: "overview", l: "Overview", i: "user" },
    { k: "stays", l: "Stays", i: "calendar" },
    { k: "prefs", l: "Preferences", i: "star" },
    { k: "messages", l: "Messages", i: "message" },
    { k: "loyalty", l: "Loyalty", i: "crown" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-stretch justify-end bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="guest-360">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-3xl h-full overflow-y-auto shadow-[0_-20px_50px_rgba(15,23,42,0.35)]">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <p className="font-serif text-lg text-slate-900">Guest profile</p>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="guest-360-close"><i className="fa-solid fa-xmark text-slate-500"></i></button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <img src={guest.avatar} alt={guest.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-[#C9A227]/20" />
            <div className="flex-1">
              <p className="text-eyebrow text-brand-accent">{guest.tier || "Aura Circle"}</p>
              <h2 className="mt-1 font-serif text-3xl text-slate-900">{guest.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{guest.email} · {guest.phone || "+91 98200 12345"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tagOpts.map((t) => (
                  <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full text-[11px] border transition-all ${tags.includes(t) ? tagColors[t] + " border-transparent" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`} data-testid={`g360-tag-${t.toLowerCase()}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="p-3 rounded-[12px] bg-brand-surface text-center">
                <p className="text-[10px] tracking-widest uppercase text-slate-400">Stays</p>
                <p className="font-mono text-xl text-slate-900">{mockStays.length}</p>
              </div>
              <div className="p-3 rounded-[12px] bg-brand-surface text-center">
                <p className="text-[10px] tracking-widest uppercase text-slate-400">Spend</p>
                <p className="font-mono text-xl text-slate-900">${(totalSpend / 1000).toFixed(1)}k</p>
              </div>
              <div className="p-3 rounded-[12px] bg-brand-surface text-center col-span-2 md:col-span-1">
                <p className="text-[10px] tracking-widest uppercase text-slate-400">Points</p>
                <p className="font-mono text-xl text-slate-900">18,240</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-b border-slate-100 flex gap-1 overflow-x-auto" role="tablist">
            {tabs.map((tb) => (
              <button key={tb.k} onClick={() => setTab(tb.k)} className={`px-4 py-2.5 text-sm border-b-2 transition-colors flex items-center gap-2 ${tab === tb.k ? "border-brand-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"}`} data-testid={`g360-tab-${tb.k}`} role="tab" aria-selected={tab === tb.k}>
                <i className={`fa-solid fa-${tb.i} text-xs`}></i>{tb.l}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[16px] bg-brand-surface"><p className="text-eyebrow text-slate-500">Home</p><p className="mt-1 text-slate-900">{guest.country || "Mumbai, India"}</p></div>
                <div className="p-4 rounded-[16px] bg-brand-surface"><p className="text-eyebrow text-slate-500">Last stay</p><p className="mt-1 text-slate-900">{mockStays[0].dates}</p></div>
                <div className="p-4 rounded-[16px] bg-brand-surface"><p className="text-eyebrow text-slate-500">Lifetime value</p><p className="mt-1 text-slate-900 font-mono">${totalSpend.toLocaleString()}</p></div>
                <div className="p-4 rounded-[16px] bg-brand-surface"><p className="text-eyebrow text-slate-500">Preferred channel</p><p className="mt-1 text-slate-900">WhatsApp</p></div>
              </div>
            )}
            {tab === "stays" && (
              <ul className="divide-y divide-slate-100 border border-slate-100 rounded-[16px] overflow-hidden" data-testid="g360-stays">
                {mockStays.map((s) => (
                  <li key={s.id} className="p-4 flex flex-wrap items-center gap-4">
                    <div className="min-w-32"><p className="text-[10px] font-mono tracking-widest uppercase text-slate-500">{s.id}</p><p className="text-slate-900">{s.suite}</p></div>
                    <div className="text-sm text-slate-600 flex-1">{s.dates}</div>
                    <div className="text-sm text-slate-900 font-mono">${s.amount.toLocaleString()}</div>
                    <div className="flex">{[1,2,3,4,5].map((n) => <i key={n} className={`fa-${n <= s.rating ? "solid" : "regular"} fa-star text-xs text-brand-accent`}></i>)}</div>
                  </li>
                ))}
              </ul>
            )}
            {tab === "prefs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="g360-prefs">
                {mockPrefs.map((p) => (
                  <div key={p.key} className="p-4 rounded-[16px] bg-brand-surface flex items-start justify-between">
                    <div><p className="text-eyebrow text-slate-500">{p.label}</p><p className="mt-1 text-slate-900 text-sm">{p.value}</p></div>
                    <button className="text-xs text-brand-primary hover:underline">Edit</button>
                  </div>
                ))}
              </div>
            )}
            {tab === "messages" && (
              <ul className="space-y-3" data-testid="g360-messages">
                {mockThread.map((m) => (
                  <li key={m.id} className={`flex ${m.from === "guest" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-md px-4 py-2.5 rounded-[16px] text-sm ${m.from === "guest" ? "bg-brand-surface text-slate-800 rounded-bl-[6px]" : "bg-brand-primary text-white rounded-br-[6px]"}`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === "guest" ? "text-slate-400" : "text-white/70"}`}>{m.channel} · {m.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {tab === "loyalty" && (
              <div className="p-5 rounded-[18px] bg-gradient-to-br from-brand-primary to-slate-900 text-white" data-testid="g360-loyalty">
                <p className="text-eyebrow text-brand-accent-hover">Aura Circle</p>
                <p className="mt-1 font-serif text-3xl">Platinum</p>
                <p className="text-sm text-white/70 mt-1">2,480 nights to Diamond tier</p>
                <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-2/3 bg-brand-accent-hover"></div></div>
                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  <li className="flex justify-between"><span>Points earned this year</span><span className="font-mono">4,120</span></li>
                  <li className="flex justify-between"><span>Points redeemed</span><span className="font-mono">1,880</span></li>
                  <li className="flex justify-between"><span>Anniversary</span><span>Dec 2019</span></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guest360Modal;
