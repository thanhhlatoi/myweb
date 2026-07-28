import { TrendingUp } from "lucide-react";
import { countries, trendingKeywords } from "./youtubeSourcesData";
import { getTrendSuggestionClass } from "./youtubeSourcesUtils";

export default function TrendTab() {
  const topTrend = trendingKeywords[0];

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <TrendingUp className="text-red-600" size={22} />
            Tìm kiếm trend YouTube theo quốc gia
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Theo dõi từ khóa được tìm kiếm nhiều nhất để chọn nguồn tham khảo,
            ý tưởng nội dung và thị trường phù hợp.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[620px]">
          <select className="rounded-xl border bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100">
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
          <select className="rounded-xl border bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100">
            <option>Tất cả danh mục</option>
            <option>Creator</option>
            <option>Công nghệ</option>
            <option>Review</option>
            <option>Business</option>
          </select>
          <button className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700">
            Tìm trend
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 p-5 text-white">
          <p className="text-sm text-red-100">Trend nổi bật nhất</p>
          <h3 className="mt-3 text-2xl font-bold">{topTrend.keyword}</h3>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-red-100">Lượt tìm kiếm</p>
              <strong className="text-lg">{topTrend.searchVolume}</strong>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-red-100">Tăng trưởng</p>
              <strong className="text-lg">{topTrend.growth}</strong>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full border-collapse bg-white">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Từ khóa trend</th>
                <th className="px-4 py-3 font-semibold">Quốc gia</th>
                <th className="px-4 py-3 font-semibold">Danh mục</th>
                <th className="px-4 py-3 font-semibold">Search</th>
                <th className="px-4 py-3 font-semibold">Tăng trưởng</th>
                <th className="px-4 py-3 font-semibold">Cạnh tranh</th>
                <th className="px-4 py-3 font-semibold">Gợi ý</th>
              </tr>
            </thead>
            <tbody>
              {trendingKeywords.map((trend) => (
                <tr key={`${trend.country}-${trend.keyword}`} className="border-b transition hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-950">{trend.keyword}</td>
                  <td className="px-4 py-4 text-slate-600">{trend.country}</td>
                  <td className="px-4 py-4 text-slate-600">{trend.category}</td>
                  <td className="px-4 py-4 font-bold text-slate-950">{trend.searchVolume}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600">{trend.growth}</td>
                  <td className="px-4 py-4 text-slate-600">{trend.competition}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTrendSuggestionClass(trend.suggestion)}`}>
                      {trend.suggestion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
