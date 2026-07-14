import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import { guests as adminGuests } from "@aura/shared/admin/adminMockData";
import { toast } from "sonner";
import { useTier } from "@aura/shared/admin/tier";
import TierGate, { ProBadge } from "@aura/b2b-pms/admin/components/TierGate";
import {
  staffThreads as seedStaffThreads,
  getUnreadMessages,
  setUnreadMessages,
  subscribeUnreadMessages,
} from "@aura/shared/admin/messagesStore";

const templates = [
  { id: "tpl-arrival", name: "Pre-arrival welcome", body: "Dear {{name}},\n\nWe look forward to welcoming you to Aura on {{arrival}}. Anything special we can prepare?", tag: "Arrival" },
  { id: "tpl-thanks", name: "Thank-you post-stay", body: "Dear {{name}},\n\nThank you for staying with us. We hope to welcome you back soon.", tag: "Departure" },
  { id: "tpl-upgrade", name: "Suite upgrade offer", body: "Dear {{name}},\n\nOn your next stay, enjoy a complimentary upgrade to a signature suite.", tag: "Marketing" },
];

const teamTemplates = [
  { id: "team-shift", name: "Shift handover", body: "Handing over — 3 arrivals still pending, room 401 needs housekeeping follow-up. Full brief in the shift log.", tag: "Ops" },
  { id: "team-vip", name: "VIP arrival brief", body: "Heads up — VIP arriving at {{arrival}}. Standard welcome amenities, please brief the butler team.", tag: "VIP" },
];

const allChannels = [
  { k: "email", i: "envelope", pro: false },
  { k: "sms", i: "mobile-screen", pro: false },
  { k: "whatsapp", i: "whatsapp", brand: true, pro: true },
];

const seedGuestThreads = (list) => list.slice(0, 12).map((g, i) => ({
  id: `th-${g.id}`, guest: g, unread: (i % 3 === 0) ? 1 : 0, updated: `${(i % 8) + 1}m ago`, channel: allChannels[i % 3].k,
  messages: [
    { id: 1, from: "guest", text: i % 2 === 0 ? "Hi — could we get a late checkout?" : "Thank you for the wonderful stay!", when: "Today, 09:24" },
    { id: 2, from: "staff", text: i % 2 === 0 ? "Absolutely. We've extended to 2pm complimentary." : "You're most welcome. Do come back soon.", when: "Today, 09:32" },
  ],
}));

const REMOVED_KEY = "aura_msg_removed_threads";
const readRemoved = () => { try { return JSON.parse(localStorage.getItem(REMOVED_KEY) || "{}"); } catch (e) { return {}; } };
const writeRemoved = (obj) => { try { localStorage.setItem(REMOVED_KEY, JSON.stringify(obj)); } catch (e) {} };

