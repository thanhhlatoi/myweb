interface Props {
  label: string;
  value: string;
  tone: "red" | "green" | "blue" | "purple";
}

const toneClasses = {
  red: "bg-red-50 text-red-600 ring-red-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  purple: "bg-violet-50 text-violet-600 ring-violet-100",
};

export default function YoutubeCard({ label, value, tone }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-2xl font-bold text-slate-950">{value}</strong>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}>
          Live
        </span>
      </div>
    </div>
  );
}
