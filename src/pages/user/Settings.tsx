import {
  Bell,
  Camera,
  CheckCircle2,
  KeyRound,
  Mail,
  Save,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

const loginHistory = [
  {
    device: "Chrome on Windows",
    location: "Ha Noi, Viet Nam",
    time: "Hôm nay, 09:42",
    status: "Đang hoạt động",
  },
  {
    device: "Safari on iPhone",
    location: "Ho Chi Minh, Viet Nam",
    time: "Hôm qua, 21:16",
    status: "Đã đăng xuất",
  },
  {
    device: "Edge on Windows",
    location: "Da Nang, Viet Nam",
    time: "25/07/2026, 14:08",
    status: "Đã đăng xuất",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-200">
              User Settings
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Cài đặt thông tin người dùng
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Cập nhật hồ sơ cá nhân, bảo mật tài khoản và tuỳ chọn nhận thông
              báo trong hệ thống quản lý.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-indigo-50">
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="relative mx-auto h-28 w-28">
              <img
                src="https://i.pravatar.cc/120?img=12"
                alt="User avatar"
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <button className="absolute bottom-1 right-1 rounded-full bg-indigo-600 p-2 text-white shadow transition hover:bg-indigo-700">
                <Camera size={17} />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-950">Thanh Nguyen</h2>
            <p className="text-sm text-slate-500">Employee</p>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-left">
              <div className="flex items-center gap-2 font-semibold text-emerald-700">
                <CheckCircle2 size={18} />
                Tài khoản đã xác minh
              </div>
              <p className="mt-1 text-sm text-emerald-700">
                Email và số điện thoại đã được liên kết với tài khoản.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-950">
              <ShieldCheck size={19} />
              Bảo mật nhanh
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Xác thực 2 lớp</span>
                <span className="font-semibold text-emerald-600">Bật</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Đổi mật khẩu</span>
                <span className="font-semibold text-slate-950">30 ngày trước</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Phiên đăng nhập</span>
                <span className="font-semibold text-indigo-600">3 thiết bị</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <User size={20} />
              Thông tin cá nhân
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-600">Họ và tên</label>
                <input
                  defaultValue="Thanh Nguyen"
                  className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Tên hiển thị</label>
                <input
                  defaultValue="Thanh"
                  className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    defaultValue="thanh.nguyen@example.com"
                    className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Số điện thoại</label>
                <input
                  defaultValue="0987 654 321"
                  className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Vai trò</label>
                <input
                  defaultValue="Employee"
                  className="mt-2 w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Khu vực</label>
                <select className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100">
                  <option>Ha Noi</option>
                  <option>Ho Chi Minh</option>
                  <option>Da Nang</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                <KeyRound size={20} />
                Đổi mật khẩu
              </h2>

              <div className="mt-5 space-y-4">
                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
                <button className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                <Bell size={20} />
                Thông báo
              </h2>

              <div className="mt-5 space-y-4">
                {[
                  "Thông báo khi có đơn OTP mới",
                  "Thông báo trạng thái kênh YouTube",
                  "Nhắc duyệt bảng lương",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
                  >
                    {label}
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-indigo-600" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                <Settings size={20} />
                Lịch sử đăng nhập
              </h2>
            </div>

            <div className="divide-y">
              {loginHistory.map((item) => (
                <div key={`${item.device}-${item.time}`} className="flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{item.device}</p>
                    <p className="text-sm text-slate-500">{item.location}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm font-medium text-slate-700">{item.time}</p>
                    <p className={item.status === "Đang hoạt động" ? "text-sm font-semibold text-emerald-600" : "text-sm text-slate-500"}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
