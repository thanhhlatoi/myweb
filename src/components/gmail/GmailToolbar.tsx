import { Download, Filter, Search } from "lucide-react";

interface Props {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onExport: () => void;
}

export default function GmailToolbar({ search, status, onSearchChange, onStatusChange, onExport }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm Gmail, mã, số điện thoại hoặc chủ sở hữu..."
            className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="rounded-xl border bg-white px-4 py-3 font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            <option>Tất cả trạng thái</option>
            <option>Active</option>
            <option>Locked</option>
            <option>Need Verify</option>
            <option>Recovery Required</option>
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Filter size={18} />
            Bộ lọc
          </button>

          <button onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Download size={18} />
            Xuất file
          </button>
        </div>
      </div>

    </div>
  );
}
