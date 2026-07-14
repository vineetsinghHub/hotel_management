import { useMemo } from "react";
import { getAdminUser } from "@aura/shared/admin/adminAuth";
import { isReadOnly } from "@aura/shared/admin/roles";

// Small banner rendered at the top of any admin page that has write actions.
// The presence of this banner + hidden action buttons form the read-only
// enforcement contract.
export const ReadOnlyBanner = () => {
  const user = useMemo(() => getAdminUser(), []);
  if (!user || !isReadOnly(user.role)) return null;
  return (
    <div
      className="mb-4 p-3.5 rounded-[12px] bg-slate-50 border border-slate-200 flex items-center gap-3"
      data-testid="readonly-banner"
    >
      <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 grid place-items-center flex-shrink-0">
        <i className="fa-solid fa-eye text-[11px]"></i>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 font-medium">Read-only mode</p>
        <p className="text-xs text-slate-500">You can view all data on this page. Creating or editing records is disabled for your role.</p>
      </div>
    </div>
  );
};

// Convenience hook used by page components to know whether to render
// create/edit/delete buttons.
export const useReadOnly = () => {
  const user = getAdminUser();
  return user ? isReadOnly(user.role) : false;
};

export default ReadOnlyBanner;
