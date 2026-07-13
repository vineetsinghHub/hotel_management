import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGuestAuth } from "@/lib/guestAuth";
import GuestAuthModal from "@/components/GuestAuthModal";

// Wrapper that gates guest-only routes (dashboard, booking, payment,
// confirmation) behind a mock login. If the guest isn't authed we render
// nothing except the login modal; on success we let them continue.
export const RequireGuestAuth = ({ children, reason }) => {
  const { isAuthed } = useGuestAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(!isAuthed);

  useEffect(() => { setOpen(!isAuthed); }, [isAuthed]);

  if (isAuthed) return children;

  return (
    <>
      {/* Preview shell so the header is not orphaned. */}
      <div className="min-h-screen bg-[#FAFAF8] grid place-items-center px-6" data-testid="guest-auth-wall">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] border border-slate-100 grid place-items-center mx-auto">
            <i className="fa-solid fa-lock text-[#4F46E5]"></i>
          </div>
          <p className="mt-6 text-eyebrow text-[#C9A227]">Members only</p>
          <h2 className="mt-1 font-serif text-3xl text-slate-900">Sign in to continue</h2>
          <p className="mt-2 text-sm text-slate-500">{reason || "This area is reserved for signed-in guests."}</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]"
            data-testid="guest-auth-open"
          >
            Sign in
          </button>
          <button
            onClick={() => nav("/")}
            className="ml-2 mt-6 px-6 py-2.5 rounded-full border border-slate-200 hover:bg-white text-sm text-slate-700"
            data-testid="guest-auth-back"
          >
            Back to home
          </button>
        </div>
      </div>
      <GuestAuthModal
        open={open}
        onClose={() => { setOpen(false); }}
        onSuccess={() => setOpen(false)}
        reason={reason}
      />
    </>
  );
};

export default RequireGuestAuth;
