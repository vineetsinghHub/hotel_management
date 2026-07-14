import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { toast } from "sonner";
import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import { platformTenants, statusPill, churnPill } from "@aura/super-admin/superAdmin/superAdminMockData";
import TenantPreviewModal from "@aura/super-admin/superAdmin/components/TenantPreviewModal";

const columnHelper = createColumnHelper();

export default function SuperTenants() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [sorting, setSorting] = useState([{ id: "mrr", desc: true }]);
  const [previewTenant, setPreviewTenant] = useState(null);

  // Filter dataset before feeding it to the table.
  const data = useMemo(() =>
    platformTenants.filter((t) =>
      (tierFilter === "all" || t.tier === tierFilter)
      && (statusFilter === "all" || t.status === statusFilter)
      && (templateFilter === "all" || t.template === templateFilter)
    ),
    [tierFilter, statusFilter, templateFilter]
  );

  const columns = useMemo(() => [
    columnHelper.accessor("brandName", {
      header: "Tenant",
      cell: (info) => {
        const t = info.row.original;
        return (
          <Link to={`/super-admin/tenants/${t.slug}`} className="flex items-center gap-3 group" data-testid={`tenant-row-${t.slug}`}>
            <span className="w-9 h-9 rounded-[10px] grid place-items-center text-xs font-serif text-slate-900" style={{ backgroundColor: "#C9A227" }}>{t.brandName[0]}</span>
            <div className="min-w-0">
              <p className="text-white text-sm truncate group-hover:text-brand-accent-hover">{t.brandName}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">/{t.slug}</p>
            </div>
          </Link>
        );
      },
    }),
    columnHelper.accessor("template", { header: "Template", cell: (i) => <span className="capitalize text-slate-300 text-xs">{i.getValue()}</span> }),
    columnHelper.accessor("tier", {
      header: "Tier",
      cell: (i) => (
        <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded font-medium ${i.getValue() === "pro" ? "bg-gradient-to-r from-brand-accent to-brand-accent-hover text-slate-900" : "bg-slate-700 text-slate-300"}`}>
          {i.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("users", { header: "Users", cell: (i) => <span className="font-mono text-xs text-slate-300">{i.getValue()}</span> }),
    columnHelper.accessor("mrr", { header: "MRR", cell: (i) => <span className="font-mono text-sm text-white">₹{(i.getValue() / 1000).toFixed(1)}K</span> }),
    columnHelper.accessor("health", {
      header: "Health",
      cell: (i) => {
        const v = i.getValue();
        const color = v >= 95 ? "#10B981" : v >= 80 ? "#C9A227" : "#F43F5E";
        return (
          <div className="flex items-center gap-2">
            <span className="w-14 h-1 rounded-full bg-slate-700 overflow-hidden"><span className="block h-full" style={{ width: `${v}%`, backgroundColor: color }}></span></span>
            <span className="font-mono text-xs" style={{ color }}>{v}%</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (i) => {
        const p = statusPill(i.getValue());
        return <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.bg} ${p.text}`}>{p.label}</span>;
      },
    }),
    columnHelper.accessor("churn", {
      header: "Churn",
      cell: (i) => {
        const p = churnPill(i.getValue());
        return <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.bg} ${p.text}`}>{p.label}</span>;
      },
    }),
    columnHelper.accessor("lastActive", { header: "Last active", cell: (i) => <span className="text-slate-400 text-xs">{i.getValue()}</span> }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => {
        const t = info.row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.preventDefault(); setPreviewTenant(t); }}
              className="w-7 h-7 rounded-full hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white"
              title="Preview as tenant (live)"
              data-testid={`preview-${t.slug}`}
            >
              <i className="fa-solid fa-eye text-[10px]"></i>
            </button>
            <a href={`/t/${t.slug}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white" title="Open storefront in new tab" data-testid={`open-${t.slug}`}>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
            <button
              onClick={(e) => { e.preventDefault(); toast.success(`Impersonating ${t.brandName}`, { description: "You are now signed in as this tenant's admin (mock)." }); }}
              className="w-7 h-7 rounded-full hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white"
              title="Impersonate"
              data-testid={`impersonate-${t.slug}`}
            >
              <i className="fa-solid fa-user-secret text-[10px]"></i>
            </button>
            <Link to={`/super-admin/tenants/${t.slug}`} className="w-7 h-7 rounded-full hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white" title="Details" data-testid={`details-${t.slug}`}>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filterPill = (value, current, onClick, label) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${current === value ? "bg-brand-primary text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
      data-testid={`filter-${label || value}`}
    >
      {label || value}
    </button>
  );

  return (
    <SuperAdminLayout
      pageTitle="Tenants"
      rightSlot={
        <Link to="/super-admin/provision" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.35)]" data-testid="new-tenant-btn">
          <i className="fa-solid fa-plus text-[10px]"></i>New tenant
        </Link>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5" data-testid="tenants-filters">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search brand or slug…"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary"
            data-testid="tenants-search"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filterPill("all", tierFilter, () => setTierFilter("all"), "All tiers")}
          {filterPill("basic", tierFilter, () => setTierFilter("basic"))}
          {filterPill("pro", tierFilter, () => setTierFilter("pro"))}
        </div>
        <div className="flex items-center gap-1.5">
          {filterPill("all", statusFilter, () => setStatusFilter("all"), "All statuses")}
          {filterPill("active", statusFilter, () => setStatusFilter("active"))}
          {filterPill("trial", statusFilter, () => setStatusFilter("trial"))}
          {filterPill("suspended", statusFilter, () => setStatusFilter("suspended"))}
        </div>
        <div className="flex items-center gap-1.5">
          {filterPill("all", templateFilter, () => setTemplateFilter("all"), "All templates")}
          {filterPill("heritage", templateFilter, () => setTemplateFilter("heritage"))}
          {filterPill("luxury", templateFilter, () => setTemplateFilter("luxury"))}
          {filterPill("basic", templateFilter, () => setTemplateFilter("basic"))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[16px] bg-white/5 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="tenants-table">
            <thead className="text-[10px] tracking-widest uppercase text-slate-500 bg-white/5">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="text-left px-5 py-3 font-medium cursor-pointer select-none whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === "asc" && <i className="fa-solid fa-arrow-up text-[8px]"></i>}
                        {h.column.getIsSorted() === "desc" && <i className="fa-solid fa-arrow-down text-[8px]"></i>}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-white/5 hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr><td colSpan={columns.length} className="p-12 text-center text-sm text-slate-500" data-testid="tenants-empty">No tenants match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page <span className="font-mono text-white">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()} · <span className="font-mono">{data.length}</span> tenants
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-40 grid place-items-center" data-testid="pagination-prev">
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-40 grid place-items-center" data-testid="pagination-next">
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <TenantPreviewModal
        tenant={previewTenant}
        open={!!previewTenant}
        onClose={() => setPreviewTenant(null)}
      />
    </SuperAdminLayout>
  );
}
