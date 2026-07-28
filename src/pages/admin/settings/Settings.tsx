import { Bell, Database, KeyRound, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";

const settingsGroups = [
  {
    title: "Bảo mật",
    description: "Thiết lập đăng nhập, phiên làm việc và xác thực admin.",
    icon: ShieldCheck,
    items: ["Bật xác thực 2 lớp cho admin", "Tự động đăng xuất sau 30 phút", "Khóa tài khoản sau 5 lần sai mật khẩu"],
  },
  {
    title: "Thông báo",
    description: "Quản lý cảnh báo vận hành và email hệ thống.",
    icon: Bell,
    items: ["Cảnh báo tồn kho thấp", "Cảnh báo OTP timeout", "Gửi báo cáo cuối ngày"],
  },
  {
    title: "Dữ liệu",
    description: "Đồng bộ, backup và giữ lịch sử thao tác.",
    icon: Database,
    items: ["Backup tự động mỗi ngày", "Lưu log thao tác admin", "Đồng bộ dữ liệu lương"],
  },
];

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">System Settings</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Cài đặt hệ thống</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Cấu hình bảo mật, thông báo, dữ liệu và quyền truy cập cho khu vực admin.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-blue-50">
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><KeyRound size={20} /> Thông tin admin</h2>
          <div className="mt-5 space-y-4">
            <div><label className="text-sm font-semibold text-slate-600">Tên hiển thị</label><input defaultValue="Admin Thanh" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <div><label className="text-sm font-semibold text-slate-600">Email admin</label><input defaultValue="admin@ytmanager.local" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <div><label className="text-sm font-semibold text-slate-600">Vai trò mặc định</label><select className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Super Admin</option><option>Manager</option><option>Operator</option></select></div>
          </div>
        </div>

        <div className="space-y-4">
          {settingsGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex gap-3">
                  <div className="h-fit rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon size={21} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">{group.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{group.description}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <label key={item} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                      <span className="font-medium text-slate-700">{item}</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><SlidersHorizontal size={20} /> Cấu hình nhanh</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Giới hạn tạo Gmail/ngày</p><strong className="mt-2 block text-2xl text-slate-950">500</strong></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Ngưỡng cảnh báo OTP</p><strong className="mt-2 block text-2xl text-amber-600">10%</strong></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Thời gian giữ log</p><strong className="mt-2 block text-2xl text-blue-600">90 ngày</strong></div>
        </div>
      </section>
    </div>
  );
}
