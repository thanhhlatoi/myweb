import { getScoreClass } from "./youtubeSourcesUtils";

interface Props {
  total: number;
  recommendedCount: number;
  reviewCount: number;
  averageScore: number;
}

export default function YoutubeSourcesStats({ total, recommendedCount, reviewCount, averageScore }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Tổng nguồn lưu</p>
        <strong className="mt-3 block text-2xl text-slate-950">{total}</strong>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Nên tham khảo</p>
        <strong className="mt-3 block text-2xl text-emerald-600">{recommendedCount}</strong>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Cần kiểm tra</p>
        <strong className="mt-3 block text-2xl text-amber-600">{reviewCount}</strong>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Điểm tin cậy TB</p>
        <strong className={`mt-3 block text-2xl ${getScoreClass(averageScore)}`}>{averageScore}/100</strong>
      </div>
    </div>
  );
}
