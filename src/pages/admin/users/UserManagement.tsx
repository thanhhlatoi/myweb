import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { LockKeyhole, Plus, Search, ShieldCheck, UserCheck, Users, X } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";
import { paginate } from "../../../utils/pagination";

type UserStatus = "Active" | "Pending" | "Locked";
type User = { id: string; name: string; email: string; role: string; team: string; status: UserStatus; lastLogin: string };
type UserForm = Omit<User, "id" | "status" | "lastLogin"> & { status: UserStatus };

const initialUsers: User[] = [
  { id: "USR-001", name: "Thanh Nguyen", email: "thanh@company.local", role: "Employee", team: "YouTube", status: "Active", lastLogin: "10 phút trước" },
  { id: "USR-002", name: "Minh Tran", email: "minh@company.local", role: "Manager", team: "Gmail", status: "Active", lastLogin: "1 giờ trước" },
  { id: "USR-003", name: "Lan Pham", email: "lan@company.local", role: "QC", team: "Content", status: "Pending", lastLogin: "Chưa đăng nhập" },
  { id: "USR-004", name: "Huy Le", email: "huy@company.local", role: "Support", team: "OTP", status: "Locked", lastLogin: "2 ngày trước" },
];

const emptyForm: UserForm = { name: "", email: "", role: "Employee", team: "YouTube", status: "Pending" };

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredUsers = users.filter((user) => {
    const text = [user.id, user.name, user.email, user.role, user.team, user.status].join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) && (roleFilter === "all" || user.role === roleFilter);
  });
  const roles = Array.from(new Set(users.map((user) => user.role)));
  const paginatedUsers = paginate(filteredUsers, page, pageSize);
  const roleSummary = [
    { label: "Tổng user", value: users.length.toString(), icon: Users, color: "text-blue-600" },
    { label: "Đang hoạt động", value: users.filter((user) => user.status === "Active").length.toString(), icon: UserCheck, color: "text-emerald-600" },
    { label: "Chờ duyệt", value: users.filter((user) => user.status === "Pending").length.toString(), icon: ShieldCheck, color: "text-amber-600" },
    { label: "Bị khóa", value: users.filter((user) => user.status === "Locked").length.toString(), icon: LockKeyhole, color: "text-red-600" },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes("@")) return;

    const nextUser: User = { ...form, id: `USR-${String(users.length + 1).padStart(3, "0")}`, lastLogin: "Chưa đăng nhập" };
    setUsers((current) => [nextUser, ...current]);
    setForm(emptyForm);
    setIsModalOpen(false);
    setMessage(`Đã thêm user ${nextUser.name}.`);
  };

  const updateStatus = (id: string, status: UserStatus) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user)));
    setSelectedUser((current) => (current?.id === id ? { ...current, status } : current));
    setMessage(`Đã cập nhật trạng thái ${id} thành ${status}.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">User Administration</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Quản lý người dùng</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Kiểm soát tài khoản, vai trò, team phụ trách và trạng thái truy cập của nhân sự.</p>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-blue-50">
            <Plus size={18} />
            Thêm user
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roleSummary.map((item) => {
          const Icon = item.icon;
          return <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{item.label}</p><Icon className={item.color} size={21} /></div><strong className={`mt-3 block text-2xl ${item.color}`}>{item.value}</strong></div>;
        })}
      </section>

      {message && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">{message}</div>}

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid w-full gap-3 md:grid-cols-[1fr_220px] lg:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm tên, email, role hoặc team..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
            </div>
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
              <option value="all">Tất cả vai trò</option>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => setMessage(`Đã chuẩn bị xuất ${filteredUsers.length} user ra file CSV.`)} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Xuất danh sách</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách người dùng</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Người dùng</th><th className="px-4 py-3 font-semibold">Vai trò</th><th className="px-4 py-3 font-semibold">Team</th><th className="px-4 py-3 font-semibold">Đăng nhập cuối</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead>
            <tbody>{paginatedUsers.map((user) => <UserRow key={user.id} user={user} onDetail={setSelectedUser} onStatus={updateStatus} />)}</tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={filteredUsers.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} />
      </section>

      {isModalOpen && <UserModal form={form} onChange={setForm} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
      {selectedUser && <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} onStatus={updateStatus} />}
    </div>
  );
}

function UserRow({ user, onDetail, onStatus }: { user: User; onDetail: (user: User) => void; onStatus: (id: string, status: UserStatus) => void }) {
  return (
    <tr className="border-b transition hover:bg-slate-50">
      <td className="px-4 py-4 font-medium text-slate-700">{user.id}</td>
      <td className="px-4 py-4"><p className="font-semibold text-slate-950">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></td>
      <td className="px-4 py-4">{user.role}</td>
      <td className="px-4 py-4">{user.team}</td>
      <td className="px-4 py-4 text-slate-600">{user.lastLogin}</td>
      <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
      <td className="px-4 py-4"><div className="flex gap-2"><button type="button" onClick={() => onDetail(user)} className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Chi tiết</button>{user.status === "Pending" && <button type="button" onClick={() => onStatus(user.id, "Active")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Duyệt</button>}{user.status === "Locked" ? <button type="button" onClick={() => onStatus(user.id, "Active")} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Mở</button> : <button type="button" onClick={() => onStatus(user.id, "Locked")} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Khóa</button>}</div></td>
    </tr>
  );
}

function UserModal({ form, onChange, onClose, onSubmit }: { form: UserForm; onChange: (form: UserForm) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...form, [event.target.name]: event.target.value });
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><h2 className="text-xl font-bold text-slate-950">Thêm user mới</h2><p className="mt-1 text-sm text-slate-500">Tạo tài khoản nhân sự trong giao diện admin.</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"><X size={20} /></button></div><div className="grid gap-4 p-5 md:grid-cols-2"><Field label="Họ tên" name="name" value={form.name} onChange={handleChange} /><Field label="Email" name="email" value={form.email} onChange={handleChange} /><Field label="Vai trò" name="role" value={form.role} onChange={handleChange} /><Field label="Team" name="team" value={form.team} onChange={handleChange} /><div><label className="text-sm font-semibold text-slate-600">Trạng thái</label><select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Pending</option><option>Active</option><option>Locked</option></select></div></div><div className="flex justify-end gap-3 border-t bg-slate-50 p-5"><button type="button" onClick={onClose} className="rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700">Hủy</button><button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Lưu user</button></div></form></div>;
}

function UserDetail({ user, onClose, onStatus }: { user: User; onClose: () => void; onStatus: (id: string, status: UserStatus) => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold text-slate-950">{user.name}</h2><p className="mt-1 text-sm text-slate-500">{user.email}</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"><X size={20} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Mã user" value={user.id} /><Info label="Vai trò" value={user.role} /><Info label="Team" value={user.team} /><Info label="Đăng nhập cuối" value={user.lastLogin} /></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => onStatus(user.id, "Active")} className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Duyệt/Mở khóa</button><button type="button" onClick={() => onStatus(user.id, "Locked")} className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white">Khóa user</button></div></div></div>;
}

function Field({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <div><label className="text-sm font-semibold text-slate-600">{label}</label><input name={name} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-950">{value}</p></div>;
}

function StatusBadge({ status }: { status: UserStatus }) {
  const statusClass = status === "Active" ? "bg-emerald-100 text-emerald-700" : status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>;
}
