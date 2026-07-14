import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import { notificationsAdmin } from "@aura/shared/admin/adminMockData";
const iconOf = (k) => ({ reservation: "calendar-plus", maintenance: "screwdriver-wrench", review: "star", inventory: "boxes-stacked", marketing: "bullhorn" }[k] || "bell");
export default function Notifications() {
  const [rows, setRows] = useState(notificationsAdmin);
  const markRead = (id) => setRows((s) => s.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll = () => { setRows((s) => s.map((n) => ({ ...n, read: true }))); toast.success("All marked as read"); };
  const dismiss = (id) => setRows((s) => s.filter((n) => n.id !== id));
  return (
    <AdminLayout pageTitle="Notifications">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{rows.filter((r) => !r.read).length} unread</p>
        <button onClick={markAll} className="text-xs text-brand-primary hover:underline" data-testid="mark-all">Mark all as read</button>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 divide-y divide-slate-100">
        {rows.map((n) => (
          <div key={n.id} className={`p-5 flex items-start gap-4 ${!n.read ? "bg-indigo-50/30" : ""}`} data-testid={`notif-${n.id}`}>
            <span className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary grid place-items-center flex-shrink-0"><i className={`fa-solid fa-${iconOf(n.kind)} text-sm`}></i></span>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-medium">{n.title}</p>
              <p className="text-xs text-slate-500 mt-1">{n.body}</p>
              <p className="text-[10px] text-slate-400 mt-1">{n.when}</p>
            </div>
            <div className="flex items-center gap-2">
              {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-slate-500 hover:text-slate-900">Mark read</button>}
              <button onClick={() => dismiss(n.id)} className="text-xs text-slate-400 hover:text-rose-500"><i className="fa-solid fa-xmark"></i></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
