import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Mail,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Upload,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { removeAssignedGmail, upsertAssignedGmail } from "../../../../utils/gmailAssignments";
import Pagination from "../../../../components/ui/Pagination";
import { paginate } from "../../../../utils/pagination";

type TabKey = "overview" | "warehouse" | "assignments" | "checker" | "issues" | "imports";
type GmailStatus = "Live" | "Need recovery" | "Locked" | "Sold";
type ImportStatus = "Đang import" | "Hoàn tất" | "Có lỗi";
type UsageStatus = "unused" | "assigned" | "in_use" | "issue" | "completed";

type GmailPackage = {
  id: string;
  name: string;
  country: string;
  type: string;
  stock: number;
  live: number;
  price: number;
  status: "Active" | "Low stock";
};

type EmailAccount = {
  code: string;
  email: string;
  package: string;
  password: string;
  twoFa: string;
  recovery: "live" | "missing";
  status: GmailStatus;
  lastCheck: string;
  note: string;
  assignedTo: string | null;
  assignedAt: string | null;
  usageStatus: UsageStatus;
};

type ImportRecord = {
  id: string;
  file: string;
  package: string;
  total: number;
  success: number;
  failed: number;
  time: string;
  status: ImportStatus;
  source: string;
};

type GmailForm = {
  email: string;
  password: string;
  twoFa: string;
  package: string;
  recovery: "live" | "missing";
  note: string;
};

type DriveImportForm = {
  url: string;
  package: string;
  fileName: string;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "warehouse", label: "Kho Gmail" },
  { key: "assignments", label: "Phân công mail" },
  { key: "checker", label: "Kiểm tra mail" },
  { key: "issues", label: "Lỗi/cần xử lý" },
  { key: "imports", label: "Import Google Drive" },
];

const employees = ["Thanh Nguyen", "Minh Tran", "Lan Pham", "Huy Le", "Chưa giao"];

const initialPackages: GmailPackage[] = [
  { id: "GML-VN", name: "Gmail Việt Nam", country: "Việt Nam", type: "Normal", stock: 2800, live: 2650, price: 12000, status: "Active" },
  { id: "GML-US", name: "Gmail US Trust", country: "United States", type: "Trust", stock: 760, live: 724, price: 28000, status: "Active" },
  { id: "GML-PVA", name: "Gmail PVA Phone", country: "Mix", type: "Phone verified", stock: 940, live: 895, price: 18000, status: "Active" },
  { id: "GML-OLD", name: "Gmail 2018-2020", country: "Mix", type: "Old", stock: 36, live: 28, price: 35000, status: "Low stock" },
];

const initialEmails: EmailAccount[] = [
  { code: "GM-10001", email: "work.vn001@gmail.com", package: "Gmail Việt Nam", password: "********", twoFa: "JBSW Y3DP ****", recovery: "live", status: "Live", lastCheck: "5 phút trước", note: "Sẵn sàng cấp", assignedTo: null, assignedAt: null, usageStatus: "unused" },
  { code: "GM-10002", email: "trust.us452@gmail.com", package: "Gmail US Trust", password: "********", twoFa: "KJHG 62LA ****", recovery: "live", status: "Live", lastCheck: "12 phút trước", note: "Trust cao", assignedTo: "Minh Tran", assignedAt: "28/07/2026", usageStatus: "in_use" },
  { code: "GM-10003", email: "pva.mix209@gmail.com", package: "Gmail PVA Phone", password: "********", twoFa: "MNBV 77TR ****", recovery: "missing", status: "Need recovery", lastCheck: "38 phút trước", note: "Thiếu mail khôi phục", assignedTo: null, assignedAt: null, usageStatus: "unused" },
  { code: "GM-10004", email: "old.stock018@gmail.com", package: "Gmail 2018-2020", password: "********", twoFa: "QWER 11ZX ****", recovery: "live", status: "Locked", lastCheck: "1 giờ trước", note: "Login bị checkpoint", assignedTo: "Lan Pham", assignedAt: "27/07/2026", usageStatus: "assigned" },
  { code: "GM-10005", email: "work.vn884@gmail.com", package: "Gmail Việt Nam", password: "********", twoFa: "PLMK 90YT ****", recovery: "live", status: "Sold", lastCheck: "Hôm qua", note: "Đã xuất kho", assignedTo: "Thanh Nguyen", assignedAt: "26/07/2026", usageStatus: "in_use" },
];

const initialImports: ImportRecord[] = [
  { id: "IMP-901", file: "gmail-vn-2807.csv", package: "Gmail Việt Nam", total: 1200, success: 1184, failed: 16, time: "09:30 28/07/2026", status: "Hoàn tất", source: "Google Drive" },
  { id: "IMP-900", file: "gmail-us-trust.csv", package: "Gmail US Trust", total: 300, success: 300, failed: 0, time: "18:20 27/07/2026", status: "Hoàn tất", source: "Google Drive" },
  { id: "IMP-899", file: "gmail-old-stock.xlsx", package: "Gmail 2018-2020", total: 80, success: 72, failed: 8, time: "14:05 27/07/2026", status: "Có lỗi", source: "Upload file" },
];

