import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGuestAuth } from "@/lib/guestAuth";
import GuestAuthModal from "@/components/GuestAuthModal";

// Wrapper that gates guest-only routes (dashboard, booking, payment,
// confirmation) behind a mock login. If the guest isn't authed we render
// nothing except the login modal; on success we let them continue.
export const RequireGuestAuth = ({ children, reason }) => {
  const { isAuthed } = useGuestAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [open, setOpen] = useState(!isAuthed);

  useEffect(() => { setOpen(!isAuthed); }, [isAuthed]);

  if (isAuthed) return children;

  const homePath = slug ? `/t/${slug}` : "/";

  return (
    <>
      <div className="min-h-screen bg-brand-surface grid place-items-center px-6" data-testid="guest-auth-wall">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-brand-surface-elev shadow-[0_20px_60px_rgba(15,23,42,0.10)] border border-brand-border grid place-items-center mx-auto">
            <i className="fa-solid fa-lock text-brand-primary"></i>
          </div>
          <p className="mt-6 text-eyebrow text-brand-accent">Members only</p>
          <h2 className="mt-1 font-serif text-3xl text-brand-ink">Sign in to continue</h2>
          <p className="mt-2 text-sm text-brand-ink-soft">{reason || "This area is reserved for signed-in guests."}</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-6 px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-sm shadow-[0_10px_28px_rgba(15,23,42,0.15)]"
            data-testid="guest-auth-open"
          >
            Sign in
          </button>
          <button
            onClick={() => nav(homePath)}
            className="ml-2 mt-6 px-6 py-2.5 rounded-full border border-brand-border hover:bg-brand-surface-elev text-sm text-brand-ink-soft"
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
