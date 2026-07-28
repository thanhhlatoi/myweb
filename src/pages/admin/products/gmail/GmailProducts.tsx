import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  Globe2,
  Mail,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

type TabKey = "overview" | "warehouse" | "checker" | "issues" | "imports";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "warehouse", label: "Kho Gmail" },
  { key: "checker", label: "Kiểm tra mail" },
  { key: "issues", label: "Lỗi/cần xử lý" },
  { key: "imports", label: "Lịch sử nhập kho" },
];

const gmailPackages = [
  { id: "GML-VN", name: "Gmail Việt Nam", country: "Việt Nam", type: "Normal", stock: 2800, live: 2650, price: 12000, status: "Active" },
  { id: "GML-US", name: "Gmail US Trust", country: "United States", type: "Trust", stock: 760, live: 724, price: 28000, status: "Active" },
  { id: "GML-PVA", name: "Gmail PVA Phone", country: "Mix", type: "Phone verified", stock: 940, live: 895, price: 18000, status: "Active" },
  { id: "GML-OLD", name: "Gmail 2018-2020", country: "Mix", type: "Old", stock: 36, live: 28, price: 35000, status: "Low stock" },
];

const emailAccounts = [
  { code: "GM-10001", email: "work.vn001@gmail.com", package: "Gmail Việt Nam", password: "********", twoFa: "JBSW Y3DP ****", recovery: "live", status: "Live", lastCheck: "5 phút trước", note: "Sẵn sàng cấp" },
  { code: "GM-10002", email: "trust.us452@gmail.com", package: "Gmail US Trust", password: "********", twoFa: "KJHG 62LA ****", recovery: "live", status: "Live", lastCheck: "12 phút trước", note: "Trust cao" },
  { code: "GM-10003", email: "pva.mix209@gmail.com", package: "Gmail PVA Phone", password: "********", twoFa: "MNBV 77TR ****", recovery: "missing", status: "Need recovery", lastCheck: "38 phút trước", note: "Thiếu mail khôi phục" },
  { code: "GM-10004", email: "old.stock018@gmail.com", package: "Gmail 2018-2020", password: "********", twoFa: "QWER 11ZX ****", recovery: "live", status: "Locked", lastCheck: "1 giờ trước", note: "Login bị checkpoint" },
  { code: "GM-10005", email: "work.vn884@gmail.com", package: "Gmail Việt Nam", password: "********", twoFa: "PLMK 90YT ****", recovery: "live", status: "Sold", lastCheck: "Hôm qua", note: "Đã xuất kho" },
];

const checkQueue = [
  { batch: "CHK-0728-01", target: "Gmail Việt Nam", total: 500, checked: 420, live: 398, error: 22, status: "Đang kiểm tra" },
  { batch: "CHK-0728-02", target: "Gmail US Trust", total: 200, checked: 200, live: 192, error: 8, status: "Hoàn tất" },
  { batch: "CHK-0728-03", target: "Gmail 2018-2020", total: 36, checked: 18, live: 14, error: 4, status: "Đang kiểm tra" },
];

