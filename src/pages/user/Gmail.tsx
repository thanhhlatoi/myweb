import { useState } from "react";
import { AlertTriangle, Copy, Mail, RefreshCcw, ShieldCheck, UserCheck, Users } from "lucide-react";
import GmailToolbar from "../../components/gmail/GmailToolbar";
import GmailTable from "../../components/gmail/GmailTable";
import { gmailData } from "../../data/gmailData";
import type { Gmail } from "../../types/gmail";
import { getAssignedGmailsForUser, getCurrentUserName, upsertAssignedGmail } from "../../utils/gmailAssignments";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const emptyEditForm: Gmail = {
  id: 0,
  code: "",
  email: "",
  password: "",
  twoFA: "",
  phone: "",
  country: "",
  year: new Date().getFullYear(),
  status: "Active",
  owner: "",
  note: "",
};

function copyGmailInfo(gmail: Gmail) {
  const content = [
    `Code: ${gmail.code}`,
    `Email: ${gmail.email}`,
    `Password: ${gmail.password}`,
    `2FA: ${gmail.twoFA}`,
    `Phone: ${gmail.phone}`,
    `Country: ${gmail.country}`,
    `Year: ${gmail.year}`,
    `Status: ${gmail.status}`,
    `Owner: ${gmail.owner}`,
    `Note: ${gmail.note}`,
  ].join("\n");

  return navigator.clipboard.writeText(content);
}

