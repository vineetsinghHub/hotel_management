import { Link } from "react-router-dom";
import { PropertyMark } from "./PropertyMark";
import { property } from "@/data/mockData";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <PropertyMark inverse />
            <p className="mt-6 text-slate-400 text-[15px] leading-relaxed max-w-md">
              A living heritage estate on the shores of Lake Pichola. Since {property.established},
              hosting those who understand that true luxury is the quiet mastery of every detail.
            </p>
            <div className="mt-8">
              <p className="text-eyebrow text-[#E6C868]">Newsletter</p>
              <p className="mt-3 text-slate-300 text-sm max-w-md">Receive our journal — private events, seasonal openings, and letters from the palace.</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-5 flex items-center gap-2 max-w-md p-1.5 rounded-full border border-white/10 bg-white/5"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-slate-500 outline-none"
                  data-testid="footer-newsletter-input"
                />
                <button
                  className="bg-[#C9A227] hover:bg-[#B08D1E] text-slate-900 text-[12px] tracking-wide font-medium px-5 py-2.5 rounded-full transition-colors"
                  data-testid="footer-newsletter-submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-eyebrow text-[#E6C868]">The Property</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link to="/rooms" className="hover:text-white">Rooms & Suites</Link></li>
              <li><Link to="/dining" className="hover:text-white">Dining</Link></li>
              <li><Link to="/spa" className="hover:text-white">Spa</Link></li>
              <li><Link to="/experiences" className="hover:text-white">Experiences</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-eyebrow text-[#E6C868]">Guests</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link to="/booking" className="hover:text-white">Reservations</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">My Account</Link></li>
              <li><a href="#" className="hover:text-white">Loyalty Circle</a></li>
              <li><a href="#" className="hover:text-white">Gift Cards</a></li>
              <li><a href="#" className="hover:text-white">Concierge</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-eyebrow text-[#E6C868]">Contact</p>
            <address className="mt-5 not-italic text-sm text-slate-300 leading-relaxed">
              {property.address}
            </address>
            <p className="mt-4 text-sm text-slate-300 font-mono">{property.phone}</p>
            <p className="text-sm text-slate-300 font-mono">{property.email}</p>
            <div className="mt-6 flex items-center gap-3">
              {["instagram", "facebook", "youtube", "pinterest-p"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  data-testid={`social-${s}`}
                >
                  <i className={`fa-brands fa-${s} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Aura Hotels. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Accessibility</a>
            <a href="#" className="hover:text-slate-300">Modern Slavery Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
