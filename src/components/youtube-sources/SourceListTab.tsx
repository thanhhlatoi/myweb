import { AlertTriangle, Copy, ExternalLink, Filter, PlaySquare, Search, XCircle } from "lucide-react";
import { sources } from "./youtubeSourcesData";
import { getScoreClass, getVerdictClass } from "./youtubeSourcesUtils";

interface Props {
  rejectedCount: number;
}

export default function SourceListTab({ rejectedCount }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              placeholder="Tìm tên kênh, link hoặc danh mục..."
              className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Filter size={18} />
            Lọc nguồn
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100 text-left text-sm text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Kênh</th>
              <th className="px-4 py-3 font-semibold">Danh mục</th>
              <th className="px-4 py-3 font-semibold">Nguồn</th>
              <th className="px-4 py-3 font-semibold">Subscribers</th>
              <th className="px-4 py-3 font-semibold">Điểm</th>
              <th className="px-4 py-3 font-semibold">Kết luận</th>
              <th className="px-4 py-3 font-semibold">Lý do</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} className="border-b align-top transition hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                      <PlaySquare size={21} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">{source.channelName}</p>
                      <p className="max-w-64 break-all text-sm text-slate-500">{source.url}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">{source.category}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {source.ownerType}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600">{source.subscribers}</td>
                <td className={`px-4 py-4 text-xl font-bold ${getScoreClass(source.score)}`}>{source.score}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getVerdictClass(source.verdict)}`}>
                    {source.verdict}
                  </span>
                </td>
                <td className="max-w-sm px-4 py-4 text-sm leading-6 text-slate-600">{source.reason}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" title="Copy link">
                      <Copy size={17} />
                    </button>
                    <button className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600" title="Mở kênh">
                      <ExternalLink size={17} />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{source.lastChecked}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectedCount > 0 && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle className="shrink-0" size={20} />
          Có {rejectedCount} nguồn đang bị đánh giá không nên tham khảo. Nên kiểm tra lại trước khi dùng làm tài liệu hoặc ý tưởng nội dung.
        </div>
      )}

      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <AlertTriangle className="shrink-0" size={20} />
        Điểm đánh giá trong giao diện là dữ liệu mẫu. Khi nối API, phần kiểm tra nguồn nên dựa trên dữ liệu thật từ YouTube và danh sách nguồn chính thức nội bộ.
      </div>
    </div>
  );
}