const checkQueue = [
  { batch: "CHK-0728-01", target: "Gmail Việt Nam", total: 500, checked: 420, live: 398, error: 22, status: "Đang kiểm tra" },
  { batch: "CHK-0728-02", target: "Gmail US Trust", total: 200, checked: 200, live: 192, error: 8, status: "Hoàn tất" },
  { batch: "CHK-0728-03", target: "Gmail 2018-2020", total: 36, checked: 18, live: 14, error: 4, status: "Đang kiểm tra" },
];

const emptyForm: GmailForm = {
  email: "",
  password: "",
  twoFa: "",
  package: "Gmail Việt Nam",
  recovery: "live",
  note: "",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function getGoogleDriveDownloadUrl(url: string) {
  const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];

  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return url;
}

function parseCsvRows(csvText: string, packageName: string, startIndex: number) {
  return csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 50)
    .map((line, index) => {
      const [email = "", password = "********", twoFa = "", recovery = "live", note = "Import Google Drive"] = line.split(",").map((cell) => cell.trim());

      return {
        code: `GM-${startIndex + index}`,
        email,
        password: password || "********",
        twoFa: twoFa || "Chưa có",
        package: packageName,
        recovery: recovery.toLowerCase() === "missing" ? "missing" : "live",
        status: recovery.toLowerCase() === "missing" ? "Need recovery" : "Live",
        lastCheck: "Chưa kiểm tra",
        note: note || "Import Google Drive",
        assignedTo: null,
        assignedAt: null,
        usageStatus: "unused",
      } satisfies EmailAccount;
    })
    .filter((row) => row.email.includes("@"));
}

function createDemoDriveRows(packageName: string, startIndex: number) {
  return [
    { code: `GM-${startIndex}`, email: "drive.import.vn01@gmail.com", package: packageName, password: "********", twoFa: "DRIV 20AA ****", recovery: "live", status: "Live", lastCheck: "Chưa kiểm tra", note: "Import từ Google Drive", assignedTo: null, assignedAt: null, usageStatus: "unused" },
    { code: `GM-${startIndex + 1}`, email: "drive.import.vn02@gmail.com", package: packageName, password: "********", twoFa: "DRIV 21BB ****", recovery: "live", status: "Live", lastCheck: "Chưa kiểm tra", note: "Import từ Google Drive", assignedTo: null, assignedAt: null, usageStatus: "unused" },
    { code: `GM-${startIndex + 2}`, email: "drive.need.recovery@gmail.com", package: packageName, password: "********", twoFa: "DRIV 22CC ****", recovery: "missing", status: "Need recovery", lastCheck: "Chưa kiểm tra", note: "Thiếu recovery", assignedTo: null, assignedAt: null, usageStatus: "unused" },
  ] satisfies EmailAccount[];
}

