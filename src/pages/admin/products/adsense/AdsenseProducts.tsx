import { BadgeDollarSign, CheckCircle2, Globe2, Plus, Search, ShieldAlert } from "lucide-react";

const adsenseAccounts = [
  { id: "ADS-001", email: "adsense.vn01@gmail.com", country: "Việt Nam", year: 2021, status: "Live", price: 1850000, note: "Đã PIN" },
  { id: "ADS-002", email: "adsense.us.trust@gmail.com", country: "United States", year: 2020, status: "Live", price: 3200000, note: "Trust cao" },
  { id: "ADS-003", email: "adsense.uk.verify@gmail.com", country: "United Kingdom", year: 2022, status: "Need verify", price: 2400000, note: "Cần verify phone" },
  { id: "ADS-004", email: "adsense.vn02@gmail.com", country: "Việt Nam", year: 2023, status: "Hold", price: 1600000, note: "Chờ review" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function AdsenseProducts() {
  const liveCount = adsenseAccounts.filter((account) => account.status === "Live").length;
  const verifyCount = adsenseAccounts.filter((account) => account.status !== "Live").length;
  const averagePrice = adsenseAccounts.reduce((total, account) => total + account.price, 0) / adsenseAccounts.length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950 to-yellow-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-200">GG Adsense Stock</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Nick GG Adsense</h1>
            <p className="mt-2 max-w-2xl text-sm text-yellow-100">Quản lý nick Adsense theo quốc gia, năm tạo, trạng thái live, giá bán và ghi chú verify.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-yellow-50">
            <Plus size={18} />
            Thêm nick Adsense
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Tổng nick</p><BadgeDollarSign className="text-yellow-600" size={21} /></div><strong className="mt-3 block text-2xl text-slate-950">{adsenseAccounts.length}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Nick live</p><CheckCircle2 className="text-emerald-600" size={21} /></div><strong className="mt-3 block text-2xl text-emerald-600">{liveCount}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Cần verify</p><ShieldAlert className="text-amber-600" size={21} /></div><strong className="mt-3 block text-2xl text-amber-600">{verifyCount}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Giá trung bình</p><Globe2 className="text-blue-600" size={21} /></div><strong className="mt-3 block text-2xl text-slate-950">{formatCurrency(averagePrice)}</strong></div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Tìm email, quốc gia, trạng thái..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-yellow-300 focus:bg-white focus:ring-4 focus:ring-yellow-100" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Lọc quốc gia</button>
            <button className="rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white transition hover:bg-yellow-700">Import nick</button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Danh sách nick Adsense</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Quốc gia</th><th className="px-4 py-3 font-semibold">Năm</th><th className="px-4 py-3 font-semibold">Giá</th><th className="px-4 py-3 font-semibold">Ghi chú</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead>
            <tbody>
              {adsenseAccounts.map((account) => {
                const statusClass = account.status === "Live" ? "bg-emerald-100 text-emerald-700" : account.status === "Need verify" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
                return <tr key={account.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{account.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{account.email}</td><td className="px-4 py-4">{account.country}</td><td className="px-4 py-4">{account.year}</td><td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(account.price)}</td><td className="px-4 py-4 text-slate-600">{account.note}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{account.status}</span></td><td className="px-4 py-4"><button className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sửa</button></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
