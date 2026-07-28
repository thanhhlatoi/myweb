import { Download, Filter, Search } from "lucide-react";

interface Props {
  monetizedChannels: number;
}

export default function YoutubeToolbar({ monetizedChannels }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Tìm kênh, handle hoặc chủ sở hữu..."
            className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
            {monetizedChannels} kênh đã bật kiếm tiền
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Filter size={18} />
            Bộ lọc
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700">
            <Download size={18} />
            Xuất file
          </button>
        </div>
      </div>
    </div>
  );
}
