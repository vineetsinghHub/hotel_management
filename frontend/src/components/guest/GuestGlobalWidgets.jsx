import { useLocation } from "react-router-dom";
import { useGuestAuth } from "@/lib/guestAuth";
import ConciergeChat from "@/components/guest/ConciergeChat";
import GuestCommandPalette from "@/components/guest/GuestCommandPalette";

// GuestGlobalWidgets — mounts the floating Concierge chatbot and the guest
// command palette on every guest storefront route, but only after the guest
// has signed in. This lets the concierge follow the guest across Home, Rooms,
// Dining, Spa, Experiences, Booking, Payment, Confirmation and Dashboard
// (previously it only rendered inside Dashboard).
export default function GuestGlobalWidgets() {
  const { isAuthed } = useGuestAuth();
  const { pathname } = useLocation();

  // Belt-and-suspenders: never mount on admin/super-admin routes even if the
  // component is accidentally imported there.
  if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin")) return null;

  // Suppress inside iframe previews (Super Admin "Preview as tenant") so the
  // ops walkthrough isn't cluttered by a chat bubble.
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("embed") === "1") return null;
  }

  if (!isAuthed) return null;

  return (
    <>
      <ConciergeChat />
      <GuestCommandPalette />
    </>
  );
}