export default function MessageCenter() {
  const [segment, setSegment] = useState("guests"); // "guests" | "team"
  const [removed, setRemoved] = useState(readRemoved());
  const [guestThreads, setGuestThreads] = useState(() => seedGuestThreads(adminGuests));
  const [teamThreads, setTeamThreads] = useState(seedStaffThreads);
  const [activeGuestId, setActiveGuestId] = useState(() => (adminGuests[0] ? `th-${adminGuests[0].id}` : null));
  const [activeTeamId, setActiveTeamId] = useState(seedStaffThreads[0]?.id || null);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const [channel, setChannel] = useState("email");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [teamUnread, setTeamUnread] = useState(getUnreadMessages());
  const { isPro } = useTier();
  const channels = allChannels.filter((c) => isPro || !c.pro);

  useEffect(() => subscribeUnreadMessages(setTeamUnread), []);

  // Filter out removed threads per segment.
  const visibleGuests = useMemo(
    () => guestThreads.filter((t) => !(removed.guests || []).includes(t.id) && t.guest.name.toLowerCase().includes(q.toLowerCase())),
    [guestThreads, q, removed]
  );
  const visibleTeam = useMemo(
    () => teamThreads.filter((t) => !(removed.team || []).includes(t.id) && t.name.toLowerCase().includes(q.toLowerCase())),
    [teamThreads, q, removed]
  );

  const activeGuest = guestThreads.find((t) => t.id === activeGuestId);
  const activeTeam = teamThreads.find((t) => t.id === activeTeamId);

  const guestUnreadCount = guestThreads.filter((t) => t.unread > 0).reduce((s, t) => s + t.unread, 0);

  const sendGuest = () => {
    if (!draft.trim() || !activeGuest) return;
    setGuestThreads((s) => s.map((t) => t.id === activeGuestId ? {
      ...t, unread: 0, updated: "just now",
      messages: [...t.messages, { id: Date.now(), from: "staff", text: draft.trim(), when: "Today, now" }],
    } : t));
    setDraft("");
    toast.success(`Sent via ${channel}`);
  };

  const sendTeam = () => {
    if (!draft.trim() || !activeTeam) return;
    setTeamThreads((s) => s.map((t) => t.id === activeTeamId ? {
      ...t, unread: 0, updated: "just now",
      messages: [...t.messages, { id: Date.now(), from: "me", text: draft.trim(), when: "now" }],
    } : t));
    setDraft("");
    toast.success("Sent to team");
  };

  const send = () => (segment === "guests" ? sendGuest() : sendTeam());

  const applyTemplate = (tpl) => {
    if (segment === "guests") {
      setDraft(tpl.body.replace("{{name}}", activeGuest?.guest?.name || "guest").replace("{{arrival}}", "tomorrow"));
    } else {
      setDraft(tpl.body.replace("{{arrival}}", "16:00"));
    }
  };

  const removeThread = (segmentKey, id, name) => {
    const nextRemoved = {
      ...removed,
      [segmentKey]: Array.from(new Set([...(removed[segmentKey] || []), id])),
    };
    setRemoved(nextRemoved);
    writeRemoved(nextRemoved);
    // Advance selection if we removed the current one.
    if (segmentKey === "guests" && activeGuestId === id) {
      const next = guestThreads.find((t) => t.id !== id && !(nextRemoved.guests || []).includes(t.id));
      setActiveGuestId(next?.id || null);
    }
    if (segmentKey === "team" && activeTeamId === id) {
      const next = teamThreads.find((t) => t.id !== id && !(nextRemoved.team || []).includes(t.id));
      setActiveTeamId(next?.id || null);
    }
    toast.success(`${name} removed from list`, {
      description: "Undo brings the conversation back.",
      action: {
        label: "Undo",
        onClick: () => {
          const rolledBack = { ...nextRemoved, [segmentKey]: (nextRemoved[segmentKey] || []).filter((x) => x !== id) };
          setRemoved(rolledBack);
          writeRemoved(rolledBack);
        },
      },
    });
  };

  const activeChannels = channels; // both segments show channel picker (team defaults to internal)

  return (
    <AdminLayout pageTitle="Messages">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <p className="text-eyebrow text-brand-accent">Communications</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Message Center</h2>
        </div>
        {/* Segment switcher: Guests / Team */}
        <div className="inline-flex items-center bg-slate-100 rounded-full p-1" data-testid="msg-segment-switcher">
          <button
            onClick={() => { setSegment("guests"); setDraft(""); }}
            className={`px-4 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all ${segment === "guests" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
            data-testid="msg-segment-guests"
          >
            <i className="fa-solid fa-user text-[10px]"></i>Guests
            {guestUnreadCount > 0 && <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{guestUnreadCount}</span>}
          </button>
          <button
            onClick={() => { setSegment("team"); setDraft(""); }}
            className={`px-4 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all ${segment === "team" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
            data-testid="msg-segment-team"
          >
            <i className="fa-solid fa-users text-[10px]"></i>Team
            {teamUnread > 0 && <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{teamUnread}</span>}
          </button>
        </div>
        <button onClick={() => setBroadcastOpen(true)} className="px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)] flex items-center gap-1.5" data-testid="broadcast-open">
          <i className="fa-solid fa-bullhorn text-[11px]"></i>Broadcast
          {!isPro && <ProBadge className="ml-1" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-3 h-[calc(100vh-240px)] min-h-[520px]" data-testid="message-center">
        {/* Threads */}
        <aside className="bg-white rounded-[16px] border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${segment === "guests" ? "guest" : "team"} threads…`} className="w-full bg-brand-surface border border-transparent rounded-full px-4 py-2 text-sm outline-none focus:border-slate-200" data-testid="msg-search" />
          </div>
          <ul className="flex-1 overflow-y-auto" data-testid={`msg-thread-list-${segment}`}>
            {segment === "guests" && visibleGuests.map((t) => (
              <li key={t.id} className="group relative">
                <button onClick={() => setActiveGuestId(t.id)} className={`w-full text-left px-4 py-3 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 ${activeGuestId === t.id ? "bg-indigo-50/40" : ""}`} data-testid={`thread-${t.id}`}>
                  <div className="w-9 h-9 rounded-full bg-brand-primary/15 text-brand-primary grid place-items-center text-xs font-mono">{t.guest.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{t.guest.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{t.messages[t.messages.length - 1].text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 pr-6">
                    {t.unread > 0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">{t.unread}</span>}
                    <span className="text-[9px] text-slate-400">{t.updated}</span>
                  </div>
                </button>
                <button
                  onClick={() => removeThread("guests", t.id, t.guest.name)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity"
                  aria-label={`Remove ${t.guest.name}`}
                  data-testid={`thread-remove-${t.id}`}
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </li>
            ))}
            {segment === "team" && visibleTeam.map((t) => (
              <li key={t.id} className="group relative">
                <button onClick={() => setActiveTeamId(t.id)} className={`w-full text-left px-4 py-3 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 ${activeTeamId === t.id ? "bg-indigo-50/40" : ""}`} data-testid={`team-thread-${t.id}`}>
                  <div className="relative">
                    <img src={t.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    {t.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{t.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{t.role} · {t.messages[t.messages.length - 1].text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 pr-6">
                    {t.unread > 0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">{t.unread}</span>}
                    <span className="text-[9px] text-slate-400">{t.updated}</span>
                  </div>
                </button>
                <button
                  onClick={() => removeThread("team", t.id, t.name)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity"
                  aria-label={`Remove ${t.name}`}
                  data-testid={`team-thread-remove-${t.id}`}
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </li>
            ))}
            {(segment === "guests" ? visibleGuests : visibleTeam).length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-slate-400" data-testid={`msg-${segment}-empty`}>
                {q ? `No ${segment} threads match “${q}”.` : `No ${segment} conversations yet.`}
              </li>
            )}
          </ul>
        </aside>

        {/* Conversation */}
        <section className="bg-white rounded-[16px] border border-slate-200 flex flex-col" data-testid="msg-thread">
          {segment === "guests" && activeGuest ? (
            <>
              <header className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-900 font-medium">{activeGuest.guest.name}</p>
                  <p className="text-[10px] text-slate-500">{activeGuest.guest.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  {activeChannels.map((c) => (
                    <button key={c.k} onClick={() => setChannel(c.k)} className={`w-8 h-8 rounded-full grid place-items-center ${channel === c.k ? "bg-brand-primary text-white" : "text-slate-500 hover:bg-slate-50"}`} data-testid={`channel-${c.k}`} aria-label={c.k}>
                      <i className={`fa-${c.brand ? "brands" : "solid"} fa-${c.i} text-xs`}></i>
                    </button>
                  ))}
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeGuest.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "staff" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-[16px] text-sm ${m.from === "staff" ? "bg-brand-primary text-white rounded-br-[6px]" : "bg-brand-surface text-slate-800 rounded-bl-[6px]"}`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === "staff" ? "text-white/70" : "text-slate-400"}`}>{m.when}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Write a reply…" className="flex-1 bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-primary" data-testid="msg-input" />
                <button onClick={send} className="w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white grid place-items-center" aria-label="Send" data-testid="msg-send"><i className="fa-solid fa-paper-plane text-xs"></i></button>
              </div>
            </>
          ) : segment === "team" && activeTeam ? (
            <>
              <header className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                <img src={activeTeam.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">{activeTeam.name}</p>
                  <p className="text-[10px] text-slate-500">{activeTeam.role} · {activeTeam.online ? <span className="text-emerald-600">online</span> : "offline"}</p>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-slate-50 grid place-items-center text-slate-500" aria-label="Voice call" data-testid={`team-call-${activeTeam.id}`}>
                  <i className="fa-solid fa-phone text-[11px]"></i>
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="team-thread-body">
                {activeTeam.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-[16px] text-sm ${m.from === "me" ? "bg-slate-900 text-white rounded-br-[6px]" : "bg-brand-surface text-slate-800 rounded-bl-[6px]"}`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-slate-400"}`}>{m.when}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Message ${activeTeam.name.split(" ")[0]}…`} className="flex-1 bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-slate-900" data-testid="team-msg-input" />
                <button onClick={send} className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white grid place-items-center" aria-label="Send" data-testid="team-msg-send"><i className="fa-solid fa-paper-plane text-xs"></i></button>
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-slate-400">Select a conversation</div>
          )}
        </section>

        {/* Right — info + templates */}
        <aside className="bg-white rounded-[16px] border border-slate-200 p-4 overflow-y-auto">
          {segment === "guests" && activeGuest && (
            <>
              <p className="text-eyebrow text-brand-accent">Guest</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 grid place-items-center text-slate-700 font-mono">{activeGuest.guest.name[0]}</div>
                <div>
                  <p className="text-sm text-slate-900">{activeGuest.guest.name}</p>
                  <p className="text-[10px] text-slate-500">{activeGuest.guest.email}</p>
                </div>
              </div>
              <ul className="mt-4 text-xs text-slate-600 space-y-1">
                <li className="flex justify-between"><span>Tier</span><span className="text-slate-900">{activeGuest.guest.tier}</span></li>
                <li className="flex justify-between"><span>Stays</span><span className="text-slate-900 font-mono">{activeGuest.guest.stays}</span></li>
                <li className="flex justify-between"><span>Last stay</span><span className="text-slate-900">{activeGuest.guest.lastStay}</span></li>
              </ul>
              <p className="text-eyebrow text-slate-500 mt-6">Guest templates</p>
              <div className="mt-2 space-y-2">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => applyTemplate(t)} className="w-full text-left p-3 rounded-[10px] border border-slate-100 hover:border-brand-primary hover:bg-indigo-50/30 transition-colors" data-testid={`template-${t.id}`}>
                    <div className="flex items-center gap-2"><p className="text-sm text-slate-900 flex-1">{t.name}</p><span className="text-[9px] tracking-widest uppercase text-slate-400">{t.tag}</span></div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.body.slice(0, 60)}…</p>
                  </button>
                ))}
              </div>
            </>
          )}
          {segment === "team" && activeTeam && (
            <>
              <p className="text-eyebrow text-brand-accent">Colleague</p>
              <div className="mt-2 flex items-center gap-3">
                <img src={activeTeam.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-slate-900">{activeTeam.name}</p>
                  <p className="text-[10px] text-slate-500">{activeTeam.role}</p>
                </div>
              </div>
              <ul className="mt-4 text-xs text-slate-600 space-y-1">
                <li className="flex justify-between"><span>Status</span><span className={activeTeam.online ? "text-emerald-600" : "text-slate-500"}>{activeTeam.online ? "Online" : "Offline"}</span></li>
                <li className="flex justify-between"><span>Last seen</span><span className="text-slate-900">{activeTeam.updated}</span></li>
                <li className="flex justify-between"><span>Unread</span><span className="text-slate-900 font-mono">{activeTeam.unread || 0}</span></li>
              </ul>
              <p className="text-eyebrow text-slate-500 mt-6">Team templates</p>
              <div className="mt-2 space-y-2">
                {teamTemplates.map((t) => (
                  <button key={t.id} onClick={() => applyTemplate(t)} className="w-full text-left p-3 rounded-[10px] border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-colors" data-testid={`team-template-${t.id}`}>
                    <div className="flex items-center gap-2"><p className="text-sm text-slate-900 flex-1">{t.name}</p><span className="text-[9px] tracking-widest uppercase text-slate-400">{t.tag}</span></div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.body.slice(0, 70)}…</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      {broadcastOpen && !isPro && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBroadcastOpen(false)} data-testid="broadcast-locked">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[24px]">
            <button
              onClick={() => setBroadcastOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 grid place-items-center shadow-[0_4px_16px_rgba(15,23,42,0.15)] transition-all"
              aria-label="Close"
              data-testid="broadcast-locked-close"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <TierGate routeKey="messages" inline compact onUpgrade={() => setBroadcastOpen(false)} />
          </div>
        </div>
      )}

      {broadcastOpen && isPro && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBroadcastOpen(false)} data-testid="broadcast-modal">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[20px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <p className="text-eyebrow text-brand-accent">Broadcast</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">To all in-house guests</h3>
            <p className="text-sm text-slate-500 mt-2">Sent to <span className="font-mono text-slate-900">{Math.min(24, guestThreads.length)}</span> guests currently checked in.</p>
            <textarea rows={5} placeholder="Your message…" className="mt-4 w-full bg-brand-surface border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary" data-testid="broadcast-text" />
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setBroadcastOpen(false)} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={() => { toast.success("Broadcast sent to 24 guests"); setBroadcastOpen(false); }} className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="broadcast-send">Send</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
