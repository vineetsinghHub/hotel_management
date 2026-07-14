import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminQuickCreateModal from "@/admin/components/AdminQuickCreateModal";
import { getAdminUser } from "@/admin/adminAuth";
import { hasAccess } from "@/admin/roles";
import useTenantPath from "@/hooks/useTenantPath";
import {
  staffThreads as seedStaffThreads,
  getUnreadMessages,
  setUnreadMessages,
  subscribeUnreadMessages,
} from "@/admin/messagesStore";

const REMOVED_KEY = "aura_fab_removed_threads";
const readRemoved = () => { try { return JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]"); } catch (e) { return []; } };
const writeRemoved = (arr) => { try { localStorage.setItem(REMOVED_KEY, JSON.stringify(arr)); } catch (e) {} };

// Admin help / action bubble — floating in the bottom-right on admin pages.
// Tabs: Quick actions · Messages (staff chat) · Ask (AI-lite bot).
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
  { entity: "reservation", l: "New Reservation", i: "calendar-plus", route: "reservations" },
  { entity: "guest", l: "New Guest", i: "user-plus", route: "guests" },
  { entity: "staff", l: "New Staff", i: "id-badge", route: "staff" },
  { entity: "invoice", l: "New Invoice", i: "file-invoice-dollar", route: "invoices" },
];

const jumpLinks = [
  { to: "/admin/front-desk", key: "front-desk", l: "Front Desk", i: "concierge-bell" },
  { to: "/admin/housekeeping", key: "housekeeping", l: "Housekeeping", i: "broom" },
  { to: "/admin/reports", key: "reports", l: "Reports", i: "chart-line" },
  { to: "/admin/messages", key: "messages", l: "Messages", i: "comments" },
];

