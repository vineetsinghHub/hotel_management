import SuperAdminLayout from "@/superAdmin/SuperAdminLayout";
import { platformAudit } from "@/superAdmin/superAdminMockData";

export default function SuperAudit() {
  return (
    <SuperAdminLayout pageTitle="Audit log">
      <p className="text-sm text-slate-400 mb-5">All operator actions across the platform. Retained 400 days · exportable to CSV.</p>
      <div className="rounded-[16px] bg-white/5 border border-white/10 overflow-hidden">
        <ul className="divide-y divide-white/5">
          {platformAudit.map((a) => (
            <li key={a.id} className="p-5 flex items-center gap-4" data-testid={`audit-${a.id}`}>
              <span className="w-10 h-10 rounded-full grid place-items-center flex-shrink-0" style={{ backgroundColor: `${a.color}25`, color: a.color }}>
                <i className={`fa-solid fa-${a.icon} text-xs`}></i>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white"><span className="text-slate-400">{a.who}</span> {a.action}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{a.target}</p>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{a.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </SuperAdminLayout>
  );
}
