import { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import { otaChannels, rateCategories, statusColor } from "@aura/shared/admin/adminMockData";

const DAYS = 14;

// Build a rate map keyed by `${categoryId}:${YYYY-MM-DD}` — seed with base + weekend surge + weekday variance
const seedRateMap = (start) => {
  const map = {};
  rateCategories.forEach((cat) => {
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const dow = d.getDay();
      const isWeekend = dow === 0 || dow === 6;
      const surge = isWeekend ? 1.35 : 1;
      const jitter = 1 + ((i * 7 + cat.baseRate) % 5) / 100;
      const key = `${cat.id}:${d.toISOString().slice(0, 10)}`;
      map[key] = Math.round(cat.baseRate * surge * jitter / 100) * 100;
    }
  });
  return map;
};

export default function RateChannel() {
  const [tab, setTab] = useState("connections"); // "connections" | "rates"
  const [channels, setChannels] = useState(otaChannels);
  const [openChannel, setOpenChannel] = useState(null);
  const [anchor, setAnchor] = useState(new Date(2026, 2, 15));
  const [rateMap, setRateMap] = useState(() => seedRateMap(new Date(2026, 2, 15)));
  const [editing, setEditing] = useState(null); // { catId, dateKey, value }
  const [selection, setSelection] = useState(null); // range selection: { catId, from, to }
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkValue, setBulkValue] = useState("");

  const dates = useMemo(() => Array.from({ length: DAYS }).map((_, i) => new Date(anchor.getTime() + i * 86400000)), [anchor]);
  const monthLabel = anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const shiftAnchor = (days) => {
    const next = new Date(anchor.getTime() + days * 86400000);
    setAnchor(next);
    setRateMap((prev) => ({ ...prev, ...seedRateMap(next) }));
  };

  const connCount = channels.filter((c) => c.status === "connected").length;
  const errorCount = channels.filter((c) => c.status === "sync_error").length;

  const toggleChannel = (id) => {
    setChannels((s) => s.map((c) => c.id === id ? {
      ...c,
      status: c.status === "connected" ? "unlinked" : c.status === "unlinked" ? "connected" : "connected",
      lastSync: "Just now",
    } : c));
    const ch = channels.find((c) => c.id === id);
    toast.success(`${ch?.name} ${ch?.status === "connected" ? "disconnected" : "connected"}`);
  };

  const syncChannel = (id) => {
    setChannels((s) => s.map((c) => c.id === id ? { ...c, status: "connected", lastSync: "Just now" } : c));
    toast.success("Sync complete", { description: "Rates and availability pushed." });
  };

  const commitEdit = (catId, dateKey, value) => {
    const parsed = parseInt(String(value).replace(/[^\d]/g, ""), 10);
    if (!parsed || parsed <= 0) { toast.error("Enter a valid rate"); return; }
    setRateMap((s) => ({ ...s, [`${catId}:${dateKey}`]: parsed }));
    setEditing(null);
    toast.success(`Rate updated · ₹${parsed.toLocaleString()}`);
  };

  const applyBulk = () => {
    const parsed = parseInt(String(bulkValue).replace(/[^\d]/g, ""), 10);
    if (!parsed || !selection) { toast.error("Enter a valid rate"); return; }
    const { catId, from, to } = selection;
    const start = Math.min(from, to); const end = Math.max(from, to);
    setRateMap((prev) => {
      const next = { ...prev };
      for (let i = start; i <= end; i++) {
        const d = dates[i]; if (!d) continue;
        next[`${catId}:${d.toISOString().slice(0, 10)}`] = parsed;
      }
      return next;
    });
    toast.success(`${end - start + 1} nights updated · ₹${parsed.toLocaleString()}`, { description: "Ready to push to channels" });
    setBulkOpen(false); setBulkValue(""); setSelection(null);
  };

  const pushAll = () => {
    setChannels((s) => s.map((c) => c.status === "sync_error" ? { ...c, status: "connected", lastSync: "Just now" } : c.status === "connected" ? { ...c, lastSync: "Just now" } : c));
    toast.success("Rates pushed to all channels", { description: `${connCount} channels updated · ${DAYS} days · ${rateCategories.length} categories` });
  };

  return (
    <AdminLayout pageTitle="Rate & Channel Manager">
      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 mb-6 overflow-x-auto">
        <button onClick={() => setTab("connections")} className={`px-4 py-3 text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${tab === "connections" ? "border-brand-primary text-slate-900 font-medium" : "border-transparent text-slate-500 hover:text-slate-800"}`} data-testid="rc-tab-connections">
          <i className="fa-solid fa-link text-[11px]"></i>OTA Connections
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${tab === "connections" ? "bg-brand-accent/15 text-brand-accent" : "bg-slate-100 text-slate-500"}`}>{connCount}</span>
          {errorCount > 0 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">{errorCount}</span>}
        </button>
        <button onClick={() => setTab("rates")} className={`px-4 py-3 text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${tab === "rates" ? "border-brand-primary text-slate-900 font-medium" : "border-transparent text-slate-500 hover:text-slate-800"}`} data-testid="rc-tab-rates">
          <i className="fa-solid fa-calendar-days text-[11px]"></i>Master Rate Calendar
        </button>
      </div>

      {tab === "connections" && (
        <ConnectionsTab channels={channels} onOpen={setOpenChannel} onToggle={toggleChannel} onSync={syncChannel} />
      )}

      {tab === "rates" && (
        <RatesCalendar
          dates={dates} monthLabel={monthLabel}
          rateMap={rateMap} editing={editing} setEditing={setEditing}
          commitEdit={commitEdit}
          selection={selection} setSelection={setSelection}
          onShift={shiftAnchor}
          onBulk={() => setBulkOpen(true)}
          onPush={pushAll}
          connCount={connCount}
        />
      )}

      {openChannel && (
        <ChannelDrawer channel={openChannel} onClose={() => setOpenChannel(null)} />
      )}

      {bulkOpen && selection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" data-testid="bulk-rate-modal">
          <div className="bg-white w-full max-w-md rounded-[20px] p-8 relative">
            <button onClick={() => setBulkOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
            <p className="text-eyebrow text-brand-accent">Bulk edit</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">Set rate for range</h3>
            <p className="mt-2 text-sm text-slate-500">
              {rateCategories.find((c) => c.id === selection.catId)?.label} ·{" "}
              {Math.abs(selection.to - selection.from) + 1} nights ({dates[Math.min(selection.from, selection.to)]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} → {dates[Math.max(selection.from, selection.to)]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
            </p>
            <div className="mt-5">
              <label className="text-eyebrow text-slate-500">Rate (₹)</label>
              <input autoFocus value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder="e.g. 32000" className="mt-2 w-full bg-brand-surface border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary font-mono" data-testid="bulk-rate-input" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setBulkOpen(false)} className="px-5 py-2.5 rounded-full border border-slate-200 text-sm">Cancel</button>
              <button onClick={applyBulk} className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm" data-testid="bulk-rate-apply">Push to all channels</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const ConnectionsTab = ({ channels, onOpen, onToggle, onSync }) => (
  <div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { l: "Connected", v: channels.filter((c) => c.status === "connected").length, c: "#10B981" },
        { l: "Sync errors", v: channels.filter((c) => c.status === "sync_error").length, c: "#F43F5E" },
        { l: "Unlinked", v: channels.filter((c) => c.status === "unlinked").length, c: "#64748B" },
        { l: "Avg. commission", v: `${Math.round(channels.filter((c) => c.status === "connected").reduce((s, c) => s + c.commission, 0) / Math.max(1, channels.filter((c) => c.status === "connected").length))}%`, c: "#C9A227" },
      ].map((k) => (
        <div key={k.l} className="p-4 bg-white rounded-[14px] border border-slate-200">
          <p className="text-[10px] tracking-widest uppercase text-slate-500">{k.l}</p>
          <p className="mt-2 font-mono text-3xl" style={{ color: k.c }}>{k.v}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {channels.map((c) => {
        const st = statusColor(c.status);
        return (
          <div key={c.id} className="bg-white rounded-[18px] border border-slate-200 p-6 flex flex-col" data-testid={`channel-card-${c.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[12px] grid place-items-center text-white font-serif text-xl" style={{ backgroundColor: c.color }}>{c.logo}</div>
                <div>
                  <p className="font-serif text-lg text-slate-900">{c.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{c.commission}% commission</p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed flex-1">{c.desc}</p>
            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-slate-100">
              <span>Mapped: <span className="font-mono text-slate-900">{c.mapped}/{c.total}</span></span>
              <span>Last sync: <span className="font-mono text-slate-700">{c.lastSync}</span></span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => onOpen(c)} className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50" data-testid={`channel-manage-${c.id}`}>
                <i className="fa-solid fa-sliders mr-1.5 text-[10px] text-brand-accent"></i>Manage mapping
              </button>
              {c.status === "sync_error" && (
                <button onClick={() => onSync(c.id)} className="text-xs px-3 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white" data-testid={`channel-sync-${c.id}`}>
                  <i className="fa-solid fa-arrows-rotate mr-1 text-[10px]"></i>Retry
                </button>
              )}
              {c.status !== "sync_error" && (
                <button onClick={() => onToggle(c.id)} className={`text-xs px-3 py-2 rounded-full ${c.status === "connected" ? "border border-slate-200 hover:bg-slate-50" : "bg-brand-primary text-white hover:bg-brand-primary-hover"}`} data-testid={`channel-toggle-${c.id}`}>
                  {c.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const LEFT_W = 190;
const CELL_W = 76;

const RatesCalendar = ({ dates, monthLabel, rateMap, editing, setEditing, commitEdit, selection, setSelection, onShift, onBulk, onPush, connCount }) => {
  const isSelected = (catId, i) => selection && selection.catId === catId && i >= Math.min(selection.from, selection.to) && i <= Math.max(selection.from, selection.to);

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden" data-testid="rate-calendar">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-accent">Master Rate Calendar</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">{monthLabel}</h3>
          <p className="mt-1 text-xs text-slate-500">Click any cell to edit · click-drag across cells to bulk-update</p>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1">
            <button onClick={() => onShift(-7)} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="rate-prev-week"><i className="fa-solid fa-chevron-left text-[10px] mr-1"></i>Prev</button>
            <button onClick={() => onShift(7)} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="rate-next-week">Next<i className="fa-solid fa-chevron-right text-[10px] ml-1"></i></button>
          </div>
          {selection && (
            <button onClick={onBulk} className="px-3 py-1.5 rounded-full bg-brand-accent hover:bg-[#B08D1E] text-slate-900 font-medium" data-testid="rate-bulk-btn">
              <i className="fa-solid fa-pen-to-square mr-1 text-[10px]"></i>Edit {Math.abs(selection.to - selection.from) + 1} nights
            </button>
          )}
          <button onClick={onPush} className="px-3 py-1.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white" data-testid="rate-push-all">
            <i className="fa-solid fa-cloud-arrow-up mr-1 text-[10px]"></i>Push to {connCount} channels
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" onMouseLeave={() => selection && setSelection((s) => s ? { ...s } : s)}>
        <div className="min-w-max">
          {/* Header */}
          <div className="flex sticky top-0 bg-white z-10 border-b border-slate-200">
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-r border-slate-100" style={{ width: LEFT_W }}>
              <i className="fa-solid fa-tag text-[10px] text-slate-400"></i>
              <span className="text-[10px] tracking-widest uppercase text-slate-500">Category / Rate</span>
            </div>
            {dates.map((d, i) => {
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div key={i} className={`flex-shrink-0 text-center py-2 border-r border-slate-100 ${isWeekend ? "bg-brand-surface" : ""}`} style={{ width: CELL_W }}>
                  <p className="text-[9px] tracking-widest uppercase text-slate-400">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <p className={`font-mono text-sm ${isWeekend ? "text-brand-accent" : "text-slate-900"}`}>{d.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          {rateCategories.map((cat) => (
            <div key={cat.id} className="flex border-b border-slate-100" data-testid={`rate-row-${cat.id}`}>
              <div className="flex-shrink-0 px-4 py-3 border-r border-slate-100" style={{ width: LEFT_W }}>
                <p className="text-sm text-slate-900">{cat.label}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{cat.code} · base ₹{(cat.baseRate / 1000).toFixed(0)}K</p>
              </div>
              {dates.map((d, i) => {
                const dateKey = d.toISOString().slice(0, 10);
                const key = `${cat.id}:${dateKey}`;
                const value = rateMap[key];
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const selected = isSelected(cat.id, i);
                const isEditing = editing && editing.catId === cat.id && editing.dateKey === dateKey;
                return (
                  <div
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); if (!isEditing) setSelection({ catId: cat.id, from: i, to: i }); }}
                    onMouseEnter={() => { if (selection && selection.catId === cat.id) setSelection((s) => ({ ...s, to: i })); }}
                    onClick={() => { if (selection && selection.from === selection.to && selection.catId === cat.id && !isEditing) setEditing({ catId: cat.id, dateKey, value }); }}
                    className={`flex-shrink-0 h-14 border-r border-slate-100 grid place-items-center cursor-pointer transition-all select-none ${selected ? "bg-brand-primary/10 ring-1 ring-inset ring-brand-primary/40" : isWeekend ? "bg-brand-surface/60 hover:bg-brand-surface" : "hover:bg-slate-50"}`}
                    style={{ width: CELL_W }}
                    data-testid={`rate-cell-${cat.id}-${i}`}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        defaultValue={value}
                        onBlur={(e) => commitEdit(cat.id, dateKey, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitEdit(cat.id, dateKey, e.target.value); if (e.key === "Escape") setEditing(null); }}
                        className="w-full h-full text-center font-mono text-xs bg-white border border-brand-primary rounded-[6px] outline-none"
                        data-testid="rate-edit-input"
                      />
                    ) : (
                      <span className={`font-mono text-xs ${value > cat.baseRate * 1.2 ? "text-brand-accent" : "text-slate-800"}`}>₹{(value / 1000).toFixed(1)}K</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#FAFAF8", border: "1px solid #E2E8F0" }}></span>Weekend</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-primary/20 ring-1 ring-brand-primary/40"></span>Selected</span>
        <span className="flex items-center gap-1.5"><span className="font-mono text-brand-accent">₹XX.XK</span>Surge rate</span>
        <span className="ml-auto text-[10px] text-slate-400">Rates in Indian Rupees · per room per night</span>
      </div>
    </div>
  );
};

const ChannelDrawer = ({ channel, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-stretch justify-end bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="channel-drawer">
    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white h-full overflow-y-auto p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-[14px] grid place-items-center text-white font-serif text-2xl" style={{ backgroundColor: channel.color }}>{channel.logo}</div>
          <div>
            <p className="text-eyebrow text-brand-accent">Channel mapping</p>
            <h3 className="mt-0.5 font-serif text-2xl text-slate-900">{channel.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{channel.commission}% commission · Last sync {channel.lastSync}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="channel-drawer-close"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
      </div>

      <div className="mt-6">
        <p className="text-eyebrow text-slate-500">Room type mapping</p>
        <p className="mt-1 text-xs text-slate-500">Match each Aura category to the room ID on {channel.name}.</p>
        <div className="mt-4 space-y-3">
          {rateCategories.map((cat, i) => (
            <div key={cat.id} className="p-4 rounded-[14px] border border-slate-200" data-testid={`mapping-${cat.id}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-900">{cat.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{cat.code}</p>
                </div>
                <i className="fa-solid fa-arrow-right text-slate-300 text-xs"></i>
                <input
                  defaultValue={i < channel.mapped ? `${channel.logo}-${1000 + i}-${cat.code}` : ""}
                  placeholder="Not mapped"
                  className={`bg-brand-surface border border-slate-200 rounded-[10px] px-3 py-2 text-xs outline-none focus:border-brand-primary font-mono w-40 ${i >= channel.mapped ? "border-dashed" : ""}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-[14px] bg-brand-surface border border-slate-100">
        <p className="text-eyebrow text-slate-500">Rate parity</p>
        <p className="mt-2 text-sm text-slate-800">Publish Aura Direct rate + <span className="font-mono text-brand-primary">{channel.commission}%</span> for parity, or use channel-specific pricing.</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white">Match direct rate</button>
          <button className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-white">Custom</button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 justify-end">
        <button onClick={onClose} className="text-xs px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Cancel</button>
        <button onClick={() => { toast.success(`${channel.name} mapping saved`); onClose(); }} className="text-xs px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white" data-testid="channel-drawer-save">Save & sync</button>
      </div>
    </div>
  </div>
);
