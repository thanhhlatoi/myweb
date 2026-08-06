import { useState } from "react";
import type { ChangeEvent } from "react";
import { Bell, Database, KeyRound, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";

type AdminProfile = { name: string; email: string; role: string };
type QuickConfig = { gmailLimit: number; otpWarning: number; logRetention: number };

const settingsGroups = [
  { title: "Bảo mật", description: "Thiết lập đăng nhập, phiên làm việc và xác thực admin.", icon: ShieldCheck, items: ["Bật xác thực 2 lớp cho admin", "Tự động đăng xuất sau 30 phút", "Khóa tài khoản sau 5 lần sai mật khẩu"] },
  { title: "Thông báo", description: "Quản lý cảnh báo vận hành và email hệ thống.", icon: Bell, items: ["Cảnh báo tồn kho thấp", "Cảnh báo OTP timeout", "Gửi báo cáo cuối ngày"] },
  { title: "Dữ liệu", description: "Đồng bộ, backup và giữ lịch sử thao tác.", icon: Database, items: ["Backup tự động mỗi ngày", "Lưu log thao tác admin", "Đồng bộ dữ liệu lương"] },
];

const initialToggles = settingsGroups.flatMap((group) => group.items).reduce<Record<string, boolean>>((state, item) => ({ ...state, [item]: true }), {});

export default function AdminSettings() {
  const [profile, setProfile] = useState<AdminProfile>({ name: "Admin Thanh", email: "admin@ytmanager.local", role: "Super Admin" });
  const [quickConfig, setQuickConfig] = useState<QuickConfig>({ gmailLimit: 500, otpWarning: 10, logRetention: 90 });
  const [toggles, setToggles] = useState(initialToggles);
  const [message, setMessage] = useState("");

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleConfigChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuickConfig((current) => ({ ...current, [event.target.name]: Number(event.target.value) }));
  };

  const saveSettings = () => {
    setMessage(`Đã lưu cấu hình cho ${profile.name}. ${Object.values(toggles).filter(Boolean).length} thiết lập đang bật.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 p-6 text-white shadow-lg"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">System Settings</p><h1 className="mt-3 text-3xl font-bold md:text-4xl">Cài đặt hệ thống</h1><p className="mt-2 max-w-2xl text-sm text-slate-300">Cấu hình bảo mật, thông báo, dữ liệu và quyền truy cập cho khu vực admin.</p></div><button type="button" onClick={saveSettings} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-blue-50"><Save size={18} /> Lưu thay đổi</button></div></section>

      {message && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">{message}</div>}

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><KeyRound size={20} /> Thông tin admin</h2><div className="mt-5 space-y-4"><Field label="Tên hiển thị" name="name" value={profile.name} onChange={handleProfileChange} /><Field label="Email admin" name="email" value={profile.email} onChange={handleProfileChange} /><div><label className="text-sm font-semibold text-slate-600">Vai trò mặc định</label><select name="role" value={profile.role} onChange={handleProfileChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"><option>Super Admin</option><option>Manager</option><option>Operator</option></select></div></div></div>

        <div className="space-y-4">
          {settingsGroups.map((group) => {
            const Icon = group.icon;
            return <div key={group.title} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex gap-3"><div className="h-fit rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon size={21} /></div><div><h2 className="text-lg font-bold text-slate-950">{group.title}</h2><p className="mt-1 text-sm text-slate-500">{group.description}</p></div></div><div className="mt-5 space-y-3">{group.items.map((item) => <label key={item} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><span className="font-medium text-slate-700">{item}</span><input type="checkbox" checked={toggles[item]} onChange={(event) => setToggles((current) => ({ ...current, [item]: event.target.checked }))} className="h-5 w-5 accent-blue-600" /></label>)}</div></div>;
          })}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><SlidersHorizontal size={20} /> Cấu hình nhanh</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><NumberConfig label="Giới hạn tạo Gmail/ngày" name="gmailLimit" value={quickConfig.gmailLimit} color="text-slate-950" onChange={handleConfigChange} /><NumberConfig label="Ngưỡng cảnh báo OTP (%)" name="otpWarning" value={quickConfig.otpWarning} color="text-amber-600" onChange={handleConfigChange} /><NumberConfig label="Thời gian giữ log (ngày)" name="logRetention" value={quickConfig.logRetention} color="text-blue-600" onChange={handleConfigChange} /></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setQuickConfig({ gmailLimit: 500, otpWarning: 10, logRetention: 90 })} className="rounded-xl border px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Khôi phục mặc định</button><button type="button" onClick={saveSettings} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Áp dụng cấu hình</button></div></section>
    </div>
  );
}

function Field({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <div><label className="text-sm font-semibold text-slate-600">{label}</label><input name={name} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>;
}

function NumberConfig({ label, name, value, color, onChange }: { label: string; name: string; value: number; color: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="rounded-2xl bg-slate-50 p-4"><span className="text-sm text-slate-500">{label}</span><input type="number" name={name} value={value} onChange={onChange} className={`mt-2 block w-full bg-transparent text-2xl font-bold outline-none ${color}`} /></label>;
}
