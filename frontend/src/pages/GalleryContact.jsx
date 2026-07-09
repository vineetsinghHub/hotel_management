import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { galleryImages, faqs, property } from "@/data/mockData";

const banner = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2200&q=90";

const heights = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]"];

export default function GalleryContact() {
  const [tab, setTab] = useState("gallery");
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletter, setNewsletter] = useState("");

  return (
    <div className="bg-[#FAFAF8]" data-testid="gallery-page">
      <Navbar transparent />

      <section className="relative h-[60vh] overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-white/40"></i>
            <span className="text-white">Gallery & Contact</span>
          </nav>
          <h1 className="font-serif text-white text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            The <span className="italic font-light">Palace</span>, in photographs
          </h1>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 md:px-10 pt-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          {[
            { id: "gallery", l: "Gallery" },
            { id: "video", l: "Videos" },
            { id: "tour", l: "Virtual Tour" },
            { id: "contact", l: "Contact & Map" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm ${tab === t.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"}`}
              data-testid={`tab-${t.id}`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY */}
      {tab === "gallery" && (
        <section className="py-12 px-6 md:px-10" data-testid="masonry-gallery">
          <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            {galleryImages.map((img, i) => (
              <div key={i} className={`mb-4 rounded-[18px] overflow-hidden ${heights[i % heights.length]} break-inside-avoid`}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" />
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "video" && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85",
              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=85",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85",
            ].map((v, i) => (
              <div key={i} className="relative aspect-video rounded-[20px] overflow-hidden group">
                <img src={v} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/40 grid place-items-center">
                  <button className="w-16 h-16 rounded-full glass grid place-items-center hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play text-slate-900 ml-1"></i>
                  </button>
                </div>
                <p className="absolute bottom-4 left-4 text-white font-serif text-lg">
                  {["Palace at Dawn", "The Suites", "Heritage Walk", "Chef's Table"][i]}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "tour" && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto relative aspect-[16/9] rounded-[24px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90" className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-slate-900/40 grid place-items-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 mx-auto rounded-full glass grid place-items-center">
                  <i className="fa-solid fa-vr-cardboard text-slate-900 text-2xl"></i>
                </div>
                <p className="mt-6 font-serif text-3xl">Enter the Palace</p>
                <p className="mt-2 text-white/80 text-sm">360° virtual tour · 14 suites · 3 restaurants</p>
                <button className="mt-6 px-6 py-3 rounded-full bg-white text-slate-900 text-sm">Begin Tour</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "contact" && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[24px] border border-slate-200 p-8">
              <p className="text-eyebrow text-[#C9A227]">Reach Us</p>
              <h2 className="mt-2 font-serif text-3xl text-slate-900">Contact & Concierge</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-location-dot text-[#C9A227] mt-1"></i>
                  <p>{property.address}</p>
                </div>
                <div className="flex items-center gap-4"><i className="fa-solid fa-phone text-[#C9A227]"></i><span className="font-mono">{property.phone}</span></div>
                <div className="flex items-center gap-4"><i className="fa-regular fa-envelope text-[#C9A227]"></i><span className="font-mono">{property.email}</span></div>
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-square-parking text-[#C9A227] mt-1"></i>
                  <div>
                    <p className="text-slate-900">Valet parking</p>
                    <p className="text-xs text-slate-500 mt-1">Complimentary for all guests. Secure covered parking, car detailing on request.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Full name" className="bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" />
                <input placeholder="Email" className="bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" />
                <textarea placeholder="How may we assist you?" rows={4} className="md:col-span-2 bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" />
                <button className="md:col-span-2 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm">Send Message</button>
              </form>
            </div>

            <div className="rounded-[24px] overflow-hidden border border-slate-200 relative min-h-[520px]">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2200&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/25"></div>
              {/* Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <span className="absolute inset-0 w-16 h-16 rounded-full bg-[#4F46E5]/30 animate-ping"></span>
                  <div className="relative w-16 h-16 rounded-full bg-white grid place-items-center shadow-lg">
                    <i className="fa-solid fa-location-dot text-[#4F46E5] text-xl"></i>
                  </div>
                </div>
              </div>
              {/* Nearby */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-[18px] p-5">
                <p className="text-eyebrow text-[#C9A227]">Nearby Attractions</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                  {[
                    ["City Palace", "1.2 km"],
                    ["Jag Mandir", "3.4 km"],
                    ["Bagore Ki Haveli", "0.8 km"],
                    ["Saheliyon-ki-Bari", "5.0 km"],
                  ].map(([n, d]) => (
                    <div key={n} className="flex items-center justify-between">
                      <span>{n}</span>
                      <span className="font-mono text-xs text-slate-500">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-24 px-6 md:px-10 bg-white border-y border-slate-200" data-testid="faq-section">
        <div className="max-w-4xl mx-auto">
          <p className="text-eyebrow text-[#C9A227] text-center">Frequently Asked</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-slate-900 text-center">Everything you may wonder</h2>
          <div className="mt-12 divide-y divide-slate-100">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between py-6 text-left"
                  data-testid={`faq-${i}`}
                >
                  <span className="font-serif text-xl text-slate-900">{f.q}</span>
                  <i className={`fa-solid fa-plus text-slate-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}></i>
                </button>
                {openFaq === i && (
                  <div className="pb-6 text-sm text-slate-600 leading-relaxed max-w-3xl">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow text-[#C9A227]">The Aura Journal</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-slate-900">Letters from the Palace</h2>
          <p className="mt-4 text-slate-600 max-w-xl mx-auto">Private events, seasonal openings, and letters written by our concierge. Never a promotion — always a story worth reading.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex items-center gap-2 max-w-lg mx-auto p-1.5 rounded-full border border-slate-200 bg-white">
            <input
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              data-testid="newsletter-input"
            />
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-6 py-2.5 rounded-full" data-testid="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