export default function GmailProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [packages, setPackages] = useState(initialPackages);
  const [emails, setEmails] = useState(initialEmails);
  const [imports, setImports] = useState(initialImports);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | GmailStatus>("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [usageFilter, setUsageFilter] = useState<"all" | UsageStatus>("all");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [bulkEmployee, setBulkEmployee] = useState(employees[0]);
  const [randomEmployee, setRandomEmployee] = useState(employees[0]);
  const [randomQuantity, setRandomQuantity] = useState(5);
  const [importPage, setImportPage] = useState(1);
  const [importPageSize, setImportPageSize] = useState(5);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [gmailForm, setGmailForm] = useState<GmailForm>(emptyForm);
  const [driveForm, setDriveForm] = useState<DriveImportForm>({ url: "", package: "Gmail Việt Nam", fileName: "gmail-drive.csv" });
  const [drivePreview, setDrivePreview] = useState<EmailAccount[]>([]);
  const [importMessage, setImportMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const totalStock = packages.reduce((total, item) => total + item.stock, 0);
  const totalLive = packages.reduce((total, item) => total + item.live, 0);
  const issueCount = emails.filter((item) => item.status === "Need recovery" || item.status === "Locked").length;
  const unusedCount = emails.filter((item) => item.usageStatus === "unused").length;
  const assignedCount = emails.filter((item) => item.usageStatus !== "unused").length;
  const averagePrice = packages.reduce((total, item) => total + item.price, 0) / packages.length;
  const filteredEmails = emails.filter((item) => {
    const normalizedQuery = query.toLowerCase();
    const matchesQuery = [item.code, item.email, item.package, item.status, item.note, item.assignedTo ?? "Chưa giao"].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesEmployee = employeeFilter === "all" || (employeeFilter === "unassigned" ? !item.assignedTo : item.assignedTo === employeeFilter);
    const matchesUsage = usageFilter === "all" || item.usageStatus === usageFilter;

    return matchesQuery && matchesStatus && matchesEmployee && matchesUsage;
  });
  const assignmentRows = filteredEmails.filter((item) => employeeFilter !== "all" || usageFilter !== "all" || item.usageStatus !== "unused");
  const employeeSummaries = employees.filter((employee) => employee !== "Chưa giao").map((employee) => {
    const employeeMails = emails.filter((item) => item.assignedTo === employee);

    return {
      employee,
      total: employeeMails.length,
      inUse: employeeMails.filter((item) => item.usageStatus === "in_use").length,
      assigned: employeeMails.filter((item) => item.usageStatus === "assigned").length,
      issues: employeeMails.filter((item) => item.status === "Need recovery" || item.status === "Locked").length,
    };
  });
  const assignableEmails = emails.filter((item) => item.status === "Live" && item.usageStatus === "unused");
  const paginatedImports = paginate(imports, importPage, importPageSize);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "imports") {
      setImportMessage("");
    }
  };

  const handleAddGmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!gmailForm.email.includes("@")) {
      return;
    }

    const nextEmail: EmailAccount = {
      code: `GM-${10000 + emails.length + 1}`,
      email: gmailForm.email,
      password: gmailForm.password || "********",
      twoFa: gmailForm.twoFa || "Chưa có",
      package: gmailForm.package,
      recovery: gmailForm.recovery,
      status: gmailForm.recovery === "missing" ? "Need recovery" : "Live",
      lastCheck: "Chưa kiểm tra",
      note: gmailForm.note || "Thêm thủ công",
      assignedTo: null,
      assignedAt: null,
      usageStatus: "unused",
    };

    setEmails((current) => [nextEmail, ...current]);
    setPackages((current) => updatePackageStock(current, gmailForm.package, 1, nextEmail.status === "Live" ? 1 : 0));
    setGmailForm(emptyForm);
    setIsAddOpen(false);
  };

  const handleDrivePreview = async () => {
    if (!driveForm.url.trim()) {
      setImportMessage("Vui lòng nhập link Google Drive hoặc link CSV public.");
      return;
    }

    setIsImporting(true);
    setImportMessage("Đang đọc dữ liệu từ Google Drive...");

    try {
      const response = await fetch(getGoogleDriveDownloadUrl(driveForm.url));
      const text = await response.text();
      const rows = parseCsvRows(text, driveForm.package, 20000 + emails.length + 1);

      if (rows.length === 0) {
        throw new Error("Không đọc được dữ liệu CSV");
      }

      setDrivePreview(rows);
      setImportMessage(`Đã đọc ${rows.length} dòng hợp lệ từ Google Drive.`);
    } catch {
      const demoRows = createDemoDriveRows(driveForm.package, 20000 + emails.length + 1);
      setDrivePreview(demoRows);
      setImportMessage("Không fetch được trực tiếp do quyền/CORS. Đã tạo preview mẫu để admin kiểm tra luồng import.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmDriveImport = () => {
    if (drivePreview.length === 0) {
      setImportMessage("Chưa có dữ liệu preview để import.");
      return;
    }

    const success = drivePreview.filter((item) => item.email.includes("@")).length;
    const failed = drivePreview.length - success;
    const live = drivePreview.filter((item) => item.status === "Live").length;

    setEmails((current) => [...drivePreview, ...current]);
    setPackages((current) => updatePackageStock(current, driveForm.package, drivePreview.length, live));
    setImports((current) => [
      {
        id: `IMP-${902 + current.length}`,
        file: driveForm.fileName || "google-drive-import.csv",
        package: driveForm.package,
        total: drivePreview.length,
        success,
        failed,
        time: new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
        status: failed > 0 ? "Có lỗi" : "Hoàn tất",
        source: "Google Drive",
      },
      ...current,
    ]);
    setImportMessage(`Đã import ${success} Gmail vào kho ${driveForm.package}.`);
    setDrivePreview([]);
  };

  const handleCheckEmail = (code: string) => {
    setEmails((current) => current.map((item) => (item.code === code ? { ...item, status: item.recovery === "missing" ? "Need recovery" : "Live", lastCheck: "Vừa xong" } : item)));
  };

  const handleAssignEmail = (code: string, employee: string) => {
    setEmails((current) => current.map((item) => {
      if (item.code !== code) {
        return item;
      }

      if (employee === "unassigned") {
        removeAssignedGmail(item.code);
        return { ...item, assignedTo: null, assignedAt: null, usageStatus: "unused" };
      }

      const assignedAt = new Date().toLocaleDateString("vi-VN");
      const usageStatus = item.usageStatus === "in_use" ? "in_use" : "assigned";

      upsertAssignedGmail({
        id: Number(item.code.replace(/\D/g, "")) || Date.now(),
        code: item.code,
        email: item.email,
        password: item.password,
        twoFA: item.twoFa,
        phone: "Chưa cập nhật",
        country: item.package,
        year: new Date().getFullYear(),
        status: item.status,
        owner: employee,
        note: item.note,
        assignedTo: employee,
        assignedAt,
        usageStatus,
        source: "admin",
      });

      return {
        ...item,
        assignedTo: employee,
        assignedAt,
        usageStatus,
      };
    }));
  };

  const assignEmailToEmployee = (item: EmailAccount, employee: string, usageStatus: UsageStatus = "assigned") => {
    const assignedAt = new Date().toLocaleDateString("vi-VN");

    upsertAssignedGmail({
      id: Number(item.code.replace(/\D/g, "")) || Date.now(),
      code: item.code,
      email: item.email,
      password: item.password,
      twoFA: item.twoFa,
      phone: "Chưa cập nhật",
      country: item.package,
      year: new Date().getFullYear(),
      status: item.status,
      owner: employee,
      note: item.note,
      assignedTo: employee,
      assignedAt,
      usageStatus: usageStatus === "unused" ? "assigned" : usageStatus,
      source: "admin",
    });

    return { ...item, assignedTo: employee, assignedAt, usageStatus: usageStatus === "unused" ? "assigned" : usageStatus };
  };

  const handleToggleSelected = (code: string) => {
    setSelectedCodes((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
  };

  const handleToggleAllVisible = (checked: boolean, rows: EmailAccount[]) => {
    const visibleCodes = rows.map((item) => item.code);
    setSelectedCodes((current) => checked ? Array.from(new Set([...current, ...visibleCodes])) : current.filter((code) => !visibleCodes.includes(code)));
  };

  const handleBulkAssign = () => {
    if (selectedCodes.length === 0) {
      return;
    }

    setEmails((current) => current.map((item) => selectedCodes.includes(item.code) ? assignEmailToEmployee(item, bulkEmployee) : item));
    setSelectedCodes([]);
  };

  const handleRandomAssign = () => {
    const shuffledEmails = [...assignableEmails].sort(() => Math.random() - 0.5);
    const pickedCodes = shuffledEmails.slice(0, Math.max(0, randomQuantity)).map((item) => item.code);

    if (pickedCodes.length === 0) {
      return;
    }

    setEmails((current) => current.map((item) => pickedCodes.includes(item.code) ? assignEmailToEmployee(item, randomEmployee) : item));
  };

  const handleUsageChange = (code: string, usageStatus: UsageStatus) => {
    setEmails((current) => current.map((item) => {
      if (item.code !== code) {
        return item;
      }

      if (usageStatus === "unused") {
        removeAssignedGmail(item.code);
        return { ...item, usageStatus, assignedTo: null, assignedAt: null };
      }

      const assignedTo = item.assignedTo ?? employees[0];
      const assignedAt = item.assignedAt ?? new Date().toLocaleDateString("vi-VN");

      upsertAssignedGmail({
        id: Number(item.code.replace(/\D/g, "")) || Date.now(),
        code: item.code,
        email: item.email,
        password: item.password,
        twoFA: item.twoFa,
        phone: "Chưa cập nhật",
        country: item.package,
        year: new Date().getFullYear(),
        status: item.status,
        owner: assignedTo,
        note: item.note,
        assignedTo,
        assignedAt,
        usageStatus,
        source: "admin",
      });

      return {
        ...item,
        usageStatus,
        assignedTo,
        assignedAt,
      };
    }));
  };

  const handleExportLive = () => {
    const liveCount = emails.filter((item) => item.status === "Live").length;
    setImportMessage(`Đã chuẩn bị xuất ${liveCount} Gmail live. Khi nối backend có thể tải file CSV tại đây.`);
    setActiveTab("imports");
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-red-600 text-white shadow-lg">
        <div className="relative p-6 md:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-red-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-44 w-44 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">Email Warehouse</p>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">Kho quản lý Gmail</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Quản lý nhập kho, kiểm tra live, lọc lỗi, thêm thủ công và import Gmail trực tiếp từ Google Drive public CSV.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleTabChange("imports")}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Upload size={18} />
                Import Drive
              </button>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-red-50"
              >
                <Plus size={18} />
                Thêm Gmail
              </button>
            </div>
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
              onClick={() => handleTabChange(tab.key)}
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
              {packages.map((item) => {
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
              <QuickAction title="Import Google Drive" description="Nhập CSV public từ Drive" onClick={() => handleTabChange("imports")} />
              <QuickAction title="Thêm Gmail" description="Tạo Gmail thủ công" onClick={() => setIsAddOpen(true)} />
              <QuickAction title="Phân công mail" description="Giao Gmail cho nhân viên" onClick={() => handleTabChange("assignments")} />
              <QuickAction title="Xuất Gmail live" description="Chuẩn bị file CSV" onClick={handleExportLive} />
              <QuickAction title="Lọc Gmail lỗi" description="Xem checkpoint/recovery" onClick={() => handleTabChange("issues")} />
            </div>
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
              Format CSV đề xuất: email,password,twoFa,recovery,note. Với Google Sheet, hãy publish dạng CSV để frontend đọc được dữ liệu.
            </div>
          </div>
        </section>
      )}

      {activeTab === "warehouse" && (
        <>
          <GmailToolbar
            query={query}
            statusFilter={statusFilter}
            employeeFilter={employeeFilter}
            usageFilter={usageFilter}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
            onEmployeeChange={setEmployeeFilter}
            onUsageChange={setUsageFilter}
            onAdd={() => setIsAddOpen(true)}
            onImport={() => handleTabChange("imports")}
          />
          <EmailTable title="Danh sách Gmail trong kho" rows={filteredEmails} onCheck={handleCheckEmail} onAssign={handleAssignEmail} onUsageChange={handleUsageChange} />
        </>
      )}

      {activeTab === "assignments" && (
        <>
          <AssignmentStats total={emails.length} unused={unusedCount} assigned={assignedCount} summaries={employeeSummaries} />
          <BulkAssignPanel
            selectedCount={selectedCodes.length}
            availableCount={assignableEmails.length}
            bulkEmployee={bulkEmployee}
            randomEmployee={randomEmployee}
            randomQuantity={randomQuantity}
            onBulkEmployeeChange={setBulkEmployee}
            onRandomEmployeeChange={setRandomEmployee}
            onRandomQuantityChange={setRandomQuantity}
            onBulkAssign={handleBulkAssign}
            onRandomAssign={handleRandomAssign}
          />
          <AssignmentToolbar
            query={query}
            employeeFilter={employeeFilter}
            usageFilter={usageFilter}
            onQueryChange={setQuery}
            onEmployeeChange={setEmployeeFilter}
            onUsageChange={setUsageFilter}
          />
          <EmailTable title="Phân công Gmail cho nhân viên" rows={assignmentRows} onCheck={handleCheckEmail} onAssign={handleAssignEmail} onUsageChange={handleUsageChange} selectedCodes={selectedCodes} onToggleSelected={handleToggleSelected} onToggleAllVisible={handleToggleAllVisible} />
        </>
      )}

      {activeTab === "checker" && (
        <>
          <Toolbar placeholder="Tìm batch kiểm tra hoặc gói Gmail..." primary="Tạo batch check" secondary="Chọn gói" />
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><ClipboardCheck size={20} /> Tạo kiểm tra mail</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Chọn gói Gmail</label>
                  <select className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
                    {packages.map((item) => <option key={item.id}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Số lượng cần check</label>
                  <input defaultValue="500" className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
                </div>
                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Hệ thống sẽ kiểm tra login, 2FA, recovery và đánh dấu Gmail lỗi vào tab cần xử lý.</div>
                <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Bắt đầu kiểm tra</button>
              </div>
            </div>

            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <TableHeader title="Batch kiểm tra gần đây" />
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-100 text-left text-sm text-slate-600">
                    <tr><th className="px-4 py-3 font-semibold">Batch</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">Tiến độ</th><th className="px-4 py-3 font-semibold">Live</th><th className="px-4 py-3 font-semibold">Lỗi</th><th className="px-4 py-3 font-semibold">Trạng thái</th></tr>
                  </thead>
                  <tbody>{checkQueue.map((item) => <tr key={item.batch} className="border-b transition hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-700">{item.batch}</td><td className="px-4 py-4 font-semibold text-slate-950">{item.target}</td><td className="px-4 py-4">{item.checked}/{item.total}</td><td className="px-4 py-4 text-emerald-600">{item.live}</td><td className="px-4 py-4 text-red-600">{item.error}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Hoàn tất" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{item.status}</span></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          </section>
        </>
      )}

      {activeTab === "issues" && (
        <>
          <GmailToolbar
            query={query}
            statusFilter={statusFilter}
            employeeFilter={employeeFilter}
            usageFilter={usageFilter}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
            onEmployeeChange={setEmployeeFilter}
            onUsageChange={setUsageFilter}
            onAdd={() => setIsAddOpen(true)}
            onImport={() => handleTabChange("imports")}
          />
          <EmailTable title="Danh sách Gmail cần xử lý" rows={filteredEmails.filter((item) => item.status === "Need recovery" || item.status === "Locked")} onCheck={handleCheckEmail} onAssign={handleAssignEmail} onUsageChange={handleUsageChange} />
        </>
      )}

      {activeTab === "imports" && (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <DriveImportPanel
              form={driveForm}
              packages={packages}
              isImporting={isImporting}
              message={importMessage}
              onChange={setDriveForm}
              onPreview={handleDrivePreview}
              onConfirm={handleConfirmDriveImport}
              canConfirm={drivePreview.length > 0}
            />
            {drivePreview.length > 0 && <EmailTable title="Preview dữ liệu từ Google Drive" rows={drivePreview} onCheck={handleCheckEmail} onAssign={handleAssignEmail} onUsageChange={handleUsageChange} compact />}
          </div>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <TableHeader title="Lịch sử nhập kho" />
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-100 text-left text-sm text-slate-600">
                  <tr><th className="px-4 py-3 font-semibold">Mã import</th><th className="px-4 py-3 font-semibold">File</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">Tổng</th><th className="px-4 py-3 font-semibold">Thành công</th><th className="px-4 py-3 font-semibold">Nguồn</th><th className="px-4 py-3 font-semibold">Trạng thái</th><th className="px-4 py-3 font-semibold">Action</th></tr>
                </thead>
                <tbody>
                  {paginatedImports.map((item) => (
                    <tr key={item.id} className="border-b transition hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-700">{item.id}</td>
                      <td className="px-4 py-4 font-semibold text-slate-950">{item.file}</td>
                      <td className="px-4 py-4">{item.package}</td>
                      <td className="px-4 py-4">{item.total}</td>
                      <td className="px-4 py-4 text-emerald-600">{item.success}</td>
                      <td className="px-4 py-4">{item.source}</td>
                      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-4"><button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Download size={15} /> Tải lỗi</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={importPage} pageSize={importPageSize} total={imports.length} onPageChange={setImportPage} onPageSizeChange={(nextPageSize) => { setImportPageSize(nextPageSize); setImportPage(1); }} />
          </section>
        </section>
      )}

      {isAddOpen && (
        <AddGmailModal
          form={gmailForm}
          packages={packages}
          onChange={setGmailForm}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddGmail}
        />
      )}
    </div>
  );
}

function updatePackageStock(packages: GmailPackage[], packageName: string, stockIncrease: number, liveIncrease: number) {
  return packages.map((item) => {
    if (item.name !== packageName) {
      return item;
    }

    const nextStock = item.stock + stockIncrease;
    const nextStatus: GmailPackage["status"] = nextStock < 50 ? "Low stock" : "Active";

    return { ...item, stock: nextStock, live: item.live + liveIncrease, status: nextStatus };
  });
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Mail; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className={tone} size={21} />
      </div>
      <strong className={`mt-3 block text-2xl ${tone}`}>{value}</strong>
    </div>
  );
}

function QuickAction({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border bg-slate-50 px-4 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </button>
  );
}

function GmailToolbar({
  query,
  statusFilter,
  employeeFilter,
  usageFilter,
  onQueryChange,
  onStatusChange,
  onEmployeeChange,
  onUsageChange,
  onAdd,
  onImport,
}: {
  query: string;
  statusFilter: "all" | GmailStatus;
  employeeFilter: string;
  usageFilter: "all" | UsageStatus;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "all" | GmailStatus) => void;
  onEmployeeChange: (value: string) => void;
  onUsageChange: (value: "all" | UsageStatus) => void;
  onAdd: () => void;
  onImport: () => void;
}) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid w-full gap-3 md:grid-cols-[1fr_190px_190px_190px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Tìm mã, email, gói, trạng thái..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          </div>
          <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value as "all" | GmailStatus)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
            <option value="all">Tất cả trạng thái</option>
            <option value="Live">Live</option>
            <option value="Need recovery">Need recovery</option>
            <option value="Locked">Locked</option>
            <option value="Sold">Sold</option>
          </select>
          <select value={employeeFilter} onChange={(event) => onEmployeeChange(event.target.value)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
            <option value="all">Tất cả nhân viên</option>
            <option value="unassigned">Chưa giao</option>
            {employees.filter((employee) => employee !== "Chưa giao").map((employee) => <option key={employee}>{employee}</option>)}
          </select>
          <select value={usageFilter} onChange={(event) => onUsageChange(event.target.value as "all" | UsageStatus)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
            <option value="all">Tất cả sử dụng</option>
            <option value="unused">Chưa giao</option>
            <option value="assigned">Đã giao</option>
            <option value="in_use">Đang dùng</option>
            <option value="issue">Báo lỗi</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onImport} className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"><Upload size={18} /> Import Drive</button>
          <button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"><Plus size={18} /> Thêm Gmail</button>
        </div>
      </div>
    </section>
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

function AssignmentStats({ total, unused, assigned, summaries }: { total: number; unused: number; assigned: number; summaries: { employee: string; total: number; inUse: number; assigned: number; issues: number }[] }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Tổng quan phân công</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-4"><p className="text-sm text-blue-700">Tổng mail</p><strong className="mt-1 block text-2xl text-blue-700">{total}</strong></div>
          <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Chưa giao</p><strong className="mt-1 block text-2xl text-emerald-700">{unused}</strong></div>
          <div className="rounded-2xl bg-violet-50 p-4"><p className="text-sm text-violet-700">Đã có người dùng</p><strong className="mt-1 block text-2xl text-violet-700">{assigned}</strong></div>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Mail theo nhân viên</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summaries.map((item) => (
            <div key={item.employee} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between"><p className="font-bold text-slate-950">{item.employee}</p><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{item.total} mail</span></div>
              <p className="mt-2 text-sm text-slate-500">Đang dùng: {item.inUse} | Đã giao: {item.assigned} | Lỗi: {item.issues}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssignmentToolbar({ query, employeeFilter, usageFilter, onQueryChange, onEmployeeChange, onUsageChange }: { query: string; employeeFilter: string; usageFilter: "all" | UsageStatus; onQueryChange: (value: string) => void; onEmployeeChange: (value: string) => void; onUsageChange: (value: "all" | UsageStatus) => void }) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Tìm Gmail, mã, gói hoặc nhân viên..." className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
        </div>
        <select value={employeeFilter} onChange={(event) => onEmployeeChange(event.target.value)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
          <option value="all">Tất cả nhân viên</option>
          <option value="unassigned">Chưa giao</option>
          {employees.filter((employee) => employee !== "Chưa giao").map((employee) => <option key={employee}>{employee}</option>)}
        </select>
        <select value={usageFilter} onChange={(event) => onUsageChange(event.target.value as "all" | UsageStatus)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
          <option value="all">Tất cả trạng thái dùng</option>
          <option value="unused">Chưa giao</option>
          <option value="assigned">Đã giao</option>
          <option value="in_use">Đang dùng</option>
          <option value="issue">Báo lỗi</option>
          <option value="completed">Hoàn thành</option>
        </select>
      </div>
    </section>
  );
}

function BulkAssignPanel({
  selectedCount,
  availableCount,
  bulkEmployee,
  randomEmployee,
  randomQuantity,
  onBulkEmployeeChange,
  onRandomEmployeeChange,
  onRandomQuantityChange,
  onBulkAssign,
  onRandomAssign,
}: {
  selectedCount: number;
  availableCount: number;
  bulkEmployee: string;
  randomEmployee: string;
  randomQuantity: number;
  onBulkEmployeeChange: (value: string) => void;
  onRandomEmployeeChange: (value: string) => void;
  onRandomQuantityChange: (value: number) => void;
  onBulkAssign: () => void;
  onRandomAssign: () => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Chuyển nhiều mail đã chọn</h2>
        <p className="mt-1 text-sm text-slate-500">Tick nhiều Gmail trong bảng bên dưới rồi chuyển một lần cho nhân viên.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <select value={bulkEmployee} onChange={(event) => onBulkEmployeeChange(event.target.value)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
            {employees.filter((employee) => employee !== "Chưa giao").map((employee) => <option key={employee}>{employee}</option>)}
          </select>
          <button type="button" onClick={onBulkAssign} disabled={selectedCount === 0} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            Chuyển {selectedCount} mail
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Random mail trống tự động chuyển</h2>
        <p className="mt-1 text-sm text-slate-500">Hệ thống lấy ngẫu nhiên Gmail live, chưa giao cho ai rồi chuyển cho nhân viên.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_140px_auto]">
          <select value={randomEmployee} onChange={(event) => onRandomEmployeeChange(event.target.value)} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
            {employees.filter((employee) => employee !== "Chưa giao").map((employee) => <option key={employee}>{employee}</option>)}
          </select>
          <input type="number" min={1} max={availableCount} value={randomQuantity} onChange={(event) => onRandomQuantityChange(Number(event.target.value))} className="rounded-xl border bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          <button type="button" onClick={onRandomAssign} disabled={availableCount === 0} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            Random chuyển
          </button>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-400">Còn {availableCount} Gmail live chưa giao có thể random.</p>
      </div>
    </section>
  );
}

function EmailTable({ title, rows, onCheck, onAssign, onUsageChange, selectedCodes = [], onToggleSelected, onToggleAllVisible, compact = false }: { title: string; rows: EmailAccount[]; onCheck: (code: string) => void; onAssign: (code: string, employee: string) => void; onUsageChange: (code: string, status: UsageStatus) => void; selectedCodes?: string[]; onToggleSelected?: (code: string) => void; onToggleAllVisible?: (checked: boolean, rows: EmailAccount[]) => void; compact?: boolean }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const selectable = Boolean(onToggleSelected && onToggleAllVisible && !compact);
  const paginatedRows = paginate(rows, page, pageSize);
  const allVisibleSelected = paginatedRows.length > 0 && paginatedRows.every((item) => selectedCodes.includes(item.code));

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <TableHeader title={title} />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100 text-left text-sm text-slate-600">
            <tr>{selectable && <th className="px-4 py-3 font-semibold"><input type="checkbox" checked={allVisibleSelected} onChange={(event) => onToggleAllVisible?.(event.target.checked, paginatedRows)} className="h-4 w-4 accent-blue-600" /></th>}<th className="px-4 py-3 font-semibold">Mã</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Gói</th><th className="px-4 py-3 font-semibold">2FA</th><th className="px-4 py-3 font-semibold">Recovery</th><th className="px-4 py-3 font-semibold">Nhân viên</th><th className="px-4 py-3 font-semibold">Sử dụng</th><th className="px-4 py-3 font-semibold">Check cuối</th><th className="px-4 py-3 font-semibold">Ghi chú</th><th className="px-4 py-3 font-semibold">Trạng thái</th>{!compact && <th className="px-4 py-3 font-semibold">Action</th>}</tr>
          </thead>
          <tbody>
            {paginatedRows.map((item) => (
              <tr key={item.code} className="border-b transition hover:bg-slate-50">
                {selectable && <td className="px-4 py-4"><input type="checkbox" checked={selectedCodes.includes(item.code)} onChange={() => onToggleSelected?.(item.code)} className="h-4 w-4 accent-blue-600" /></td>}
                <td className="px-4 py-4 font-medium text-slate-700">{item.code}</td>
                <td className="px-4 py-4 font-semibold text-slate-950">{item.email}</td>
                <td className="px-4 py-4">{item.package}</td>
                <td className="px-4 py-4 font-mono text-sm">{item.twoFa}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.recovery === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.recovery}</span></td>
                <td className="px-4 py-4">
                  <select value={item.assignedTo ?? "unassigned"} onChange={(event) => onAssign(item.code, event.target.value)} className="min-w-40 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100">
                    <option value="unassigned">Chưa giao</option>
                    {employees.filter((employee) => employee !== "Chưa giao").map((employee) => <option key={employee}>{employee}</option>)}
                  </select>
                  {item.assignedAt && <p className="mt-1 text-xs text-slate-400">Giao: {item.assignedAt}</p>}
                </td>
                <td className="px-4 py-4">
                  <select value={item.usageStatus} onChange={(event) => onUsageChange(item.code, event.target.value as UsageStatus)} className="min-w-32 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100">
                    <option value="unused">Chưa giao</option>
                    <option value="assigned">Đã giao</option>
                    <option value="in_use">Đang dùng</option>
                    <option value="issue">Báo lỗi</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-slate-600">{item.lastCheck}</td>
                <td className="px-4 py-4 text-slate-600">{item.note}</td>
                <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                {!compact && <td className="px-4 py-4"><div className="flex flex-col gap-2"><button type="button" onClick={() => onCheck(item.code)} className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><RefreshCcw size={15} /> Kiểm tra</button>{item.assignedTo ? <button type="button" onClick={() => onAssign(item.code, "unassigned")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"><UserMinus size={15} /> Thu hồi</button> : <button type="button" onClick={() => onAssign(item.code, employees[0])} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"><UserPlus size={15} /> Giao nhanh</button>}</div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={pageSize} total={rows.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} />
    </section>
  );
}

function DriveImportPanel({
  form,
  packages,
  isImporting,
  message,
  canConfirm,
  onChange,
  onPreview,
  onConfirm,
}: {
  form: DriveImportForm;
  packages: GmailPackage[];
  isImporting: boolean;
  message: string;
  canConfirm: boolean;
  onChange: (value: DriveImportForm) => void;
  onPreview: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><FileSpreadsheet size={22} /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Import Gmail từ Google Drive</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">Dán link Google Drive public CSV hoặc link CSV export từ Google Sheet. File nên có cột: email,password,twoFa,recovery,note.</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-600">Link Google Drive</label>
          <div className="relative mt-2">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={form.url} onChange={(event) => onChange({ ...form, url: event.target.value })} placeholder="https://drive.google.com/file/d/... hoặc link CSV public" className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-600">Nhập vào gói</label>
            <select value={form.package} onChange={(event) => onChange({ ...form, package: event.target.value })} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
              {packages.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Tên file ghi lịch sử</label>
            <input value={form.fileName} onChange={(event) => onChange({ ...form, fileName: event.target.value })} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          </div>
        </div>

        {message && <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">{message}</div>}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onPreview} disabled={isImporting} className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
            <ExternalLink size={18} />
            {isImporting ? "Đang đọc Drive..." : "Đọc preview"}
          </button>
          <button type="button" onClick={onConfirm} disabled={!canConfirm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <CheckCircle2 size={18} />
            Xác nhận import
          </button>
        </div>
      </div>
    </section>
  );
}

function AddGmailModal({
  form,
  packages,
  onChange,
  onClose,
  onSubmit,
}: {
  form: GmailForm;
  packages: GmailPackage[];
  onChange: (value: GmailForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Thêm Gmail thủ công</h2>
            <p className="mt-1 text-sm text-slate-500">Nhập Gmail vào kho và tự động cập nhật tồn kho.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><X size={20} /></button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <FormInput label="Email" name="email" value={form.email} onChange={handleInputChange} placeholder="example@gmail.com" />
          <FormInput label="Password" name="password" value={form.password} onChange={handleInputChange} placeholder="password hoặc ********" />
          <FormInput label="2FA" name="twoFa" value={form.twoFa} onChange={handleInputChange} placeholder="JBSW Y3DP ..." />
          <div>
            <label className="text-sm font-semibold text-slate-600">Gói Gmail</label>
            <select name="package" value={form.package} onChange={handleInputChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
              {packages.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Recovery</label>
            <select name="recovery" value={form.recovery} onChange={handleInputChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100">
              <option value="live">live</option>
              <option value="missing">missing</option>
            </select>
          </div>
          <FormInput label="Ghi chú" name="note" value={form.note} onChange={handleInputChange} placeholder="Trust cao, mới nhập..." />
        </div>

        <div className="flex flex-col gap-3 border-t bg-slate-50 p-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Hủy</button>
          <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Lưu Gmail</button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder }: { label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-600">{label}</label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" />
    </div>
  );
}

function StatusBadge({ status }: { status: GmailStatus | ImportStatus }) {
  const statusClass = status === "Live" || status === "Hoàn tất"
    ? "bg-emerald-100 text-emerald-700"
    : status === "Sold"
      ? "bg-slate-200 text-slate-700"
      : status === "Need recovery" || status === "Đang import"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>;
}
