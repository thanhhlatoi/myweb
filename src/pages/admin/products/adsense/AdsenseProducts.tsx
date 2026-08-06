import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { BadgeDollarSign, CheckCircle2, Globe2, Plus, Search, ShieldAlert, Upload, X } from "lucide-react";
import Pagination from "../../../../components/ui/Pagination";
import { paginate } from "../../../../utils/pagination";

type AdsenseStatus = "Live" | "Need verify" | "Hold";
type AdsenseAccount = { id: string; email: string; country: string; year: number; status: AdsenseStatus; price: number; note: string };
type AdsenseForm = Omit<AdsenseAccount, "id">;

const initialAccounts: AdsenseAccount[] = [
  { id: "ADS-001", email: "adsense.vn01@gmail.com", country: "Việt Nam", year: 2021, status: "Live", price: 1850000, note: "Đã PIN" },
  { id: "ADS-002", email: "adsense.us.trust@gmail.com", country: "United States", year: 2020, status: "Live", price: 3200000, note: "Trust cao" },
  { id: "ADS-003", email: "adsense.uk.verify@gmail.com", country: "United Kingdom", year: 2022, status: "Need verify", price: 2400000, note: "Cần verify phone" },
  { id: "ADS-004", email: "adsense.vn02@gmail.com", country: "Việt Nam", year: 2023, status: "Hold", price: 1600000, note: "Chờ review" },
];

