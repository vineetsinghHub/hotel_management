import { useState, useMemo } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { guests as adminGuests } from "@/admin/adminMockData";
import { toast } from "sonner";

const templates = [
  { id: "tpl-arrival", name: "Pre-arrival welcome", body: "Dear {{name}},\n\nWe look forward to welcoming you to Aura on {{arrival}}. Anything special we can prepare?", tag: "Arrival" },
  { id: "tpl-thanks", name: "Thank-you post-stay", body: "Dear {{name}},\n\nThank you for staying with us. We hope to welcome you back soon.", tag: "Departure" },
  { id: "tpl-upgrade", name: "Suite upgrade offer", body: "Dear {{name}},\n\nOn your next stay, enjoy a complimentary upgrade to a signature suite.", tag: "Marketing" },
];

const channels = [
  { k: "email", i: "envelope" },
  { k: "sms", i: "mobile-screen" },
  { k: "whatsapp", i: "whatsapp", brand: true },
];

const seedThreads = (list) => list.slice(0, 12).map((g, i) => ({
  id: `th-${g.id}`, guest: g, unread: (i % 3 === 0) ? 1 : 0, updated: `${(i % 8) + 1}m ago`, channel: channels[i % 3].k,
  messages: [
    { id: 1, from: "guest", text: i % 2 === 0 ? "Hi — could we get a late checkout?" : "Thank you for the wonderful stay!", when: "Today, 09:24" },
    { id: 2, from: "staff", text: i % 2 === 0 ? "Absolutely. We've extended to 2pm complimentary." : "You're most welcome. Do come back soon.", when: "Today, 09:32" },
  ],
}));

export default function MessageCenter() {
  const [threads, setThreads] = useState(() => seedThreads(adminGuests));
  const [activeId, setActiveId] = useState(() => (adminGuests[0] ? `th-${adminGuests[0].id}` : null));
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const [channel, setChannel] = useState("email");
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const filtered = useMemo(() => threads.filter((t) => t.guest.name.toLowerCase().includes(q.toLowerCase())), [threads, q]);
  const active = threads.find((t) => t.id === activeId);

  const send = () => {
    if (!draft.trim() || !active) return;
    setThreads((s) => s.map((t) => t.id === activeId ? {
      ...t, unread: 0, updated: "just now",
      messages: [...t.messages, { id: Date.now(), from: "staff", text: draft.trim(), when: "Today, now" }],
    } : t));
    setDraft("");
    toast.success(`Sent via ${channel}`);
  };

  const applyTemplate = (tpl) => setDraft(tpl.body.replace("{{name}}", active?.guest?.name || "guest").replace("{{arrival}}", "tomorrow"));

  return (
    <AdminLayout pageTitle="Messages">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Guest communications</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Message Center</h2>
        </div>
        <button onClick={() => setBroadcastOpen(true)} className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="broadcast-open">
          <i className="fa-solid fa-bullhorn mr-1.5 text-[11px]"></i>Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-3 h-[calc(100vh-220px)] min-h-[520px]" data-testid="message-center">
        {/* Threads */}
        <aside className="bg-white rounded-[16px] border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search threads…" className="w-full bg-[#FAFAF8] border border-transparent rounded-full px-4 py-2 text-sm outline-none focus:border-slate-200" data-testid="msg-search" />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.map((t) => (
              <li key={t.id}>
                <button onClick={() => setActiveId(t.id)} className={`w-full text-left px-4 py-3 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 ${activeId === t.id ? "bg-indigo-50/40" : ""}`} data-testid={`thread-${t.id}`}>
                  <div className="w-9 h-9 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] grid place-items-center text-xs font-mono">{t.guest.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{t.guest.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{t.messages[t.messages.length-1].text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {t.unread > 0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">{t.unread}</span>}
                    <span className="text-[9px] text-slate-400">{t.updated}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conversation */}
        <section className="bg-white rounded-[16px] border border-slate-200 flex flex-col" data-testid="msg-thread">
          {active ? (
            <>
              <header className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div><p className="text-sm text-slate-900 font-medium">{active.guest.name}</p><p className="text-[10px] text-slate-500">{active.guest.email}</p></div>
                <div className="flex items-center gap-1">{channels.map((c) => (
                  <button key={c.k} onClick={() => setChannel(c.k)} className={`w-8 h-8 rounded-full grid place-items-center ${channel === c.k ? "bg-[#4F46E5] text-white" : "text-slate-500 hover:bg-slate-50"}`} data-testid={`channel-${c.k}`} aria-label={c.k}><i className={`fa-${c.brand ? "brands" : "solid"} fa-${c.i} text-xs`}></i></button>
                ))}</div>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "staff" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-[16px] text-sm ${m.from === "staff" ? "bg-[#4F46E5] text-white rounded-br-[6px]" : "bg-[#FAFAF8] text-slate-800 rounded-bl-[6px]"}`}>
                      <p>{m.text}</p><p className={`text-[10px] mt-1 ${m.from === "staff" ? "text-white/70" : "text-slate-400"}`}>{m.when}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Write a reply…" className="flex-1 bg-[#FAFAF8] border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#4F46E5]" data-testid="msg-input" />
                <button onClick={send} className="w-10 h-10 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white grid place-items-center" aria-label="Send" data-testid="msg-send"><i className="fa-solid fa-paper-plane text-xs"></i></button>
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-slate-400">Select a conversation</div>
          )}
        </section>

        {/* Right — guest info + templates */}
        <aside className="bg-white rounded-[16px] border border-slate-200 p-4 overflow-y-auto">
          <p className="text-eyebrow text-[#C9A227]">Guest</p>
          {active ? (
            <>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 grid place-items-center text-slate-700 font-mono">{active.guest.name[0]}</div>
                <div><p className="text-sm text-slate-900">{active.guest.name}</p><p className="text-[10px] text-slate-500">{active.guest.email}</p></div>
              </div>
              <ul className="mt-4 text-xs text-slate-600 space-y-1">
                <li className="flex justify-between"><span>Tier</span><span className="text-slate-900">{active.guest.tier}</span></li>
                <li className="flex justify-between"><span>Stays</span><span className="text-slate-900 font-mono">{active.guest.stays}</span></li>
                <li className="flex justify-between"><span>Last stay</span><span className="text-slate-900">{active.guest.lastStay}</span></li>
              </ul>
            </>
          ) : null}
          <p className="text-eyebrow text-slate-500 mt-6">Templates</p>
          <div className="mt-2 space-y-2">
            {templates.map((t) => (
              <button key={t.id} onClick={() => applyTemplate(t)} className="w-full text-left p-3 rounded-[10px] border border-slate-100 hover:border-[#4F46E5] hover:bg-indigo-50/30 transition-colors" data-testid={`template-${t.id}`}>
                <div className="flex items-center gap-2"><p className="text-sm text-slate-900 flex-1">{t.name}</p><span className="text-[9px] tracking-widest uppercase text-slate-400">{t.tag}</span></div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.body.slice(0, 60)}…</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {broadcastOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBroadcastOpen(false)} data-testid="broadcast-modal">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[20px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <p className="text-eyebrow text-[#C9A227]">Broadcast</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">To all in-house guests</h3>
            <p className="text-sm text-slate-500 mt-2">Sent to <span className="font-mono text-slate-900">{Math.min(24, threads.length)}</span> guests currently checked in.</p>
            <textarea rows={5} placeholder="Your message…" className="mt-4 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="broadcast-text" />
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setBroadcastOpen(false)} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={() => { toast.success("Broadcast sent to 24 guests"); setBroadcastOpen(false); }} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="broadcast-send">Send</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
