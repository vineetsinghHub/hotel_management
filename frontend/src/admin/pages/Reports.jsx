import { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import ReportBuilder from "@/admin/components/ReportBuilder";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const days = Array.from({ length: 14 }).map((_, i) => ({
  d: `D${i + 1}`, rev: 32 + Math.round(Math.sin(i / 2) * 8) + (i % 5) * 3, adr: 240 + (i * 7) % 50,
}));

export default function Reports() {
  const [tab, setTab] = useState("builder");

  return (
    <AdminLayout pageTitle="Reports">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Analytics</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Reports & Exports</h2>
        </div>
        <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1" role="tablist">
          {[["builder", "Report Builder"], ["overview", "Overview"], ["nightaudit", "Night Audit"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-full text-xs transition-all ${tab === k ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`} data-testid={`reports-tab-${k}`} role="tab" aria-selected={tab === k}>{l}</button>
          ))}
        </div>
      </div>

      {tab === "builder" && <ReportBuilder />}

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="reports-overview">
          <div className="p-5 rounded-[16px] bg-white border border-slate-200">
            <p className="text-eyebrow text-[#C9A227]">Revenue trend</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={days} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip />
                <Area dataKey="rev" stroke="#4F46E5" fill="#C9A227" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-5 rounded-[16px] bg-white border border-slate-200">
            <p className="text-eyebrow text-[#C9A227]">ADR</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={days} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="adr" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "nightaudit" && (
        <div className="bg-white rounded-[20px] border border-slate-200 p-8" data-testid="night-audit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-[#C9A227]">End of day · {new Date().toLocaleDateString()}</p>
              <h3 className="mt-1 font-serif text-2xl text-slate-900">Night audit report</h3>
            </div>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs" data-testid="night-audit-print"><i className="fa-solid fa-print text-[10px] mr-1.5"></i>Print / PDF</button>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "Occupancy", v: "73%" }, { l: "ADR", v: "$278" }, { l: "RevPAR", v: "$203" }, { l: "Rooms sold", v: "19 / 26" },
              { l: "No-shows", v: "1" }, { l: "Walk-ins", v: "2" }, { l: "F&B revenue", v: "$4,120" }, { l: "Cash-drawer", v: "$820" },
            ].map((k) => (
              <div key={k.l} className="p-4 rounded-[14px] bg-[#FAFAF8]">
                <p className="text-[10px] tracking-widest uppercase text-slate-500">{k.l}</p>
                <p className="mt-2 font-mono text-2xl text-slate-900">{k.v}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
