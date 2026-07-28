import { LockKeyhole, Plus, Search, ShieldCheck, UserCheck, Users } from "lucide-react";

const users = [
  { id: "USR-001", name: "Thanh Nguyen", email: "thanh@company.local", role: "Employee", team: "YouTube", status: "Active", lastLogin: "10 phút trước" },
  { id: "USR-002", name: "Minh Tran", email: "minh@company.local", role: "Manager", team: "Gmail", status: "Active", lastLogin: "1 giờ trước" },
  { id: "USR-003", name: "Lan Pham", email: "lan@company.local", role: "QC", team: "Content", status: "Pending", lastLogin: "Chưa đăng nhập" },
  { id: "USR-004", name: "Huy Le", email: "huy@company.local", role: "Support", team: "OTP", status: "Locked", lastLogin: "2 ngày trước" },
];

const roleSummary = [
  { label: "Tổng user", value: users.length.toString(), icon: Users, color: "text-blue-600" },
  { label: "Đang hoạt động", value: users.filter((user) => user.status === "Active").length.toString(), icon: UserCheck, color: "text-emerald-600" },
  { label: "Chờ duyệt", value: users.filter((user) => user.status === "Pending").length.toString(), icon: ShieldCheck, color: "text-amber-600" },
  { label: "Bị khóa", value: users.filter((user) => user.status === "Locked").length.toString(), icon: LockKeyhole, color: "text-red-600" },
];

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">User Administration</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Quản lý người dùng</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Kiểm soát tài khoản, vai trò, team phụ trách và trạng thái truy cập của nhân sự.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-blue-50">
            <Plus size={18} />
            Thêm user
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roleSummary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <Icon className={item.color} size={21} />
              </div>
              <strong className={`mt-3 block text-2xl ${item.color}`}>{item.value}</strong>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Tìm tên, email, role hoặc team..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Lọc vai trò</button>
            <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Xuất danh sách</button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-bold text-slate-950">Danh sách người dùng</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã</th>
                <th className="px-4 py-3 font-semibold">Người dùng</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Đăng nhập cuối</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const statusClass = user.status === "Active" ? "bg-emerald-100 text-emerald-700" : user.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
                return (
                  <tr key={user.id} className="border-b transition hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-700">{user.id}</td>
                    <td className="px-4 py-4"><p className="font-semibold text-slate-950">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></td>
                    <td className="px-4 py-4">{user.role}</td>
                    <td className="px-4 py-4">{user.team}</td>
                    <td className="px-4 py-4 text-slate-600">{user.lastLogin}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{user.status}</span></td>
                    <td className="px-4 py-4"><button className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Chi tiết</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
