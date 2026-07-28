import { Activity, Plus, Search, ShieldCheck, Smartphone, Wallet } from "lucide-react";

const viotpServices = [
  { id: "OTP-YTB", name: "YouTube", provider: "ViOTP", price: 1800, stock: 320, successRate: 96, status: "Active" },
  { id: "OTP-GML", name: "Gmail", provider: "ViOTP", price: 1500, stock: 540, successRate: 94, status: "Active" },
  { id: "OTP-TLG", name: "Telegram", provider: "ViOTP", price: 2500, stock: 80, successRate: 88, status: "Low stock" },
  { id: "OTP-FB", name: "Facebook", provider: "ViOTP", price: 2200, stock: 0, successRate: 73, status: "Paused" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function ViOtpProducts() {
  const totalStock = viotpServices.reduce((total, service) => total + service.stock, 0);
  const activeCount = viotpServices.filter((service) => service.status === "Active").length;
  const averageRate = Math.round(viotpServices.reduce((total, service) => total + service.successRate, 0) / viotpServices.length);
  const averagePrice = viotpServices.reduce((total, service) => total + service.price, 0) / viotpServices.length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">ViOTP Services</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Dịch vụ ViOTP</h1>
            <p className="mt-2 max-w-2xl text-sm text-cyan-100">Quản lý các service thuê số OTP, giá bán, tồn kho API và tỉ lệ nhận OTP thành công.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-cyan-50"><Plus size={18} /> Thêm service</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Service active</p><ShieldCheck className="text-emerald-600" size={21} /></div><strong className="mt-3 block text-2xl text-emerald-600">{activeCount}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Tổng số khả dụng</p><Smartphone className="text-cyan-600" size={21} /></div><strong className="mt-3 block text-2xl text-cyan-600">{totalStock}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Success rate TB</p><Activity className="text-blue-600" size={21} /></div><strong className="mt-3 block text-2xl text-blue-600">{averageRate}%</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Giá trung bình</p><Wallet className="text-violet-600" size={21} /></div><strong className="mt-3 block text-2xl text-slate-950">{formatCurrency(averagePrice)}</strong></div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full lg:max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input placeholder="Tìm service, mã hoặc trạng thái..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100" /></div><div className="flex flex-col gap-3 sm:flex-row"><button className="rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Đồng bộ API</button><button className="rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700">Cập nhật giá</button></div></div></section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách service ViOTP</h2></div><div className="overflow-x-auto"><table className="min-w-full border-collapse"><thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Service</th><th className="px-4 py-3 font-semibold">Provider</th><th className="px-4 py-3 font-semibold">Giá</th><th className="px-4 py-3 font-semibold">Tồn kho</th><th className="px-4 py-3 font-semibold">Success</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody>{viotpServices.map((service) => { const statusClass = service.status === "Active" ? "bg-emerald-100 text-emerald-700" : service.status === "Low stock" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"; return <tr key={service.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{service.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{service.name}</td><td className="px-4 py-4">{service.provider}</td><td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(service.price)}</td><td className="px-4 py-4">{service.stock}</td><td className="px-4 py-4 font-semibold text-cyan-700">{service.successRate}%</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{service.status}</span></td><td className="px-4 py-4"><button className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sửa</button></td></tr>; })}</tbody></table></div></section>
    </div>
  );
}
