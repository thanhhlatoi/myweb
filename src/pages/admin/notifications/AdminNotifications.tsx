import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Bell, Megaphone, Send, UserRound, Users } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";
import { paginate } from "../../../utils/pagination";
import { getStoredNotifications, saveNotification } from "../../../utils/notifications";
import type { AppNotification, NotificationAudience, NotificationPriority } from "../../../utils/notifications";

type NotificationForm = {
  title: string;
  message: string;
  audience: NotificationAudience;
  targetUser: string;
  type: string;
  priority: NotificationPriority;
};

const users = ["Thanh Nguyen", "Minh Tran", "Lan Pham", "Huy Le"];
const emptyForm: NotificationForm = {
  title: "",
  message: "",
  audience: "all",
  targetUser: users[0],
  type: "Admin",
  priority: "Bình thường",
};

export default function AdminNotifications() {
  const [form, setForm] = useState(emptyForm);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const paginatedNotifications = paginate(notifications, page, pageSize);
  const allCount = notifications.filter((item) => item.audience === "all").length;
  const userCount = notifications.filter((item) => item.audience === "user").length;
  const importantCount = notifications.filter((item) => item.priority === "Quan trọng").length;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    const nextNotification: AppNotification = {
      id: `NTF-${Date.now()}`,
      title: form.title,
      message: form.message,
      sender: "Admin System",
      time: new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
      type: form.type,
      priority: form.priority,
      unread: true,
      audience: form.audience,
      targetUser: form.audience === "user" ? form.targetUser : undefined,
    };

    saveNotification(nextNotification);
    setNotifications((current) => [nextNotification, ...current]);
    setForm(emptyForm);
    setPage(1);
    setMessage(form.audience === "all" ? "Đã gửi thông báo cho tất cả user." : `Đã gửi thông báo cho ${form.targetUser}.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Notification Broadcast</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Gửi thông báo</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Gửi thông báo cho tất cả nhân viên hoặc chọn riêng từng user để nhắc việc.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur"><p className="text-sm text-slate-300">Đã gửi</p><strong className="text-3xl">{notifications.length}</strong></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Tổng thông báo" value={notifications.length.toString()} icon={Bell} color="text-blue-600" />
        <Stat label="Gửi tất cả" value={allCount.toString()} icon={Users} color="text-emerald-600" />
        <Stat label="Gửi từng user" value={userCount.toString()} icon={UserRound} color="text-violet-600" />
        <Stat label="Quan trọng" value={importantCount.toString()} icon={Megaphone} color="text-red-600" />
      </section>

      {message && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">{message}</div>}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Soạn thông báo</h2>
          <div className="mt-5 space-y-4">
            <div><label className="text-sm font-semibold text-slate-600">Tiêu đề</label><input name="title" value={form.title} onChange={handleChange} placeholder="Nhập tiêu đề thông báo" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <div><label className="text-sm font-semibold text-slate-600">Nội dung</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Nhập nội dung cần gửi cho user" className="mt-2 min-h-32 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-sm font-semibold text-slate-600">Người nhận</label><select name="audience" value={form.audience} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option value="all">Tất cả user</option><option value="user">Từng user</option></select></div>
              <div><label className="text-sm font-semibold text-slate-600">Chọn user</label><select name="targetUser" value={form.targetUser} onChange={handleChange} disabled={form.audience === "all"} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60">{users.map((user) => <option key={user}>{user}</option>)}</select></div>
              <div><label className="text-sm font-semibold text-slate-600">Loại thông báo</label><select name="type" value={form.type} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Admin</option><option>Hệ thống</option><option>Cảnh báo kênh</option><option>Chính sách YouTube</option></select></div>
              <div><label className="text-sm font-semibold text-slate-600">Mức độ</label><select name="priority" value={form.priority} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Bình thường</option><option>Cảnh báo</option><option>Quan trọng</option></select></div>
            </div>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"><Send size={18} /> Gửi thông báo</button>
          </div>
        </form>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Lịch sử gửi thông báo</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Tiêu đề</th><th className="px-4 py-3 font-semibold">Người nhận</th><th className="px-4 py-3 font-semibold">Loại</th><th className="px-4 py-3 font-semibold">Mức độ</th><th className="px-4 py-3 font-semibold">Thời gian</th></tr></thead><tbody>{paginatedNotifications.map((item) => <tr key={item.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-950">{item.title}</p><p className="mt-1 max-w-sm truncate text-sm text-slate-500">{item.message}</p></td><td className="px-4 py-4">{item.audience === "all" ? "Tất cả user" : item.targetUser}</td><td className="px-4 py-4">{item.type}</td><td className="px-4 py-4"><PriorityBadge priority={item.priority} /></td><td className="px-4 py-4 text-slate-600">{item.time}</td></tr>)}</tbody></table></div>
          <Pagination page={page} pageSize={pageSize} total={notifications.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} />
        </section>
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Bell; color: string }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className={color} size={21} /></div><strong className={`mt-3 block text-2xl ${color}`}>{value}</strong></div>;
}

function PriorityBadge({ priority }: { priority: NotificationPriority }) {
  const className = priority === "Quan trọng" ? "bg-red-100 text-red-700" : priority === "Cảnh báo" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{priority}</span>;
}
