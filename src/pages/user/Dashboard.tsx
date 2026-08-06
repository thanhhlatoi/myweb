import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock3,
  Mail,
  PlaySquare,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Gmail được cấp",
    value: "128",
    change: "+12 tuần này",
    icon: Mail,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    label: "Kênh YouTube",
    value: "24",
    change: "18 kênh active",
    icon: PlaySquare,
    tone: "bg-red-50 text-red-600",
  },
  {
    label: "OTP hôm nay",
    value: "47",
    change: "92% thành công",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Lương tạm tính",
    value: "14.8M",
    change: "Cập nhật 09:30",
    icon: Wallet,
    tone: "bg-violet-50 text-violet-600",
  },
];

const tasks = [
  {
    title: "Kiểm tra 8 Gmail cần xác minh 2FA",
    time: "Ưu tiên cao",
    status: "Cần xử lý",
    color: "bg-red-100 text-red-700",
  },
  {
    title: "Cập nhật trạng thái kiếm tiền cho 3 kênh YouTube",
    time: "Trước 15:00",
    status: "Đang làm",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Đối soát OTP và chi phí thuê số trong ngày",
    time: "Cuối ca",
    status: "Chờ kiểm tra",
    color: "bg-blue-100 text-blue-700",
  },
];

const activities = [
  {
    title: "Admin cập nhật quy trình kiểm tra kênh",
    description: "Bổ sung bước kiểm tra cảnh cáo cộng đồng trước khi bàn giao.",
    time: "10 phút trước",
    icon: Bell,
  },
  {
    title: "Gmail VN-2043 đã được kích hoạt",
    description: "Tài khoản đã nhận đủ thông tin khôi phục và 2FA.",
    time: "32 phút trước",
    icon: CheckCircle2,
  },
  {
    title: "Một đơn OTP đã hết hạn",
    description: "Yêu cầu OTP-1004 cần thuê lại số mới nếu vẫn cần xác minh.",
    time: "1 giờ trước",
    icon: AlertTriangle,
  },
];

const progressItems = [
  { label: "Gmail hoàn tất", value: 82, color: "bg-blue-600" },
  { label: "Kênh đã kiểm tra", value: 68, color: "bg-red-600" },
  { label: "OTP thành công", value: 92, color: "bg-emerald-600" },
];

const quickActions = [
  { label: "Copy Gmail", path: "/gmail" },
  { label: "Thuê OTP", path: "/viotp" },
  { label: "Xem lương", path: "/salary" },
  { label: "Nguồn YTB", path: "/youtube-sources" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-lg">
        <div className="relative p-6 md:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">
                User Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Xin chào Thanh, hôm nay có nhiều việc cần xử lý.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Theo dõi nhanh Gmail, kênh YouTube, OTP, lương và các thông báo quan trọng trong cùng một màn hình.
              </p>
            </div>

            <div className="grid w-full gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur md:w-auto md:min-w-72">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Hiệu suất hôm nay</span>
                <span>86%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 w-[86%] rounded-full bg-blue-400" />
              </div>
              <p className="text-xs text-slate-400">12/14 đầu việc đã hoàn thành hoặc đang đúng tiến độ.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={`rounded-2xl p-3 ${item.tone}`}>
                  <Icon size={22} />
                </div>
                <ArrowUpRight className="text-slate-300" size={18} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
              <strong className="mt-2 block text-3xl text-slate-950">{item.value}</strong>
              <p className="mt-2 text-sm text-slate-500">{item.change}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Công việc hôm nay</h2>
              <p className="text-sm text-slate-500">Các tác vụ cần ưu tiên trong ca làm việc.</p>
            </div>
            <button className="w-fit rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Xem tất cả
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-950">{task.title}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={15} />
                    {task.time}
                  </p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${task.color}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Tiến độ module</h2>
          <p className="mt-1 text-sm text-slate-500">Tổng quan mức hoàn thành theo từng mảng.</p>

          <div className="mt-6 space-y-5">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-950">{item.value}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-100">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Thao tác nhanh</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <button key={action.label} onClick={() => navigate(action.path)} className="rounded-2xl border bg-slate-50 px-4 py-4 text-left font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Hoạt động gần đây</h2>
              <p className="text-sm text-slate-500">Thông báo và cập nhật mới nhất.</p>
            </div>
            <Bell className="text-slate-400" size={20} />
          </div>

          <div className="mt-5 space-y-4">
            {activities.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 h-fit rounded-xl bg-slate-100 p-2 text-slate-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{item.description}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
