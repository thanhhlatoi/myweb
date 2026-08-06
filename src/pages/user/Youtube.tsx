import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, ExternalLink, Link2, Mail, Send, ShieldCheck } from "lucide-react";
import YoutubeCard from "../../components/youtube/YoutubeCard";
import { getAssignedGmailsForUser, getCurrentUserName } from "../../utils/gmailAssignments";
import { extractYoutubeHandle, getSubmittedYoutubeChannelsByUser, saveSubmittedYoutubeChannel, updateSubmittedYoutubeChannel } from "../../utils/youtubeChannels";
import type { SubmittedYoutubeChannel } from "../../utils/youtubeChannels";
import type { YoutubeChannelStage } from "../../types/youtube";

const channelStages: YoutubeChannelStage[] = ["Kênh trắng", "Kênh kiếm tiền", "Chờ đủ giờ", "Đang bấm"];

export default function YoutubePage() {
  const currentUserName = getCurrentUserName();
  const assignedGmails = getAssignedGmailsForUser(currentUserName);
  const [channels, setChannels] = useState<SubmittedYoutubeChannel[]>(() => getSubmittedYoutubeChannelsByUser(currentUserName));
  const [selectedGmailCode, setSelectedGmailCode] = useState(assignedGmails[0]?.code ?? "");
  const [channelUrl, setChannelUrl] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelStage, setChannelStage] = useState<YoutubeChannelStage>("Kênh trắng");
  const [message, setMessage] = useState("");
  const pendingCount = channels.filter((channel) => channel.status === "Review").length;
  const approvedCount = channels.filter((channel) => channel.monetization === "Enabled").length;
  const selectedGmail = assignedGmails.find((gmail) => gmail.code === selectedGmailCode);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGmail || !channelUrl.trim()) return;

    const handle = extractYoutubeHandle(channelUrl);
    const nextChannel: SubmittedYoutubeChannel = {
      id: `YT-${String(channels.length + 1).padStart(3, "0")}`,
      channelName: channelName.trim() || handle.replace("@", ""),
      handle,
      channelUrl: channelUrl.trim(),
      channelStage,
      gmailCode: selectedGmail.code,
      gmailEmail: selectedGmail.email,
      submittedAt: new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
      adminNote: "Chờ admin kiểm tra kênh kiếm tiền",
      subscribers: 0,
      videos: 0,
      monthlyViews: 0,
      monetization: "Pending",
      status: "Review",
      owner: currentUserName,
    };

    saveSubmittedYoutubeChannel(nextChannel);
    setChannels((current) => [nextChannel, ...current]);
    setChannelUrl("");
    setChannelName("");
    setChannelStage("Kênh trắng");
    setMessage("Đã gửi kênh cho admin kiểm tra.");
  };

  const handleUpdateChannelStage = (id: string, nextStage: YoutubeChannelStage) => {
    const nextChannels = updateSubmittedYoutubeChannel(id, { channelStage: nextStage });
    setChannels(nextChannels.filter((channel) => channel.owner.toLowerCase() === currentUserName.toLowerCase()));
    setMessage("Đã cập nhật loại kênh. Admin sẽ thấy thay đổi này.");
  };

  return (
    <div className="space-y-6 bg-slate-50 p-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-red-200">YouTube Monetization</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Gửi kênh kiếm tiền</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Chọn Gmail admin đã cấp, dán link kênh YouTube và gửi cho admin kiểm tra. Người dùng chỉ cần nhập ít nhất có thể.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur"><p className="text-sm text-slate-300">Gmail được cấp</p><strong className="text-3xl">{assignedGmails.length}</strong></div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <YoutubeCard label="Kênh đã gửi" value={channels.length.toString()} tone="red" />
        <YoutubeCard label="Chờ admin check" value={pendingCount.toString()} tone="blue" />
        <YoutubeCard label="Đã bật kiếm tiền" value={approvedCount.toString()} tone="green" />
        <YoutubeCard label="Gmail khả dụng" value={assignedGmails.length.toString()} tone="purple" />
      </div>

      {message && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-800">{message}</div>}

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Nhập kênh mới</h2>
          <p className="mt-1 text-sm text-slate-500">Bắt buộc chỉ cần chọn Gmail và nhập link kênh. Tên kênh có thể bỏ trống.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Gmail dùng làm kênh</label>
              <select value={selectedGmailCode} onChange={(event) => setSelectedGmailCode(event.target.value)} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100">
                {assignedGmails.length > 0 ? assignedGmails.map((gmail) => <option key={gmail.code} value={gmail.code}>{gmail.email}</option>) : <option value="">Chưa có Gmail admin cấp</option>}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Link kênh YouTube</label>
              <div className="relative mt-2"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={channelUrl} onChange={(event) => setChannelUrl(event.target.value)} placeholder="https://www.youtube.com/@tenkenh" className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100" /></div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Tên kênh nếu muốn ghi chú</label>
              <input value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="Có thể bỏ trống, hệ thống lấy từ link" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Loại/trạng thái kênh</label>
              <select value={channelStage} onChange={(event) => setChannelStage(event.target.value as YoutubeChannelStage)} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100">
                {channelStages.map((stage) => <option key={stage}>{stage}</option>)}
              </select>
            </div>

            {selectedGmail && <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><Mail className="mr-2 inline text-red-600" size={17} />Gmail chọn: <strong>{selectedGmail.email}</strong> | Trạng thái: <strong>{selectedGmail.usageStatus === "in_use" ? "Đang dùng" : "Đã giao"}</strong></div>}

            <button type="submit" disabled={!selectedGmail || !channelUrl.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"><Send size={18} /> Gửi admin kiểm tra</button>
          </div>
        </form>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Kênh đã gửi của bạn</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Kênh</th><th className="px-4 py-3 font-semibold">Gmail</th><th className="px-4 py-3 font-semibold">Loại kênh</th><th className="px-4 py-3 font-semibold">Kiếm tiền</th><th className="px-4 py-3 font-semibold">Admin check</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody>{channels.map((channel) => <tr key={channel.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-950">{channel.channelName}</p><p className="text-sm text-slate-500">{channel.handle}</p></td><td className="px-4 py-4"><p className="font-medium text-slate-700">{channel.gmailEmail}</p><p className="text-xs text-slate-400">{channel.gmailCode}</p></td><td className="px-4 py-4"><select value={channel.channelStage} onChange={(event) => handleUpdateChannelStage(channel.id, event.target.value as YoutubeChannelStage)} className="min-w-36 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100">{channelStages.map((stage) => <option key={stage}>{stage}</option>)}</select></td><td className="px-4 py-4"><StatusBadge label={channel.monetization} /></td><td className="px-4 py-4"><p className="text-sm text-slate-600">{channel.adminNote}</p><p className="mt-1 text-xs text-slate-400">{channel.submittedAt}</p></td><td className="px-4 py-4"><a href={channel.channelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ExternalLink size={15} /> Mở</a></td></tr>)}</tbody></table></div>
          {channels.length === 0 && <div className="p-6 text-sm text-slate-500">Chưa có kênh nào được gửi. Hãy chọn Gmail và dán link kênh YouTube.</div>}
        </section>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><ShieldCheck size={20} /> Luồng xử lý đề xuất</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Step title="1. Admin cấp Gmail" description="Gmail được chuyển từ kho Gmail sang user." />
          <Step title="2. User dán link kênh" description="User chỉ chọn Gmail và nhập link kênh kiếm tiền." />
          <Step title="3. Admin check" description="Admin xem tất cả kênh trong màn quản lý YouTube admin." />
        </div>
      </section>
    </div>
  );
}

function Step({ title, description }: { title: string; description: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><CheckCircle2 className="text-emerald-600" size={20} /><h3 className="mt-3 font-bold text-slate-950">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></div>;
}

function StatusBadge({ label }: { label: string }) {
  const className = label === "Enabled" ? "bg-emerald-100 text-emerald-700" : label === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}