const importHistory = [
  { id: "IMP-901", file: "gmail-vn-2807.csv", package: "Gmail Việt Nam", total: 1200, success: 1184, failed: 16, time: "09:30 28/07/2026" },
  { id: "IMP-900", file: "gmail-us-trust.csv", package: "Gmail US Trust", total: 300, success: 300, failed: 0, time: "18:20 27/07/2026" },
  { id: "IMP-899", file: "gmail-old-stock.xlsx", package: "Gmail 2018-2020", total: 80, success: 72, failed: 8, time: "14:05 27/07/2026" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function GmailProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const totalStock = gmailPackages.reduce((total, item) => total + item.stock, 0);
  const totalLive = gmailPackages.reduce((total, item) => total + item.live, 0);
  const activeCount = gmailPackages.filter((item) => item.status === "Active").length;
  const issueCount = emailAccounts.filter((item) => item.status === "Need recovery" || item.status === "Locked").length;
  const countries = new Set(gmailPackages.map((item) => item.country)).size;
  const averagePrice = gmailPackages.reduce((total, item) => total + item.price, 0) / gmailPackages.length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-red-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">Email Warehouse</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Kho quản lý Gmail</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Quản lý Gmail như một kho hàng: nhập kho, phân loại, kiểm tra live, theo dõi lỗi và xuất dữ liệu khi cần.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
              <Upload size={18} />
              Nhập kho
            </button>
            <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-red-50">
              <Plus size={18} />
              Thêm Gmail
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Mail} label="Tổng Gmail trong kho" value={totalStock.toLocaleString("en-US")} tone="text-blue-600" />
        <StatCard icon={PackageCheck} label="Gmail live" value={totalLive.toLocaleString("en-US")} tone="text-emerald-600" />
        <StatCard icon={AlertTriangle} label="Cần xử lý" value={issueCount.toString()} tone="text-amber-600" />
        <StatCard icon={ShieldCheck} label="Giá trung bình" value={formatCurrency(averagePrice)} tone="text-slate-950" />
      </section>

      <section className="rounded-2xl border bg-white p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.key ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "overview" && (
        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Tổng quan kho</h2>
            <p className="mt-1 text-sm text-slate-500">Tỉ lệ Gmail live theo từng gói hàng.</p>
            <div className="mt-6 space-y-5">
              {gmailPackages.map((item) => {
                const percent = Math.round((item.live / item.stock) * 100);

                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">{item.name}</span>
                      <span className="font-bold text-slate-950">{percent}% live</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Tác vụ nhanh</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Import Gmail", "Check live hàng loạt", "Xuất file live", "Lọc Gmail lỗi"].map((action) => (
                <button key={action} className="rounded-2xl border bg-slate-50 px-4 py-4 text-left font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                  {action}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
              Gợi ý vận hành: kiểm tra live trước khi xuất kho để tránh cấp nhầm Gmail lỗi hoặc thiếu recovery.
            </div>
          </div>
        </section>
      )}

      {activeTab === "warehouse" && (
        <>
          <Toolbar placeholder="Tìm gói Gmail, quốc gia hoặc loại..." primary="Import Gmail" secondary="Lọc loại Gmail" />
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <TableHeader title="Danh sách gói trong kho" />
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-100 text-left text-sm text-slate-600">
                  <tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">Quốc gia</th><th className="px-4 py-3 font-semibold">Loại</th><th className="px-4 py-3 font-semibold">Tồn kho</th><th className="px-4 py-3 font-semibold">Live</th><th className="px-4 py-3 font-semibold">Giá</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr>
                </thead>
                <tbody>
                  {gmailPackages.map((item) => {
                    const statusClass = item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
                    return <tr key={item.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{item.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{item.name}</td><td className="px-4 py-4">{item.country}</td><td className="px-4 py-4">{item.type}</td><td className="px-4 py-4">{item.stock.toLocaleString("en-US")}</td><td className="px-4 py-4 font-semibold text-emerald-600">{item.live.toLocaleString("en-US")}</td><td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(item.price)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{item.status}</span></td><td className="px-4 py-4"><button className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sửa</button></td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeTab === "checker" && (
        <>
          <Toolbar placeholder="Tìm batch kiểm tra hoặc gói Gmail..." primary="Tạo batch check" secondary="Chọn gói" />
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><ClipboardCheck size={20} /> Tạo kiểm tra mail</h2>
              <div className="mt-5 space-y-4">
                <div><label className="text-sm font-semibold text-slate-600">Chọn gói Gmail</label><select className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Gmail Việt Nam</option><option>Gmail US Trust</option><option>Gmail PVA Phone</option><option>Gmail 2018-2020</option></select></div>
                <div><label className="text-sm font-semibold text-slate-600">Số lượng cần check</label><input defaultValue="500" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Hệ thống sẽ kiểm tra login, 2FA, recovery và đánh dấu Gmail lỗi vào tab cần xử lý.</div>
                <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Bắt đầu kiểm tra</button>
              </div>
            </div>

            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <TableHeader title="Batch kiểm tra gần đây" />
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Batch</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">Tiến độ</th><th className="px-4 py-3 font-semibold">Live</th><th className="px-4 py-3 font-semibold">Lỗi</th><th className="px-4 py-3 font-semibold">Trạng thái</th></tr></thead>
                  <tbody>{checkQueue.map((item) => <tr key={item.batch} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{item.batch}</td><td className="px-4 py-4 font-semibold text-slate-950">{item.target}</td><td className="px-4 py-4">{item.checked}/{item.total}</td><td className="px-4 py-4 text-emerald-600">{item.live}</td><td className="px-4 py-4 text-red-600">{item.error}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Hoàn tất" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{item.status}</span></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          </section>
        </>
      )}

      {activeTab === "issues" && (
        <>
          <Toolbar placeholder="Tìm Gmail lỗi, checkpoint, thiếu recovery..." primary="Xuất lỗi" secondary="Lọc lỗi" />
          <EmailTable title="Danh sách Gmail cần xử lý" rows={emailAccounts.filter((item) => item.status === "Need recovery" || item.status === "Locked")} />
        </>
      )}

      {activeTab === "imports" && (
        <>
          <Toolbar placeholder="Tìm file nhập kho hoặc mã import..." primary="Import mới" secondary="Tải template" />
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <TableHeader title="Lịch sử nhập kho" />
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã import</th><th className="px-4 py-3 font-semibold">File</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">Tổng</th><th className="px-4 py-3 font-semibold">Thành công</th><th className="px-4 py-3 font-semibold">Lỗi</th><th className="px-4 py-3 font-semibold">Thời gian</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead>
                <tbody>{importHistory.map((item) => <tr key={item.id} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{item.id}</td><td className="px-4 py-4 font-semibold text-slate-950">{item.file}</td><td className="px-4 py-4">{item.package}</td><td className="px-4 py-4">{item.total}</td><td className="px-4 py-4 text-emerald-600">{item.success}</td><td className="px-4 py-4 text-red-600">{item.failed}</td><td className="px-4 py-4 text-slate-600">{item.time}</td><td className="px-4 py-4"><button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Download size={15} /> Tải lỗi</button></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Mail; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className={tone} size={21} />
      </div>
      <strong className={`mt-3 block text-2xl ${tone}`}>{value}</strong>
    </div>
  );
}

function Toolbar({ placeholder, primary, secondary }: { placeholder: string; primary: string; secondary: string }) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder={placeholder} className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">{secondary}</button>
          <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">{primary}</button>
        </div>
      </div>
    </section>
  );
}

function TableHeader({ title }: { title: string }) {
  return <div className="border-b p-5"><h2 className="text-lg font-bold text-slate-950">{title}</h2></div>;
}

function EmailTable({ title, rows }: { title: string; rows: typeof emailAccounts }) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <TableHeader title={title} />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100 text-left text-sm text-slate-600"><tr><th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">2FA</th><th className="px-4 py-3 font-semibold">Recovery</th><th className="px-4 py-3 font-semibold">Check cuối</th><th className="px-4 py-3 font-semibold">Ghi chú</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead>
          <tbody>
            {rows.map((item) => {
              const statusClass = item.status === "Live" ? "bg-emerald-100 text-emerald-700" : item.status === "Sold" ? "bg-slate-200 text-slate-700" : item.status === "Need recovery" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
              return <tr key={item.code} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{item.code}</td><td className="px-4 py-4 font-semibold text-slate-950">{item.email}</td><td className="px-4 py-4">{item.package}</td><td className="px-4 py-4 font-mono text-sm">{item.twoFa}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.recovery === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.recovery}</span></td><td className="px-4 py-4 text-slate-600">{item.lastCheck}</td><td className="px-4 py-4 text-slate-600">{item.note}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{item.status}</span></td><td className="px-4 py-4"><button className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Kiểm tra</button></td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