function exportCsv(data: Gmail[]) {
  const headers = ["Code", "Email", "Password", "2FA", "Phone", "Country", "Year", "Status", "Owner", "Note"];
  const rows = data.map((gmail) => [
    gmail.code,
    gmail.email,
    gmail.password,
    gmail.twoFA,
    gmail.phone,
    gmail.country,
    gmail.year.toString(),
    gmail.status,
    gmail.owner,
    gmail.note,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "gmail-list.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function mergeGmails(defaultGmails: Gmail[], assignedGmails: Gmail[]) {
  const assignedCodes = new Set(assignedGmails.map((gmail) => gmail.code));

  return [...assignedGmails, ...defaultGmails.filter((gmail) => !assignedCodes.has(gmail.code))];
}

export default function GmailPage() {
  const currentUserName = getCurrentUserName();
  const [assignedGmails, setAssignedGmails] = useState(() => getAssignedGmailsForUser(currentUserName));
  const [gmails, setGmails] = useState<Gmail[]>(() => mergeGmails(gmailData, assignedGmails));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [viewingGmail, setViewingGmail] = useState<Gmail | null>(null);
  const [editingGmail, setEditingGmail] = useState<Gmail | null>(null);
  const [deletingGmail, setDeletingGmail] = useState<Gmail | null>(null);
  const [editForm, setEditForm] = useState<Gmail>(emptyEditForm);

  const filteredGmails = gmails.filter((gmail) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch = keyword
      ? [gmail.code, gmail.email, gmail.phone, gmail.owner, gmail.note]
          .some((value) => value.toLowerCase().includes(keyword))
      : true;
    const matchesStatus = status === "Tất cả trạng thái" || gmail.status === status;

    return matchesSearch && matchesStatus;
  });

  const activeCount = gmails.filter((gmail) => gmail.status === "Active").length;
  const warningCount = gmails.filter((gmail) => gmail.status !== "Active").length;
  const countries = new Set(gmails.map((gmail) => gmail.country)).size;
  const transferredCount = assignedGmails.length;

  const refreshAssignedGmails = () => {
    const latestAssignedGmails = getAssignedGmailsForUser(currentUserName);
    setAssignedGmails(latestAssignedGmails);
    setGmails(mergeGmails(gmailData, latestAssignedGmails));
  };

  const acceptAssignedGmail = (gmailCode: string) => {
    const assignedGmail = assignedGmails.find((gmail) => gmail.code === gmailCode);
    if (!assignedGmail) return;

    const nextAssignedGmail = { ...assignedGmail, usageStatus: "in_use" as const };
    upsertAssignedGmail(nextAssignedGmail);
    refreshAssignedGmails();
  };

  const openEdit = (gmail: Gmail) => {
    setEditingGmail(gmail);
    setEditForm(gmail);
  };

  const saveEdit = () => {
    setGmails((current) => current.map((gmail) => gmail.id === editForm.id ? editForm : gmail));
    setEditingGmail(null);
  };

  const confirmDelete = () => {
    if (!deletingGmail) return;
    setGmails((current) => current.filter((gmail) => gmail.id !== deletingGmail.id));
    setDeletingGmail(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-red-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">Gmail Workspace</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Quản lý Gmail của bạn</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Xem Gmail admin chuyển cho bạn, copy nhanh dữ liệu quan trọng và cập nhật trạng thái sử dụng.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-sm text-slate-300">Đang hiển thị</p>
            <strong className="text-3xl">{filteredGmails.length}</strong>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Mail admin chuyển cho {currentUserName}</h2>
            <p className="mt-1 text-sm text-slate-500">Khi admin giao Gmail trong kho, mail sẽ xuất hiện tại đây sau khi bấm làm mới.</p>
          </div>
          <button type="button" onClick={refreshAssignedGmails} className="inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
            <RefreshCcw size={18} />
            Làm mới mail được giao
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {assignedGmails.length > 0 ? assignedGmails.map((gmail) => (
            <div key={gmail.code} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-950">{gmail.email}</p>
                  <p className="mt-1 text-sm text-slate-500">{gmail.code} | Giao ngày {gmail.assignedAt}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${gmail.usageStatus === "in_use" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{gmail.usageStatus === "in_use" ? "Đang dùng" : "Đã giao"}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => setViewingGmail(gmail)} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Xem thông tin</button>
                <button type="button" onClick={() => acceptAssignedGmail(gmail.code)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"><UserCheck size={16} /> Nhận làm</button>
              </div>
            </div>
          )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 md:col-span-2 xl:col-span-3">Chưa có Gmail nào admin chuyển cho tài khoản này.</div>}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Gmail được cấp</p>
            <Mail className="text-blue-600" size={20} />
          </div>
          <strong className="mt-3 block text-2xl text-slate-950">{gmails.length}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Admin chuyển</p>
            <UserCheck className="text-blue-600" size={20} />
          </div>
          <strong className="mt-3 block text-2xl text-blue-600">{transferredCount}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Đang hoạt động</p>
            <ShieldCheck className="text-emerald-600" size={20} />
          </div>
          <strong className="mt-3 block text-2xl text-emerald-600">{activeCount}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Cần xử lý</p>
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <strong className="mt-3 block text-2xl text-red-600">{warningCount}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Quốc gia</p>
            <Users className="text-violet-600" size={20} />
          </div>
          <strong className="mt-3 block text-2xl text-violet-600">{countries}</strong>
        </div>
      </div>

      <GmailToolbar
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onExport={() => exportCsv(filteredGmails)}
      />

      <GmailTable
        data={filteredGmails}
        onView={setViewingGmail}
        onEdit={openEdit}
        onDelete={setDeletingGmail}
      />

      <Dialog open={Boolean(viewingGmail)} onOpenChange={(open) => !open && setViewingGmail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Gmail</DialogTitle>
          </DialogHeader>
          {viewingGmail && (
            <div className="grid gap-3 py-2 text-sm md:grid-cols-2">
              {Object.entries({
                "Mã Gmail": viewingGmail.code,
                Email: viewingGmail.email,
                "Mật khẩu": viewingGmail.password,
                "2FA": viewingGmail.twoFA,
                "Số điện thoại": viewingGmail.phone,
                "Quốc gia": viewingGmail.country,
                "Năm tạo": viewingGmail.year.toString(),
                "Trạng thái": viewingGmail.status,
                Owner: viewingGmail.owner,
                "Ghi chú": viewingGmail.note,
              }).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-slate-500">{label}</p>
                  <p className="mt-1 break-words font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <button onClick={() => viewingGmail && copyGmailInfo(viewingGmail)} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              <Copy size={17} />
              Copy tất cả
            </button>
            <button onClick={() => setViewingGmail(null)} className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800">
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingGmail)} onOpenChange={(open) => !open && setEditingGmail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa thông tin Gmail</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <input value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} className="rounded-xl border px-4 py-3" placeholder="Email" />
            <input value={editForm.password} onChange={(event) => setEditForm({ ...editForm, password: event.target.value })} className="rounded-xl border px-4 py-3" placeholder="Mật khẩu" />
            <input value={editForm.twoFA} onChange={(event) => setEditForm({ ...editForm, twoFA: event.target.value })} className="rounded-xl border px-4 py-3" placeholder="2FA" />
            <input value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} className="rounded-xl border px-4 py-3" placeholder="Số điện thoại" />
            <select value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value })} className="rounded-xl border px-4 py-3">
              <option>Active</option>
              <option>Locked</option>
              <option>Need Verify</option>
              <option>Recovery Required</option>
            </select>
            <input value={editForm.country} onChange={(event) => setEditForm({ ...editForm, country: event.target.value })} className="rounded-xl border px-4 py-3" placeholder="Quốc gia" />
            <textarea value={editForm.note} onChange={(event) => setEditForm({ ...editForm, note: event.target.value })} className="min-h-28 rounded-xl border px-4 py-3 md:col-span-2" placeholder="Ghi chú" />
          </div>
          <DialogFooter>
            <button onClick={() => setEditingGmail(null)} className="rounded-lg border px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
            <button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Lưu</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingGmail)} onOpenChange={(open) => !open && setDeletingGmail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa Gmail</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Bạn có chắc muốn xóa Gmail <strong>{deletingGmail?.email}</strong>? Thao tác này chỉ cập nhật trên giao diện hiện tại.
          </p>
          <DialogFooter>
            <button onClick={() => setDeletingGmail(null)} className="rounded-lg border px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700">Xóa</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