const emptyForm: AdsenseForm = { email: "", country: "Việt Nam", year: 2024, status: "Need verify", price: 1800000, note: "" };

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function AdsenseProducts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdsenseAccount | null>(null);
  const [form, setForm] = useState<AdsenseForm>(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const countries = Array.from(new Set(accounts.map((item) => item.country)));
  const filteredAccounts = accounts.filter((account) => {
    const text = [account.id, account.email, account.country, account.status, account.note].join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) && (countryFilter === "all" || account.country === countryFilter);
  });
  const liveCount = accounts.filter((account) => account.status === "Live").length;
  const verifyCount = accounts.filter((account) => account.status !== "Live").length;
  const averagePrice = accounts.reduce((total, account) => total + account.price, 0) / accounts.length;
  const paginatedAccounts = paginate(filteredAccounts, page, pageSize);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (account: AdsenseAccount) => { setEditing(account); setForm({ email: account.email, country: account.country, year: account.year, status: account.status, price: account.price, note: account.note }); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.includes("@")) return;

    if (editing) {
      setAccounts((current) => current.map((item) => item.id === editing.id ? { ...editing, ...form } : item));
      setMessage(`Đã cập nhật ${editing.id}.`);
    } else {
      const next: AdsenseAccount = { ...form, id: `ADS-${String(accounts.length + 1).padStart(3, "0")}` };
      setAccounts((current) => [next, ...current]);
      setMessage(`Đã thêm nick Adsense ${next.email}.`);
    }
    closeModal();
  };

  const importDemo = () => {
    const next: AdsenseAccount = { id: `ADS-${String(accounts.length + 1).padStart(3, "0")}`, email: "import.adsense.demo@gmail.com", country: "Singapore", year: 2022, status: "Live", price: 2800000, note: "Import mẫu" };
    setAccounts((current) => [next, ...current]);
    setMessage("Đã import 1 nick Adsense mẫu vào danh sách.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950 to-yellow-600 p-6 text-white shadow-lg"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-200">GG Adsense Stock</p><h1 className="mt-3 text-3xl font-bold md:text-4xl">Nick GG Adsense</h1><p className="mt-2 max-w-2xl text-sm text-yellow-100">Quản lý nick Adsense theo quốc gia, năm tạo, trạng thái live, giá bán và ghi chú verify.</p></div><button type="button" onClick={openCreate} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-yellow-50"><Plus size={18} /> Thêm nick Adsense</button></div></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat label="Tổng nick" value={accounts.length.toString()} icon={BadgeDollarSign} color="text-yellow-600" /><Stat label="Nick live" value={liveCount.toString()} icon={CheckCircle2} color="text-emerald-600" /><Stat label="Cần verify" value={verifyCount.toString()} icon={ShieldAlert} color="text-amber-600" /><Stat label="Giá trung bình" value={formatCurrency(averagePrice)} icon={Globe2} color="text-slate-950" /></section>
      {message && <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm font-medium text-yellow-800">{message}</div>}
      <section className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="grid w-full gap-3 md:grid-cols-[1fr_220px] lg:max-w-2xl"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm email, quốc gia, trạng thái..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-yellow-300 focus:bg-white focus:ring-4 focus:ring-yellow-100" /></div><select value={countryFilter} onChange={(event) => { setCountryFilter(event.target.value); setPage(1); }} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-yellow-300 focus:bg-white focus:ring-4 focus:ring-yellow-100"><option value="all">Tất cả quốc gia</option>{countries.map((country) => <option key={country}>{country}</option>)}</select></div><div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={importDemo} className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"><Upload size={18} /> Import nick</button><button type="button" onClick={() => setMessage(`Đã chuẩn bị xuất ${filteredAccounts.length} nick Adsense.`)} className="rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white transition hover:bg-yellow-700">Xuất kho</button></div></div></section>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách nick Adsense</h2></div><div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Quốc gia</th><th className="px-4 py-3 font-semibold">Năm</th><th className="px-4 py-3 font-semibold">Giá</th><th className="px-4 py-3 font-semibold">Ghi chú</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody>{paginatedAccounts.map((account) => <tr key={account.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{account.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{account.email}</td><td className="px-4 py-4">{account.country}</td><td className="px-4 py-4">{account.year}</td><td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(account.price)}</td><td className="px-4 py-4 text-slate-600">{account.note}</td><td className="px-4 py-4"><StatusBadge status={account.status} /></td><td className="px-4 py-4"><button type="button" onClick={() => openEdit(account)} className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sửa</button></td></tr>)}</tbody></table></div><Pagination page={page} pageSize={pageSize} total={filteredAccounts.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} /></section>
      {isModalOpen && <AdsenseModal form={form} editing={editing} onChange={setForm} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof BadgeDollarSign; color: string }) { return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className={color} size={21} /></div><strong className={`mt-3 block text-2xl ${color}`}>{value}</strong></div>; }

function AdsenseModal({ form, editing, onChange, onClose, onSubmit }: { form: AdsenseForm; editing: AdsenseAccount | null; onChange: (form: AdsenseForm) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...form, [event.target.name]: event.target.name === "year" || event.target.name === "price" ? Number(event.target.value) : event.target.value } as AdsenseForm);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><h2 className="text-xl font-bold text-slate-950">{editing ? "Sửa nick Adsense" : "Thêm nick Adsense"}</h2><p className="mt-1 text-sm text-slate-500">Cập nhật thông tin tồn kho Adsense.</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="grid gap-4 p-5 md:grid-cols-2"><Field label="Email" name="email" value={form.email} onChange={handleChange} /><Field label="Quốc gia" name="country" value={form.country} onChange={handleChange} /><Field label="Năm tạo" name="year" value={form.year} onChange={handleChange} type="number" /><Field label="Giá" name="price" value={form.price} onChange={handleChange} type="number" /><Field label="Ghi chú" name="note" value={form.note} onChange={handleChange} /><div><label className="text-sm font-semibold text-slate-600">Trạng thái</label><select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-yellow-300 focus:bg-white focus:ring-4 focus:ring-yellow-100"><option>Live</option><option>Need verify</option><option>Hold</option></select></div></div><div className="flex justify-end gap-3 border-t bg-slate-50 p-5"><button type="button" onClick={onClose} className="rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700">Hủy</button><button type="submit" className="rounded-xl bg-yellow-600 px-5 py-3 font-semibold text-white">Lưu</button></div></form></div>;
}

function Field({ label, name, value, onChange, type = "text" }: { label: string; name: string; value: string | number; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) { return <div><label className="text-sm font-semibold text-slate-600">{label}</label><input type={type} name={name} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-yellow-300 focus:bg-white focus:ring-4 focus:ring-yellow-100" /></div>; }

function StatusBadge({ status }: { status: AdsenseStatus }) { const statusClass = status === "Live" ? "bg-emerald-100 text-emerald-700" : status === "Need verify" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>; }
