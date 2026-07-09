import { useState } from "react";
import { toast } from "sonner";

// Persist reviews in localStorage so Admin Reviews module can read them later.
const KEY = "aura_guest_reviews";
const push = (r) => {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
    arr.unshift(r);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 50)));
  } catch (e) {}
};

export const ReviewPrompt = ({ suite, resCode, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const tagOpts = ["Room", "Service", "Dining", "Spa", "Concierge", "Value"];

  const submit = () => {
    if (rating === 0) { toast.error("Please pick a rating first"); return; }
    const review = {
      id: `rv${Date.now()}`,
      resCode, suite, rating, text: text.trim(), tags,
      when: new Date().toISOString(),
      author: "Aarav M.",
    };
    push(review);
    toast.success("Thank you — review submitted", { description: "Your feedback helps us serve you better next time." });
    onSubmitted && onSubmitted(review);
    onClose && onClose();
  };

  const toggleTag = (t) => setTags((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" data-testid="review-prompt">
      <div className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Skip review" data-testid="review-skip">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">How was your stay?</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Rate your time at Aura</h3>
        <p className="text-sm text-slate-500 mt-1">{suite}</p>

        <div className="mt-5 flex items-center gap-2" data-testid="review-stars" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Star rating">
          {[1,2,3,4,5].map((n) => (
            <button key={n} onMouseEnter={() => setHover(n)} onClick={() => setRating(n)} className={`w-11 h-11 grid place-items-center transition-transform ${(hover || rating) >= n ? "text-[#C9A227] scale-110" : "text-slate-300"} press-scale`} aria-label={`${n} star${n>1?"s":""}`} data-testid={`star-${n}`}>
              <i className={`fa-${(hover || rating) >= n ? "solid" : "regular"} fa-star text-2xl`}></i>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">{["", "Not great", "Below expectations", "Good", "Wonderful", "Truly unforgettable"][hover || rating]}</p>

        <div className="mt-5">
          <p className="text-eyebrow text-slate-500">What stood out</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tagOpts.map((t) => (
              <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${tags.includes(t) ? "bg-[#4F46E5] text-white border-[#4F46E5]" : "bg-[#FAFAF8] text-slate-700 border-transparent hover:border-slate-200"}`} data-testid={`tag-${t.toLowerCase()}`}>{t}</button>
            ))}
          </div>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Tell us about your favourite moment (optional)…" className="mt-4 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="review-text" />

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-700">Later</button>
          <button onClick={submit} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="review-submit">
            <i className="fa-regular fa-paper-plane text-[11px] mr-1.5"></i>Submit review
          </button>
        </div>
      </div>
    </div>
  );
};

export const getStoredReviews = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
};

export default ReviewPrompt;
