import { Award, CalendarDays, Download, Search, TrendingUp, UserCheck, Wallet } from "lucide-react";

const revenueRows = [
  {
    id: "NV-001",
    name: "Thanh Nguyen",
    role: "Account Manager",
    gmailRevenue: 84200000,
    adsenseRevenue: 126000000,
    viotpRevenue: 18400000,
    target: 210000000,
    commissionRate: 0.08,
    status: "Đạt KPI",
  },
  {
    id: "NV-002",
    name: "Minh Tran",
    role: "YouTube Operator",
    gmailRevenue: 38600000,
    adsenseRevenue: 74200000,
    viotpRevenue: 9600000,
    target: 150000000,
    commissionRate: 0.06,
    status: "Đang bám KPI",
  },
  {
    id: "NV-003",
    name: "Lan Pham",
    role: "Content QC",
    gmailRevenue: 25400000,
    adsenseRevenue: 46800000,
    viotpRevenue: 12200000,
    target: 90000000,
    commissionRate: 0.05,
    status: "Cần thúc đẩy",
  },
  {
    id: "NV-004",
    name: "Huy Le",
    role: "Support OTP",
    gmailRevenue: 14800000,
    adsenseRevenue: 18600000,
    viotpRevenue: 32600000,
    target: 70000000,
    commissionRate: 0.05,
    status: "Đạt KPI",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function UserRevenue() {
  const totalRevenue = revenueRows.reduce((total, row) => total + row.gmailRevenue + row.adsenseRevenue + row.viotpRevenue, 0);
  const totalCommission = revenueRows.reduce((total, row) => {
    const revenue = row.gmailRevenue + row.adsenseRevenue + row.viotpRevenue;
    return total + revenue * row.commissionRate;
  }, 0);
  const achievedCount = revenueRows.filter((row) => row.status === "Đạt KPI").length;
  const topUser = revenueRows.reduce((top, row) => {
    const currentRevenue = row.gmailRevenue + row.adsenseRevenue + row.viotpRevenue;
    const topRevenue = top.gmailRevenue + top.adsenseRevenue + top.viotpRevenue;
    return currentRevenue > topRevenue ? row : top;
  }, revenueRows[0]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-200">Revenue By User</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Doanh thu từng người</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100">
              Theo dõi doanh thu Gmail, Adsense, ViOTP, KPI và hoa hồng tạm tính của từng nhân sự trong tháng.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-emerald-50">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Tổng doanh thu</p><TrendingUp className="text-emerald-600" size={21} /></div><strong className="mt-3 block text-2xl text-slate-950">{formatCurrency(totalRevenue)}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Hoa hồng tạm tính</p><Wallet className="text-blue-600" size={21} /></div><strong className="mt-3 block text-2xl text-blue-600">{formatCurrency(totalCommission)}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Nhân sự đạt KPI</p><UserCheck className="text-violet-600" size={21} /></div><strong className="mt-3 block text-2xl text-violet-600">{achievedCount}/{revenueRows.length}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Top doanh thu</p><Award className="text-amber-600" size={21} /></div><strong className="mt-3 block text-xl text-amber-600">{topUser.name}</strong></div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Tìm nhân sự, mã hoặc vai trò..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"><CalendarDays size={18} /> Tháng 07/2026</button>
            <button className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700">Tính hoa hồng</button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Bảng doanh thu nhân sự</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="px-4 py-3 font-semibold">Mã NV</th><th className="px-4 py-3 font-semibold">Nhân sự</th><th className="px-4 py-3 font-semibold">Gmail</th><th className="px-4 py-3 font-semibold">Adsense</th><th className="px-4 py-3 font-semibold">ViOTP</th><th className="px-4 py-3 font-semibold">Tổng</th><th className="px-4 py-3 font-semibold">KPI</th><th className="px-4 py-3 font-semibold">Hoa hồng</th><th className="px-4 py-3 font-semibold">Trạng thái</th></tr>
            </thead>
            <tbody>
              {revenueRows.map((row) => {
                const revenue = row.gmailRevenue + row.adsenseRevenue + row.viotpRevenue;
                const kpiPercent = Math.round((revenue / row.target) * 100);
                const commission = revenue * row.commissionRate;
                const statusClass = row.status === "Đạt KPI" ? "bg-emerald-100 text-emerald-700" : row.status === "Đang bám KPI" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

                return (
                  <tr key={row.id} className="border-b transition hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-700">{row.id}</td>
                    <td className="px-4 py-4"><p className="font-semibold text-slate-950">{row.name}</p><p className="text-sm text-slate-500">{row.role}</p></td>
                    <td className="px-4 py-4">{formatCurrency(row.gmailRevenue)}</td>
                    <td className="px-4 py-4">{formatCurrency(row.adsenseRevenue)}</td>
                    <td className="px-4 py-4">{formatCurrency(row.viotpRevenue)}</td>
                    <td className="px-4 py-4 font-bold text-slate-950">{formatCurrency(revenue)}</td>
                    <td className="px-4 py-4"><div className="min-w-32"><div className="flex justify-between text-xs"><span>{kpiPercent}%</span><span>{formatCurrency(row.target)}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.min(kpiPercent, 100)}%` }} /></div></div></td>
                    <td className="px-4 py-4 font-semibold text-blue-600">{formatCurrency(commission)}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{row.status}</span></td>
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
