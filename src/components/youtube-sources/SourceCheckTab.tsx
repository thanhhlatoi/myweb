import { ShieldCheck } from "lucide-react";

export default function SourceCheckTab() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
        <ShieldCheck size={20} />
        Kiểm tra nguồn nhanh
      </h2>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-600">Link kênh YouTube</label>
          <input
            placeholder="https://www.youtube.com/@channel"
            className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600">Loại nguồn</label>
          <select className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100">
            <option>Chính sách YouTube</option>
            <option>Hướng dẫn creator</option>
            <option>Tăng trưởng kênh</option>
            <option>Ý tưởng nội dung</option>
          </select>
        </div>

        <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-800 lg:col-span-2">
          Hệ thống sẽ đánh giá theo dấu hiệu chính chủ, nguồn dẫn, độ mới của nội
          dung và rủi ro reup/spam.
        </div>

        <button className="rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 lg:w-fit">
          Kiểm tra nguồn
        </button>
      </div>
    </div>
  );
}
