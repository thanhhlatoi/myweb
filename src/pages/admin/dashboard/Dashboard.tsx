import { AlertTriangle, ArrowUpRight, Boxes, CheckCircle2, Clock3, DollarSign, Server, Users } from "lucide-react";

const stats = [
  { label: "Tổng user", value: "1,284", change: "+36 hôm nay", icon: Users, tone: "bg-blue-50 text-blue-600" },
  { label: "Dịch vụ active", value: "18", change: "4 nhóm dịch vụ", icon: Boxes, tone: "bg-violet-50 text-violet-600" },
  { label: "Doanh thu tháng", value: "248M", change: "+18.4%", icon: DollarSign, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Cảnh báo", value: "7", change: "2 mức cao", icon: AlertTriangle, tone: "bg-red-50 text-red-600" },
];

const serviceHealth = [
  { name: "Gmail Pool", value: 88, color: "bg-blue-600" },
  { name: "YouTube Tracking", value: 74, color: "bg-red-600" },
  { name: "ViOTP Gateway", value: 96, color: "bg-emerald-600" },
  { name: "Payroll Sync", value: 69, color: "bg-violet-600" },
];

const alerts = [
  { title: "Gmail tồn kho thấp", message: "Kho Gmail US chỉ còn 42 tài khoản khả dụng.", time: "12 phút trước", level: "Cao" },
  { title: "Kênh YouTube cần review", message: "5 kênh có trạng thái cảnh báo bản quyền.", time: "34 phút trước", level: "Vừa" },
  { title: "OTP timeout tăng", message: "Tỉ lệ timeout tăng 3.2% so với hôm qua.", time: "1 giờ trước", level: "Vừa" },
];

const operations = [
  { title: "Duyệt 12 tài khoản nhân sự mới", status: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
  { title: "Cập nhật bảng giá thuê OTP", status: "Đang xử lý", color: "bg-blue-100 text-blue-700" },
  { title: "Kiểm tra quyền truy cập admin", status: "Hoàn tất", color: "bg-emerald-100 text-emerald-700" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-lg">
        <div className="relative p-6 md:p-8">
          <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Admin Control Center</p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">Tổng quan vận hành hệ thống</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Theo dõi người dùng, dịch vụ, doanh thu, cảnh báo và tình trạng vận hành trong cùng một màn hình.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">System uptime</p>
              <strong className="mt-2 block text-3xl">99.98%</strong>
              <p className="mt-2 flex items-center gap-2 text-sm text-emerald-300"><Server size={16} /> Tất cả service online</p>
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
                <div className={`rounded-2xl p-3 ${item.tone}`}><Icon size={22} /></div>
                <ArrowUpRight className="text-slate-300" size={18} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
              <strong className="mt-2 block text-3xl text-slate-950">{item.value}</strong>
              <p className="mt-2 text-sm text-slate-500">{item.change}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Sức khỏe dịch vụ</h2>
          <p className="mt-1 text-sm text-slate-500">Tình trạng hoạt động của các module chính.</p>
          <div className="mt-6 space-y-5">
            {serviceHealth.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{item.name}</span>
                  <span className="font-bold text-slate-950">{item.value}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Cảnh báo mới</h2>
          <div className="mt-5 space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="h-fit rounded-xl bg-red-100 p-2 text-red-600"><AlertTriangle size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-950">{alert.title}</h3>
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">{alert.level}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400"><Clock3 size={13} /> {alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Việc vận hành</h2>
            <p className="text-sm text-slate-500">Các đầu việc admin cần theo dõi trong ngày.</p>
          </div>
          <button className="w-fit rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Tạo tác vụ</button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {operations.map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
              <CheckCircle2 className="text-slate-400" size={20} />
              <h3 className="mt-3 font-semibold text-slate-950">{item.title}</h3>
              <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
