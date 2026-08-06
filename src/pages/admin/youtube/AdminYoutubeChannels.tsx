import { useState } from "react";
import { ExternalLink, PlaySquare, Search, ShieldCheck, UserCheck } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";
import { paginate } from "../../../utils/pagination";
import { getSubmittedYoutubeChannels, updateSubmittedYoutubeChannel } from "../../../utils/youtubeChannels";
import type { SubmittedYoutubeChannel } from "../../../utils/youtubeChannels";
import type { YoutubeChannelStage } from "../../../types/youtube";

type MonetizationFilter = "all" | "Enabled" | "Pending" | "Disabled";
type StageFilter = "all" | YoutubeChannelStage;
const channelStages: YoutubeChannelStage[] = ["Kênh trắng", "Kênh kiếm tiền", "Chờ đủ giờ", "Đang bấm"];

export default function AdminYoutubeChannels() {
  const [channels, setChannels] = useState<SubmittedYoutubeChannel[]>(() => getSubmittedYoutubeChannels());
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [monetizationFilter, setMonetizationFilter] = useState<MonetizationFilter>("all");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const owners = Array.from(new Set(channels.map((channel) => channel.owner)));
  const filteredChannels = channels.filter((channel) => {
    const matchesQuery = [channel.channelName, channel.handle, channel.channelUrl, channel.gmailEmail, channel.owner].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesOwner = ownerFilter === "all" || channel.owner === ownerFilter;
    const matchesMonetization = monetizationFilter === "all" || channel.monetization === monetizationFilter;
    const matchesStage = stageFilter === "all" || channel.channelStage === stageFilter;

    return matchesQuery && matchesOwner && matchesMonetization && matchesStage;
  });
  const paginatedChannels = paginate(filteredChannels, page, pageSize);
  const enabledCount = channels.filter((channel) => channel.monetization === "Enabled").length;
  const pendingCount = channels.filter((channel) => channel.monetization === "Pending").length;

  const updateChannel = (id: string, patch: Partial<SubmittedYoutubeChannel>) => {
    setChannels(updateSubmittedYoutubeChannel(id, patch));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-red-950 to-red-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">YouTube Channel Review</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Check kênh YouTube của user</h1>
            <p className="mt-2 max-w-2xl text-sm text-red-100">Xem tất cả kênh user gửi từ màn YouTube, lọc theo nhân viên và cập nhật trạng thái kiếm tiền.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur"><p className="text-sm text-red-100">Tổng kênh gửi</p><strong className="text-3xl">{channels.length}</strong></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Tổng kênh" value={channels.length.toString()} icon={PlaySquare} color="text-red-600" />
        <Stat label="Chờ check" value={pendingCount.toString()} icon={Search} color="text-amber-600" />
        <Stat label="Đã kiếm tiền" value={enabledCount.toString()} icon={ShieldCheck} color="text-emerald-600" />
        <Stat label="Số user" value={owners.length.toString()} icon={UserCheck} color="text-blue-600" />
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_220px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm kênh, Gmail, user..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100" /></div>
          <select value={ownerFilter} onChange={(event) => { setOwnerFilter(event.target.value); setPage(1); }} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"><option value="all">Tất cả user</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select>
          <select value={monetizationFilter} onChange={(event) => { setMonetizationFilter(event.target.value as MonetizationFilter); setPage(1); }} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"><option value="all">Tất cả kiếm tiền</option><option value="Pending">Pending</option><option value="Enabled">Enabled</option><option value="Disabled">Disabled</option></select>
          <select value={stageFilter} onChange={(event) => { setStageFilter(event.target.value as StageFilter); setPage(1); }} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"><option value="all">Tất cả loại kênh</option>{channelStages.map((stage) => <option key={stage}>{stage}</option>)}</select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách kênh user gửi</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Kênh</th><th className="px-4 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Gmail làm kênh</th><th className="px-4 py-3 font-semibold">Loại kênh</th><th className="px-4 py-3 font-semibold">Kiếm tiền</th><th className="px-4 py-3 font-semibold">Admin note</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody>{paginatedChannels.map((channel) => <tr key={channel.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-950">{channel.channelName}</p><p className="text-sm text-slate-500">{channel.handle}</p><p className="mt-1 text-xs text-slate-400">Gửi: {channel.submittedAt}</p></td><td className="px-4 py-4 font-semibold text-slate-700">{channel.owner}</td><td className="px-4 py-4"><p className="font-medium text-slate-700">{channel.gmailEmail}</p><p className="text-xs text-slate-400">{channel.gmailCode}</p></td><td className="px-4 py-4"><select value={channel.channelStage} onChange={(event) => updateChannel(channel.id, { channelStage: event.target.value as YoutubeChannelStage })} className="min-w-36 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100">{channelStages.map((stage) => <option key={stage}>{stage}</option>)}</select></td><td className="px-4 py-4"><select value={channel.monetization} onChange={(event) => updateChannel(channel.id, { monetization: event.target.value as SubmittedYoutubeChannel["monetization"], status: event.target.value === "Enabled" ? "Active" : event.target.value === "Disabled" ? "Suspended" : "Review" })} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"><option>Pending</option><option>Enabled</option><option>Disabled</option></select></td><td className="px-4 py-4"><input value={channel.adminNote} onChange={(event) => updateChannel(channel.id, { adminNote: event.target.value })} className="min-w-72 rounded-lg border bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100" /></td><td className="px-4 py-4"><a href={channel.channelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ExternalLink size={15} /> Mở kênh</a></td></tr>)}</tbody></table></div>
        <Pagination page={page} pageSize={pageSize} total={filteredChannels.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} />
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof PlaySquare; color: string }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className={color} size={21} /></div><strong className={`mt-3 block text-2xl ${color}`}>{value}</strong></div>;
}
