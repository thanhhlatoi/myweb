import { Award, CalendarDays, Download, Target, TrendingUp, Wallet } from "lucide-react";

const revenueItems = [
  { product: "Gmail", orders: 184, revenue: 84200000, commission: 6736000, color: "bg-blue-600" },
  { product: "Nick GG Adsense", orders: 42, revenue: 126000000, commission: 10080000, color: "bg-amber-500" },
  { product: "ViOTP", orders: 920, revenue: 18400000, commission: 1472000, color: "bg-emerald-600" },
];

const salaryHistory = [
  { month: "07/2026", baseSalary: 12000000, commission: 18288000, bonus: 2500000, deduction: 450000, status: "Chờ duyệt" },
  { month: "06/2026", baseSalary: 12000000, commission: 15420000, bonus: 1800000, deduction: 0, status: "Đã thanh toán" },
  { month: "05/2026", baseSalary: 12000000, commission: 13680000, bonus: 1200000, deduction: 300000, status: "Đã thanh toán" },
];

const recentOrders = [
  { id: "ORD-9012", product: "Nick GG Adsense US", value: 3200000, commission: 256000, time: "10 phút trước" },
  { id: "ORD-9011", product: "Gmail Việt Nam x50", value: 600000, commission: 48000, time: "38 phút trước" },
  { id: "ORD-9008", product: "ViOTP YouTube x120", value: 216000, commission: 17280, time: "1 giờ trước" },
  { id: "ORD-9001", product: "Gmail US Trust x20", value: 560000, commission: 44800, time: "3 giờ trước" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function SalaryPage() {
  const current = salaryHistory[0];
  const totalRevenue = revenueItems.reduce((total, item) => total + item.revenue, 0);
  const totalCommission = revenueItems.reduce((total, item) => total + item.commission, 0);
  const netSalary = current.baseSalary + current.commission + current.bonus - current.deduction;
  const target = 210000000;
  const kpiPercent = Math.round((totalRevenue / target) * 100);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-950 via-blue-900 to-sky-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">My Payroll</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Lương và doanh thu của tôi</h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-100">
              Theo dõi lương cơ bản, doanh thu tạo ra, hoa hồng tạm tính và trạng thái duyệt lương trong tháng.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
              <CalendarDays size={18} />
              Tháng 07/2026
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-sky-50">
              <Download size={18} />
              Tải phiếu lương
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Thực nhận dự kiến</p><Wallet className="text-blue-600" size={21} /></div><strong className="mt-3 block text-2xl text-slate-950">{formatCurrency(netSalary)}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Doanh thu tháng</p><TrendingUp className="text-emerald-600" size={21} /></div><strong className="mt-3 block text-2xl text-emerald-600">{formatCurrency(totalRevenue)}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Hoa hồng</p><Award className="text-amber-600" size={21} /></div><strong className="mt-3 block text-2xl text-amber-600">{formatCurrency(totalCommission)}</strong></div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">KPI doanh thu</p><Target className="text-violet-600" size={21} /></div><strong className="mt-3 block text-2xl text-violet-600">{kpiPercent}%</strong></div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Doanh thu theo sản phẩm</h2>
              <p className="text-sm text-slate-500">Hoa hồng được tính theo doanh thu từng nhóm sản phẩm.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">KPI {formatCurrency(target)}</span>
          </div>

          <div className="mt-5 space-y-5">
            {revenueItems.map((item) => {
              const percent = Math.round((item.revenue / totalRevenue) * 100);

              return (
                <div key={item.product} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950">{item.product}</h3>
                      <p className="text-sm text-slate-500">{item.orders} đơn hàng</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-bold text-slate-950">{formatCurrency(item.revenue)}</p>
                      <p className="text-sm font-semibold text-emerald-600">Hoa hồng {formatCurrency(item.commission)}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Cấu trúc lương tháng này</h2>
          <div className="mt-5 space-y-3">
            <SalaryLine label="Lương cơ bản" value={current.baseSalary} tone="text-slate-950" />
            <SalaryLine label="Hoa hồng doanh thu" value={current.commission} tone="text-emerald-600" />
            <SalaryLine label="Thưởng KPI" value={current.bonus} tone="text-blue-600" />
            <SalaryLine label="Khấu trừ" value={-current.deduction} tone="text-red-600" />
          </div>
          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Tổng thực nhận</p>
            <strong className="mt-2 block text-3xl">{formatCurrency(netSalary)}</strong>
            <p className="mt-2 text-sm text-slate-400">Trạng thái: {current.status}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Đơn hàng tính hoa hồng gần đây</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã đơn</th><th className="px-4 py-3 font-semibold">Sản phẩm</th><th className="px-4 py-3 font-semibold">Doanh thu</th><th className="px-4 py-3 font-semibold">Hoa hồng</th><th className="px-4 py-3 font-semibold">Thời gian</th></tr></thead>
              <tbody>{recentOrders.map((order) => <tr key={order.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{order.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{order.product}</td><td className="px-4 py-4">{formatCurrency(order.value)}</td><td className="px-4 py-4 text-emerald-600">{formatCurrency(order.commission)}</td><td className="px-4 py-4 text-slate-500">{order.time}</td></tr>)}</tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">Lịch sử lương</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Tháng</th><th className="px-4 py-3 font-semibold">Lương cứng</th><th className="px-4 py-3 font-semibold">Hoa hồng</th><th className="px-4 py-3 font-semibold">Thực nhận</th><th className="px-4 py-3 font-semibold">Trạng thái</th></tr></thead>
              <tbody>{salaryHistory.map((row) => { const net = row.baseSalary + row.commission + row.bonus - row.deduction; const statusClass = row.status === "Đã thanh toán" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"; return <tr key={row.month} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{row.month}</td><td className="px-4 py-4">{formatCurrency(row.baseSalary)}</td><td className="px-4 py-4 text-emerald-600">{formatCurrency(row.commission)}</td><td className="px-4 py-4 font-bold text-slate-950">{formatCurrency(net)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{row.status}</span></td></tr>; })}</tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function SalaryLine({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <span className="font-medium text-slate-600">{label}</span>
      <strong className={tone}>{formatCurrency(value)}</strong>
    </div>
  );
}
