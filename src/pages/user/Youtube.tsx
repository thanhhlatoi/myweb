import YoutubeCard from "../../components/youtube/YoutubeCard";
import YoutubeTable from "../../components/youtube/YoutubeTable";
import YoutubeToolbar from "../../components/youtube/YoutubeToolbar";
import { youtubeData } from "../../data/youtubeData";

export default function YoutubePage() {
  const totalSubscribers = youtubeData.reduce(
    (total, channel) => total + channel.subscribers,
    0
  );
  const totalMonthlyViews = youtubeData.reduce(
    (total, channel) => total + channel.monthlyViews,
    0
  );
  const activeChannels = youtubeData.filter(
    (channel) => channel.status === "Active"
  ).length;
  const monetizedChannels = youtubeData.filter(
    (channel) => channel.monetization === "Enabled"
  ).length;

  return (
    <div className="space-y-6 bg-slate-50 p-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-red-200">
              YouTube Studio
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Quản lý kênh YouTube
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Theo dõi trạng thái, lượt xem, subscriber và bật/tắt kiếm tiền cho
              toàn bộ kênh trong hệ thống.
            </p>
          </div>

          <button className="w-fit rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-red-50">
            Thêm kênh mới
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <YoutubeCard label="Tổng kênh" value={youtubeData.length.toString()} tone="red" />
        <YoutubeCard label="Kênh đang hoạt động" value={activeChannels.toString()} tone="green" />
        <YoutubeCard label="Tổng subscriber" value={totalSubscribers.toLocaleString("en-US")} tone="blue" />
        <YoutubeCard label="Views tháng này" value={totalMonthlyViews.toLocaleString("en-US")} tone="purple" />
      </div>

      <YoutubeToolbar monetizedChannels={monetizedChannels} />

      <YoutubeTable data={youtubeData} />
    </div>
  );
}
