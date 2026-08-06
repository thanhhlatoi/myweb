import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Activity, CalendarDays, Plus, RefreshCcw, Search, ShieldCheck, Smartphone, TrendingUp, Users, Wallet, X } from "lucide-react";
import Pagination from "../../../../components/ui/Pagination";
import { paginate } from "../../../../utils/pagination";
import { getViOtpRentals } from "../../../../utils/viotpRentals";

type ServiceStatus = "Active" | "Low stock" | "Paused";
type Service = { id: string; name: string; provider: string; price: number; stock: number; successRate: number; status: ServiceStatus };
type ServiceForm = Omit<Service, "id">;
type PeriodKey = "month" | "quarter" | "year";
type OtpRental = { id: string; user: string; service: string; phone: string; price: number; status: "Success" | "Timeout" | "Refunded"; rentedAt: string; month: number; quarter: number; year: number };

const initialServices: Service[] = [
  { id: "OTP-YTB", name: "YouTube", provider: "ViOTP", price: 1800, stock: 320, successRate: 96, status: "Active" },
  { id: "OTP-GML", name: "Gmail", provider: "ViOTP", price: 1500, stock: 540, successRate: 94, status: "Active" },
  { id: "OTP-TLG", name: "Telegram", provider: "ViOTP", price: 2500, stock: 80, successRate: 88, status: "Low stock" },
  { id: "OTP-FB", name: "Facebook", provider: "ViOTP", price: 2200, stock: 0, successRate: 73, status: "Paused" },
];

const initialRentals: OtpRental[] = [
  { id: "RENT-001", user: "Thanh Nguyen", service: "YouTube", phone: "+84901230001", price: 1800, status: "Success", rentedAt: "05/01/2026 09:20", month: 1, quarter: 1, year: 2026 },
  { id: "RENT-002", user: "Thanh Nguyen", service: "Gmail", phone: "+84901230002", price: 1500, status: "Success", rentedAt: "18/02/2026 11:10", month: 2, quarter: 1, year: 2026 },
  { id: "RENT-003", user: "Minh Tran", service: "YouTube", phone: "+84901230003", price: 1800, status: "Success", rentedAt: "08/03/2026 15:45", month: 3, quarter: 1, year: 2026 },
  { id: "RENT-004", user: "Lan Pham", service: "Telegram", phone: "+84901230004", price: 2500, status: "Timeout", rentedAt: "20/03/2026 16:30", month: 3, quarter: 1, year: 2026 },
  { id: "RENT-005", user: "Huy Le", service: "Facebook", phone: "+84901230005", price: 2200, status: "Refunded", rentedAt: "12/04/2026 08:05", month: 4, quarter: 2, year: 2026 },
  { id: "RENT-006", user: "Minh Tran", service: "Gmail", phone: "+84901230006", price: 1500, status: "Success", rentedAt: "25/04/2026 13:12", month: 4, quarter: 2, year: 2026 },
  { id: "RENT-007", user: "Thanh Nguyen", service: "YouTube", phone: "+84901230007", price: 1800, status: "Success", rentedAt: "11/05/2026 10:18", month: 5, quarter: 2, year: 2026 },
  { id: "RENT-008", user: "Lan Pham", service: "YouTube", phone: "+84901230008", price: 1800, status: "Success", rentedAt: "21/05/2026 17:02", month: 5, quarter: 2, year: 2026 },
  { id: "RENT-009", user: "Huy Le", service: "Telegram", phone: "+84901230009", price: 2500, status: "Success", rentedAt: "04/06/2026 09:48", month: 6, quarter: 2, year: 2026 },
  { id: "RENT-010", user: "Minh Tran", service: "YouTube", phone: "+84901230010", price: 1800, status: "Success", rentedAt: "14/06/2026 14:25", month: 6, quarter: 2, year: 2026 },
  { id: "RENT-011", user: "Thanh Nguyen", service: "Gmail", phone: "+84901230011", price: 1500, status: "Success", rentedAt: "06/07/2026 08:50", month: 7, quarter: 3, year: 2026 },
  { id: "RENT-012", user: "Lan Pham", service: "Facebook", phone: "+84901230012", price: 2200, status: "Timeout", rentedAt: "16/07/2026 20:15", month: 7, quarter: 3, year: 2026 },
  { id: "RENT-013", user: "Huy Le", service: "YouTube", phone: "+84901230013", price: 1800, status: "Success", rentedAt: "20/07/2026 12:22", month: 7, quarter: 3, year: 2026 },
  { id: "RENT-014", user: "Minh Tran", service: "Telegram", phone: "+84901230014", price: 2500, status: "Success", rentedAt: "27/07/2026 18:35", month: 7, quarter: 3, year: 2026 },
];