export const AdminFloatingActions = () => {
  const user = getAdminUser();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("actions");
  const [chat, setChat] = useState([{ id: "h1", from: "bot", text: "Hi — I'm your ops assistant. Ask me anything about the console." }]);
  const [text, setText] = useState("");
  const [quick, setQuick] = useState(null);
  const [threads, setThreads] = useState(() => {
    const removed = readRemoved();
    return seedStaffThreads.filter((t) => !removed.includes(t.id));
  });
  const [activeThreadId, setActiveThreadId] = useState(() => {
    const removed = readRemoved();
    const first = seedStaffThreads.find((t) => !removed.includes(t.id));
    return first?.id || null;
  });
  const [threadDraft, setThreadDraft] = useState("");
  const [unread, setUnreadState] = useState(getUnreadMessages());
  const nav = useNavigate();
  const t = useTenantPath();

  useEffect(() => {
    const off = subscribeUnreadMessages(setUnreadState);
    return () => off();
  }, []);

  // If opened directly to messages, clear per-thread as user reads.
  useEffect(() => {
    if (tab !== "messages") return;
    const active = threads.find((t) => t.id === activeThreadId);
    if (active && active.unread > 0) {
      const nextUnread = Math.max(0, unread - active.unread);
      setUnreadMessages(nextUnread);
      setThreads((s) => s.map((t) => t.id === activeThreadId ? { ...t, unread: 0 } : t));
    }
  }, [tab, activeThreadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleShortcuts = useMemo(() => user ? shortcuts.filter((s) => hasAccess(s.route, user.role)) : shortcuts, [user]);
  const visibleJumps = useMemo(() => user ? jumpLinks.filter((j) => hasAccess(j.key, user.role)) : jumpLinks, [user]);

  const send = (t) => {
    const q = (t || text).trim();
    if (!q) return;
    setChat((s) => [...s, { id: `m${Date.now()}`, from: "me", text: q }]);
    setText("");
    setTimeout(() => setChat((s) => [...s, { id: `m${Date.now() + 1}`, from: "bot", text: reply(q) }]), 500 + Math.random() * 400);
  };

  const sendThread = () => {
    const t = threadDraft.trim(); if (!t || !activeThreadId) return;
    setThreads((s) => s.map((th) => th.id === activeThreadId ? {
      ...th, updated: "just now",
      messages: [...th.messages, { id: Date.now(), from: "me", text: t, when: "now" }],
    } : th));
    setThreadDraft("");
    toast.success("Sent");
  };

  const removeThread = (id, e) => {
    if (e) e.stopPropagation();
    const removed = readRemoved();
    const next = Array.from(new Set([...removed, id]));
    writeRemoved(next);
    const target = threads.find((t) => t.id === id);
    // Deduct unread from the global counter if removed thread had unread items.
    if (target && target.unread > 0) setUnreadMessages(Math.max(0, unread - target.unread));
    const remaining = threads.filter((t) => t.id !== id);
    setThreads(remaining);
    if (activeThreadId === id) setActiveThreadId(remaining[0]?.id || null);
    toast.success(`${target?.name || "Thread"} removed`, {
      description: "You won't see this conversation in Quick messages.",
      action: {
        label: "Undo",
        onClick: () => {
          const rolledBack = readRemoved().filter((x) => x !== id);
          writeRemoved(rolledBack);
          setThreads((s) => [target, ...s]);
          if (target?.unread) setUnreadMessages(unread + target.unread);
        },
      },
    });
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-[55] w-14 h-14 rounded-full bg-[#4F46E5] text-white shadow-[0_12px_32px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all press-scale grid place-items-center print:hidden"
        aria-label="Open help & quick actions"
        data-testid="admin-fab"
      >
        <i className="fa-solid fa-wand-magic-sparkles text-lg" aria-hidden="true"></i>
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-mono grid place-items-center border-2 border-[#FAFAF8] animate-pulse"
            data-testid="admin-fab-unread-badge"
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-stretch sm:justify-end bg-slate-900/40 backdrop-blur-sm print:hidden" onClick={() => setOpen(false)} data-testid="admin-fab-panel">
          <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-white h-[85vh] sm:h-full rounded-t-[24px] sm:rounded-none flex flex-col shadow-[0_-20px_50px_rgba(15,23,42,0.25)]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#C9A227]/12 text-[#C9A227] grid place-items-center"><i className="fa-solid fa-wand-magic-sparkles"></i></span>
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-medium">Ops assistant</p>
                <p className="text-[11px] text-slate-500">Quick actions · staff messages · answers</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="admin-fab-close">
                <i className="fa-solid fa-xmark text-slate-500"></i>
              </button>
            </div>

            <div className="px-5 pt-3 flex gap-1">
              {[["actions", "Quick actions", null], ["messages", "Messages", unread], ["help", "Ask", null]].map(([k, l, b]) => (
                <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 relative ${tab === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`} data-testid={`fab-tab-${k}`}>
                  {l}
                  {b > 0 && <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{b}</span>}
                </button>
              ))}
            </div>

            {tab === "actions" && (
              <div className="p-5 space-y-2 overflow-y-auto">
                {visibleShortcuts.length === 0 && (
                  <p className="text-xs text-slate-400 py-6 text-center">No quick actions available for your role.</p>
                )}
                {visibleShortcuts.map((s) => (
                  <button key={s.entity} onClick={() => setQuick(s.entity)} className="w-full text-left p-4 rounded-[14px] bg-[#FAFAF8] hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 flex items-center gap-3 transition-all" data-testid={`fab-shortcut-${s.entity}`}>
                    <span className="w-9 h-9 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] grid place-items-center"><i className={`fa-solid fa-${s.i} text-sm`}></i></span>
                    <span className="flex-1 text-sm text-slate-900">{s.l}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                  </button>
                ))}
                {visibleJumps.length > 0 && (
                  <div className="pt-4">
                    <p className="text-eyebrow text-slate-500 mb-2">Jump to</p>
                    <div className="grid grid-cols-2 gap-2">
                      {visibleJumps.map((j) => (
                        <button key={j.to} onClick={() => { setOpen(false); nav(j.to); }} className="p-2.5 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-2" data-testid={`fab-jump-${j.to.split("/").pop()}`}>
                          <i className={`fa-solid fa-${j.i} text-[10px] text-[#C9A227]`}></i>{j.l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "messages" && (
              <div className="flex-1 flex flex-col overflow-hidden" data-testid="fab-messages">
                {/* Threads strip */}
                <div className="px-3 py-2 border-b border-slate-100 overflow-x-auto flex gap-2 flex-shrink-0" data-testid="fab-thread-strip">
                  {threads.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => setActiveThreadId(th.id)}
                      className={`group flex-shrink-0 flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full transition-all border cursor-pointer ${activeThreadId === th.id ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 hover:bg-white border-slate-200 text-slate-700"}`}
                      data-testid={`fab-thread-${th.id}`}
                    >
                      <span className="relative">
                        <img src={th.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        {th.online && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>}
                      </span>
                      <span className="text-[11px] max-w-[70px] truncate">{th.name.split(" ")[0]}</span>
                      {th.unread > 0 && <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{th.unread}</span>}
                      <button
                        onClick={(e) => removeThread(th.id, e)}
                        className={`w-5 h-5 rounded-full ${activeThreadId === th.id ? "bg-white/15 hover:bg-white/25" : "opacity-0 group-hover:opacity-100 bg-slate-200 hover:bg-slate-300"} grid place-items-center transition-opacity`}
                        aria-label={`Remove ${th.name} from list`}
                        data-testid={`fab-thread-remove-${th.id}`}
                        title="Remove from list"
                      >
                        <i className="fa-solid fa-xmark text-[9px]"></i>
                      </button>
                    </div>
                  ))}
                  {threads.length === 0 && (
                    <div className="px-3 py-3 text-[11px] text-slate-400 whitespace-nowrap" data-testid="fab-threads-empty">
                      No active threads. Removed threads still live in Message Center → Team.
                    </div>
                  )}
                </div>

                {/* Conversation */}
                {activeThread ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <img src={activeThread.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">{activeThread.name}</p>
                        <p className="text-[10px] text-slate-500">{activeThread.role} · {activeThread.online ? <span className="text-emerald-600">online</span> : <span>offline</span>}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-slate-50 grid place-items-center text-slate-500" aria-label="Voice call" data-testid={`fab-call-${activeThread.id}`}>
                        <i className="fa-solid fa-phone text-[11px]"></i>
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2" data-testid="fab-thread-body">
                      {activeThread.messages.map((m) => (
                        <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] px-3 py-2 rounded-[14px] text-sm ${m.from === "me" ? "bg-[#4F46E5] text-white rounded-br-[6px]" : "bg-[#FAFAF8] text-slate-800 rounded-bl-[6px]"}`}>
                            <p>{m.text}</p>
                            <p className={`text-[9px] mt-0.5 ${m.from === "me" ? "text-white/70" : "text-slate-400"}`}>{m.when}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                      <input
                        value={threadDraft}
                        onChange={(e) => setThreadDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendThread()}
                        placeholder={`Message ${activeThread.name.split(" ")[0]}…`}
                        className="flex-1 bg-[#FAFAF8] border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#4F46E5]"
                        data-testid="fab-thread-input"
                      />
                      <button onClick={sendThread} className="w-9 h-9 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white grid place-items-center" aria-label="Send" data-testid="fab-thread-send">
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => { setOpen(false); nav(t("admin/messages")); }}
                      className="mx-4 mb-3 text-[11px] text-[#4F46E5] hover:underline text-left"
                      data-testid="fab-open-message-center"
                    >
                      Open Message Center →
                    </button>
                  </>
                ) : (
                  <div className="flex-1 grid place-items-center text-sm text-slate-400">Select a colleague to chat</div>
                )}
              </div>
            )}

            {tab === "help" && (
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
