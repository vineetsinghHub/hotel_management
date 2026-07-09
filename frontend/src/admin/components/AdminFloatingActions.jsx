import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminQuickCreateModal from "@/admin/components/AdminQuickCreateModal";

// Admin help / action bubble — floating in the bottom-right on admin pages.
// Opens a small drawer with quick shortcuts, help topics and a scripted AI
// assistant.
const suggestions = [
  "How do I add a new guest?",
  "How to change a room status?",
  "Where do I run the night audit?",
  "How do I broadcast a message?",
  "Show me today's arrivals",
];

const answers = {
  add: "Click New → New Guest in the top bar, or press ⌘K then type \"New Guest\".",
  status: "Housekeeping → Floor plan. Click any room cell to cycle its status.",
  audit: "Reports → Night Audit tab. Click Print/PDF at the top-right.",
  broadcast: "Messages → top-right Broadcast button. Recipients are all in-house guests today.",
  arrivals: "Front Desk → Arrivals tab shows the day's arriving guests grouped by ETA.",
};
const reply = (t) => {
  const s = t.toLowerCase();
  if (/(add|create|new).*(guest|reservation|staff|invoice|event|menu|campaign)/.test(s)) return answers.add;
  if (/room.*status|clean|dirty/.test(s)) return answers.status;
  if (/night|audit|eod|end/.test(s)) return answers.audit;
  if (/broadcast|message|whatsapp|email/.test(s)) return answers.broadcast;
  if (/arrival|today/.test(s)) return answers.arrivals;
  return "I couldn't find a canned answer. Try the command palette (⌘K) to jump to a page.";
};

const shortcuts = [
  { entity: "reservation", l: "New Reservation", i: "calendar-plus" },
  { entity: "guest", l: "New Guest", i: "user-plus" },
  { entity: "staff", l: "New Staff", i: "id-badge" },
  { entity: "invoice", l: "New Invoice", i: "file-invoice-dollar" },
];

export const AdminFloatingActions = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("actions");
  const [chat, setChat] = useState([{ id: "h1", from: "bot", text: "Hi — I'm your ops assistant. Ask me anything about the console." }]);
  const [text, setText] = useState("");
  const [quick, setQuick] = useState(null);
  const nav = useNavigate();

  const send = (t) => {
    const q = (t || text).trim();
    if (!q) return;
    setChat((s) => [...s, { id: `m${Date.now()}`, from: "me", text: q }]);
    setText("");
    setTimeout(() => setChat((s) => [...s, { id: `m${Date.now() + 1}`, from: "bot", text: reply(q) }]), 500 + Math.random() * 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-[55] w-14 h-14 rounded-full bg-[#4F46E5] text-white shadow-[0_12px_32px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all press-scale grid place-items-center print:hidden"
        aria-label="Open help & quick actions"
        data-testid="admin-fab"
      >
        <i className="fa-solid fa-wand-magic-sparkles text-lg" aria-hidden="true"></i>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-stretch sm:justify-end bg-slate-900/40 backdrop-blur-sm print:hidden" onClick={() => setOpen(false)} data-testid="admin-fab-panel">
          <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-white h-[85vh] sm:h-full rounded-t-[24px] sm:rounded-none flex flex-col shadow-[0_-20px_50px_rgba(15,23,42,0.25)]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#C9A227]/12 text-[#C9A227] grid place-items-center"><i className="fa-solid fa-wand-magic-sparkles"></i></span>
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-medium">Ops assistant</p>
                <p className="text-[11px] text-slate-500">Quick actions · answers · shortcuts</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="admin-fab-close">
                <i className="fa-solid fa-xmark text-slate-500"></i>
              </button>
            </div>

            <div className="px-5 pt-3 flex gap-1">
              {[["actions", "Quick actions"], ["help", "Ask"]].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-full text-xs transition-all ${tab === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`} data-testid={`fab-tab-${k}`}>{l}</button>
              ))}
            </div>

            {tab === "actions" ? (
              <div className="p-5 space-y-2 overflow-y-auto">
                {shortcuts.map((s) => (
                  <button key={s.entity} onClick={() => setQuick(s.entity)} className="w-full text-left p-4 rounded-[14px] bg-[#FAFAF8] hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 flex items-center gap-3 transition-all" data-testid={`fab-shortcut-${s.entity}`}>
                    <span className="w-9 h-9 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] grid place-items-center"><i className={`fa-solid fa-${s.i} text-sm`}></i></span>
                    <span className="flex-1 text-sm text-slate-900">{s.l}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                  </button>
                ))}
                <div className="pt-4">
                  <p className="text-eyebrow text-slate-500 mb-2">Jump to</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["/admin/front-desk", "Front Desk", "concierge-bell"],
                      ["/admin/housekeeping", "Housekeeping", "broom"],
                      ["/admin/reports", "Reports", "chart-line"],
                      ["/admin/messages", "Messages", "comments"],
                    ].map(([to, l, i]) => (
                      <button key={to} onClick={() => { setOpen(false); nav(to); }} className="p-2.5 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-2" data-testid={`fab-jump-${to.split("/").pop()}`}>
                        <i className={`fa-solid fa-${i} text-[10px] text-[#C9A227]`}></i>{l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="fab-chat">
                  {chat.map((m) => (
                    <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-[14px] text-sm ${m.from === "me" ? "bg-[#4F46E5] text-white rounded-br-[6px]" : "bg-[#FAFAF8] text-slate-800 rounded-bl-[6px]"}`}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-[10px] tracking-widest uppercase text-slate-400 mb-2">Suggested</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => send(s)} className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700">{s}</button>
                    ))}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 mt-2">
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question…" className="flex-1 bg-[#FAFAF8] border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#4F46E5]" data-testid="fab-input" />
                    <button type="submit" className="w-9 h-9 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white grid place-items-center" aria-label="Send" data-testid="fab-send"><i className="fa-solid fa-paper-plane text-xs"></i></button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {quick && <AdminQuickCreateModal entity={quick} onClose={() => setQuick(null)} />}
    </>
  );
};

export default AdminFloatingActions;
