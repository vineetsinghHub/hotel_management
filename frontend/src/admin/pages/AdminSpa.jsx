import AdminLayout from "@/admin/components/AdminLayout";
import ServiceClosurePanel from "@/admin/components/ServiceClosurePanel";
import { spaAppointments, statusColor } from "@/admin/adminMockData";
import { useServiceStatus } from "@/lib/serviceStatusStore";

export default function AdminSpa() {
  const status = useServiceStatus("aura", "spa");
  const closed = status.status === "closed";

  return (
    <AdminLayout pageTitle="Spa Operations">
      <div className="mb-6">
        <ServiceClosurePanel tenantSlug="aura" service="spa" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200">
          <p className="text-[10px] tracking-widest uppercase text-slate-500">Today&apos;s appointments</p>
          <p className="mt-2 font-mono text-3xl text-slate-900">{closed ? 0 : spaAppointments.length}</p>
          {closed && <p className="mt-1 text-[10px] text-rose-600">Bookings paused</p>}
        </div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200">
          <p className="text-[10px] tracking-widest uppercase text-slate-500">Revenue today</p>
          <p className="mt-2 font-mono text-3xl text-slate-900">
            ₹{closed ? 0 : Math.round(spaAppointments.reduce((s, a) => s + a.price, 0) / 1000)}K
          </p>
        </div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200">
          <p className="text-[10px] tracking-widest uppercase text-slate-500">Therapist utilisation</p>
          <p className={`mt-2 font-mono text-3xl ${closed ? "text-slate-400" : "text-emerald-600"}`}>{closed ? "—" : "82%"}</p>
        </div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200">
          <p className="text-[10px] tracking-widest uppercase text-slate-500">Avg treatment value</p>
          <p className="mt-2 font-mono text-3xl text-slate-900">₹28K</p>
        </div>
      </div>

      <div className={`bg-white rounded-[16px] border border-slate-200 overflow-hidden ${closed ? "opacity-50" : ""}`} data-testid="spa-appointments-table">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Appointment</th>
              <th className="text-left font-medium">Guest</th>
              <th className="text-left font-medium">Treatment</th>
              <th className="text-left font-medium">Therapist</th>
              <th className="text-left font-medium">Time</th>
              <th className="text-left font-medium">Status</th>
              <th className="text-right px-5 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {spaAppointments.map((a) => {
              const st = statusColor(a.status);
              return (
                <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`spa-appt-${a.id}`}>
                  <td className="px-5 py-3 font-mono text-slate-900">{a.id}</td>
                  <td>{a.guest} <span className="text-slate-400 text-xs">· Rm {a.room}</span></td>
                  <td>{a.treatment}<p className="text-[10px] text-slate-500">{a.duration}</p></td>
                  <td className="text-slate-700 text-xs">{a.therapist}</td>
                  <td className="font-mono text-sm">{a.time}</td>
                  <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                  <td className="px-5 text-right font-mono text-slate-900">₹{(a.price / 1000).toFixed(1)}K</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
