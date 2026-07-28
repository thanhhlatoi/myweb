import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const adminMenu = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Người dùng", path: "/admin/users", icon: Users },
  { title: "Sản phẩm", path: "/admin/products", icon: Boxes },
  { title: "Doanh thu", path: "/admin/revenue", icon: ChartNoAxesCombined },
  { title: "Cài đặt", path: "/admin/settings", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/users": "Quản lý người dùng",
  "/admin/products": "Quản lý sản phẩm",
  "/admin/products/adsense": "Nick GG Adsense",
  "/admin/products/viotp": "Dịch vụ ViOTP",
  "/admin/products/gmail": "Kho Gmail",
  "/admin/revenue": "Doanh thu nhân sự",
  "/admin/settings": "Cài đặt hệ thống",
};

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Admin Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {isSidebarOpen && (
        <aside className="sticky top-0 flex h-dvh w-72 shrink-0 flex-col bg-slate-950 text-white">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-blue-600 p-2">
                  <ShieldCheck size={22} />
                </div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
              <p className="mt-2 text-xs text-slate-400">System Management</p>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Ẩn admin sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5">
            {adminMenu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.path !== "/admin/products"}
                  className={({ isActive }) =>
                    `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive || (item.path === "/admin/products" && location.pathname.startsWith("/admin/products"))
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-white/10 p-4">
            <div className="mb-4 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Trạng thái hệ thống</p>
              <div className="mt-3 flex items-center gap-2 text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold">Ổn định</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>
      )}

      <div className="min-h-screen min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((value) => !value)}
                className="rounded-xl border p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Bật tắt admin sidebar"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-950">{title}</h1>
                <p className="text-sm text-slate-500">Quản trị tài khoản, dịch vụ và vận hành hệ thống</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  placeholder="Tìm user, sản phẩm, cảnh báo..."
                  className="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button className="relative rounded-xl border p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                <Bell size={20} />
                <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">5</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left transition hover:bg-slate-50"
                >
                  <img src="https://i.pravatar.cc/48?img=12" alt="Admin avatar" className="h-9 w-9 rounded-full" />
                  <div className="hidden text-sm md:block">
                    <p className="font-semibold text-slate-950">Admin Thanh</p>
                    <p className="text-xs text-slate-500">Super Admin</p>
                  </div>
                  <ChevronDown className="hidden text-slate-400 md:block" size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border bg-white shadow-xl">
                    <div className="border-b p-4">
                      <p className="font-bold text-slate-950">Admin Thanh</p>
                      <p className="text-sm text-slate-500">admin@ytmanager.local</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/settings")}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Settings size={17} />
                      Cài đặt admin
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
