import { CheckCircle2, Star } from "lucide-react";
import { checklist } from "./youtubeSourcesData";

export default function CriteriaTab() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
        <Star size={20} />
        Tiêu chí nên tham khảo
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {checklist.map((item) => (
          <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