const emptyForm: ServiceForm = { name: "", provider: "ViOTP", price: 1500, stock: 100, successRate: 95, status: "Active" };

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function ViOtpProducts() {
  const [services, setServices] = useState(initialServices);
  const [rentals] = useState(() => [...getViOtpRentals().map((rental) => ({ ...rental, status: rental.status === "Waiting" ? "Timeout" : rental.status } as OtpRental)), ...initialRentals]);
  const [query, setQuery] = useState("");
  const [rentalQuery, setRentalQuery] = useState("");
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rentalPage, setRentalPage] = useState(1);
  const [rentalPageSize, setRentalPageSize] = useState(5);

  const filteredServices = services.filter((service) => [service.id, service.name, service.provider, service.status].join(" ").toLowerCase().includes(query.toLowerCase()));
  const paginatedServices = paginate(filteredServices, page, pageSize);
  const successfulRentals = rentals.filter((rental) => rental.status === "Success");
  const totalRevenue = successfulRentals.reduce((total, rental) => total + rental.price, 0);
  const monthRevenue = successfulRentals.filter((rental) => rental.month === 7 && rental.year === 2026).reduce((total, rental) => total + rental.price, 0);
  const quarterRevenue = successfulRentals.filter((rental) => rental.quarter === 3 && rental.year === 2026).reduce((total, rental) => total + rental.price, 0);
  const yearRevenue = successfulRentals.filter((rental) => rental.year === 2026).reduce((total, rental) => total + rental.price, 0);
  const userStats = getUserRentalStats(rentals).filter((row) => [row.user, row.topService].join(" ").toLowerCase().includes(rentalQuery.toLowerCase()));
  const paginatedUserStats = paginate(userStats, rentalPage, rentalPageSize);
  const revenueTrend = getRevenueTrend(successfulRentals, period);
  const totalStock = services.reduce((total, service) => total + service.stock, 0);
  const activeCount = services.filter((service) => service.status === "Active").length;
  const averageRate = Math.round(services.reduce((total, service) => total + service.successRate, 0) / services.length);
  const averagePrice = services.reduce((total, service) => total + service.price, 0) / services.length;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (service: Service) => { setEditing(service); setForm({ name: service.name, provider: service.provider, price: service.price, stock: service.stock, successRate: service.successRate, status: service.status }); setIsModalOpen(true); };
  const closeModal = () => { setEditing(null); setForm(emptyForm); setIsModalOpen(false); };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    if (editing) {
      setServices((current) => current.map((item) => item.id === editing.id ? { ...editing, ...form } : item));
      setMessage(`Đã cập nhật service ${editing.name}.`);
    } else {
      const next: Service = { ...form, id: `OTP-${form.name.slice(0, 3).toUpperCase() || services.length + 1}` };
      setServices((current) => [next, ...current]);
      setMessage(`Đã thêm service ${next.name}.`);
    }
    closeModal();
  };

  const syncApi = () => {
    setServices((current) => current.map((item) => ({ ...item, stock: item.status === "Paused" ? 0 : item.stock + 12, successRate: Math.min(99, item.successRate + 1) })));
    setMessage("Đã đồng bộ tồn kho và success rate từ API mẫu.");
  };

  const updatePrices = () => {
    setServices((current) => current.map((item) => ({ ...item, price: Math.round(item.price * 1.05) })));
    setMessage("Đã tăng bảng giá ViOTP thêm 5%.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-600 p-6 text-white shadow-lg"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">ViOTP Services</p><h1 className="mt-3 text-3xl font-bold md:text-4xl">Dịch vụ ViOTP</h1><p className="mt-2 max-w-2xl text-sm text-cyan-100">Quản lý service thuê số OTP, giá bán, tồn kho API và tỉ lệ nhận OTP thành công.</p></div><button type="button" onClick={openCreate} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-cyan-50"><Plus size={18} /> Thêm service</button></div></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat label="Service active" value={activeCount.toString()} icon={ShieldCheck} color="text-emerald-600" /><Stat label="Tổng số khả dụng" value={totalStock.toString()} icon={Smartphone} color="text-cyan-600" /><Stat label="Success rate TB" value={`${averageRate}%`} icon={Activity} color="text-blue-600" /><Stat label="Giá trung bình" value={formatCurrency(averagePrice)} icon={Wallet} color="text-slate-950" /></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat label="Doanh thu tháng 07" value={formatCurrency(monthRevenue)} icon={CalendarDays} color="text-emerald-600" /><Stat label="Doanh thu quý 3" value={formatCurrency(quarterRevenue)} icon={TrendingUp} color="text-blue-600" /><Stat label="Doanh thu năm 2026" value={formatCurrency(yearRevenue)} icon={Wallet} color="text-violet-600" /><Stat label="Tổng lượt thuê" value={rentals.length.toString()} icon={Users} color="text-slate-950" /></section>
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-bold text-slate-950">Dashboard tiền ViOTP</h2><p className="mt-1 text-sm text-slate-500">Theo dõi doanh thu theo tháng, quý hoặc năm.</p></div>
            <select value={period} onChange={(event) => setPeriod(event.target.value as PeriodKey)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"><option value="month">Theo tháng</option><option value="quarter">Theo quý</option><option value="year">Theo năm</option></select>
          </div>
          <div className="mt-6 space-y-4">
            {revenueTrend.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm"><span className="font-semibold text-slate-600">{item.label}</span><span className="font-bold text-slate-950">{formatCurrency(item.revenue)}</span></div>
                <div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-cyan-600" style={{ width: `${item.percent}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-800">Tổng doanh thu thành công: <strong>{formatCurrency(totalRevenue)}</strong>. Các giao dịch timeout/refund không tính vào doanh thu.</div>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Số lần thuê số theo user</h2><p className="mt-1 text-sm text-slate-500">Xem tổng lượt thuê, thuê thành công, lỗi và tổng tiền của từng user.</p></div><div className="relative w-full md:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={rentalQuery} onChange={(event) => { setRentalQuery(event.target.value); setRentalPage(1); }} placeholder="Tìm user hoặc service..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100" /></div></div></div>
          <div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Tổng thuê</th><th className="px-4 py-3 font-semibold">Thành công</th><th className="px-4 py-3 font-semibold">Timeout/Refund</th><th className="px-4 py-3 font-semibold">Tổng tiền</th><th className="px-4 py-3 font-semibold">Service dùng nhiều</th></tr></thead><tbody>{paginatedUserStats.map((row) => <tr key={row.user} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-semibold text-slate-950">{row.user}</td><td className="px-4 py-4">{row.totalRentals}</td><td className="px-4 py-4 font-semibold text-emerald-600">{row.successRentals}</td><td className="px-4 py-4 text-red-600">{row.failedRentals}</td><td className="px-4 py-4 font-bold text-slate-950">{formatCurrency(row.revenue)}</td><td className="px-4 py-4">{row.topService}</td></tr>)}</tbody></table></div>
          <Pagination page={rentalPage} pageSize={rentalPageSize} total={userStats.length} onPageChange={setRentalPage} onPageSizeChange={(nextPageSize) => { setRentalPageSize(nextPageSize); setRentalPage(1); }} />
        </section>
      </section>
      {message && <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-medium text-cyan-800">{message}</div>}
      <section className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full lg:max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm service, mã hoặc trạng thái..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100" /></div><div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={syncApi} className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"><RefreshCcw size={18} /> Đồng bộ API</button><button type="button" onClick={updatePrices} className="rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700">Cập nhật giá</button></div></div></section>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách service ViOTP</h2></div><div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Service</th><th className="px-4 py-3 font-semibold">Provider</th><th className="px-4 py-3 font-semibold">Giá</th><th className="px-4 py-3 font-semibold">Tồn kho</th><th className="px-4 py-3 font-semibold">Success</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody>{paginatedServices.map((service) => <tr key={service.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{service.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{service.name}</td><td className="px-4 py-4">{service.provider}</td><td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(service.price)}</td><td className="px-4 py-4">{service.stock}</td><td className="px-4 py-4 font-semibold text-cyan-700">{service.successRate}%</td><td className="px-4 py-4"><StatusBadge status={service.status} /></td><td className="px-4 py-4"><button type="button" onClick={() => openEdit(service)} className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sửa</button></td></tr>)}</tbody></table></div><Pagination page={page} pageSize={pageSize} total={filteredServices.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} /></section>
      {isModalOpen && <ServiceModal form={form} editing={editing} onChange={setForm} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof ShieldCheck; color: string }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className={color} size={21} /></div><strong className={`mt-3 block text-2xl ${color}`}>{value}</strong></div>;
}

function getUserRentalStats(rentals: OtpRental[]) {
  const users = Array.from(new Set(rentals.map((rental) => rental.user)));

  return users.map((user) => {
    const userRentals = rentals.filter((rental) => rental.user === user);
    const successfulRentals = userRentals.filter((rental) => rental.status === "Success");
    const serviceCounts = userRentals.reduce<Record<string, number>>((counts, rental) => ({ ...counts, [rental.service]: (counts[rental.service] ?? 0) + 1 }), {});
    const topService = Object.entries(serviceCounts).sort((first, second) => second[1] - first[1])[0]?.[0] ?? "Chưa có";

    return {
      user,
      totalRentals: userRentals.length,
      successRentals: successfulRentals.length,
      failedRentals: userRentals.length - successfulRentals.length,
      revenue: successfulRentals.reduce((total, rental) => total + rental.price, 0),
      topService,
    };
  }).sort((first, second) => second.revenue - first.revenue);
}

function getRevenueTrend(rentals: OtpRental[], period: PeriodKey) {
  const labels = period === "month"
    ? Array.from({ length: 12 }, (_, index) => ({ label: `Tháng ${index + 1}`, match: (rental: OtpRental) => rental.month === index + 1 && rental.year === 2026 }))
    : period === "quarter"
      ? Array.from({ length: 4 }, (_, index) => ({ label: `Quý ${index + 1}`, match: (rental: OtpRental) => rental.quarter === index + 1 && rental.year === 2026 }))
      : [{ label: "Năm 2026", match: (rental: OtpRental) => rental.year === 2026 }];
  const rows = labels.map((item) => ({ label: item.label, revenue: rentals.filter(item.match).reduce((total, rental) => total + rental.price, 0) }));
  const maxRevenue = Math.max(1, ...rows.map((row) => row.revenue));

  return rows.map((row) => ({ ...row, percent: Math.max(4, Math.round((row.revenue / maxRevenue) * 100)) }));
}

function ServiceModal({ form, editing, onChange, onClose, onSubmit }: { form: ServiceForm; editing: Service | null; onChange: (form: ServiceForm) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...form, [event.target.name]: event.target.name === "name" || event.target.name === "provider" || event.target.name === "status" ? event.target.value : Number(event.target.value) } as ServiceForm);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><h2 className="text-xl font-bold text-slate-950">{editing ? "Sửa service" : "Thêm service"}</h2><p className="mt-1 text-sm text-slate-500">Cập nhật giá, tồn kho và trạng thái ViOTP.</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="grid gap-4 p-5 md:grid-cols-2"><Field label="Tên service" name="name" value={form.name} onChange={handleChange} /><Field label="Provider" name="provider" value={form.provider} onChange={handleChange} /><Field label="Giá" name="price" value={form.price} onChange={handleChange} type="number" /><Field label="Tồn kho" name="stock" value={form.stock} onChange={handleChange} type="number" /><Field label="Success rate" name="successRate" value={form.successRate} onChange={handleChange} type="number" /><div><label className="text-sm font-semibold text-slate-600">Trạng thái</label><select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"><option>Active</option><option>Low stock</option><option>Paused</option></select></div></div><div className="flex justify-end gap-3 border-t bg-slate-50 p-5"><button type="button" onClick={onClose} className="rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700">Hủy</button><button type="submit" className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white">Lưu</button></div></form></div>;
}

function Field({ label, name, value, onChange, type = "text" }: { label: string; name: string; value: string | number; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <div><label className="text-sm font-semibold text-slate-600">{label}</label><input type={type} name={name} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100" /></div>;
}

function StatusBadge({ status }: { status: ServiceStatus }) {
  const statusClass = status === "Active" ? "bg-emerald-100 text-emerald-700" : status === "Low stock" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>;
}
