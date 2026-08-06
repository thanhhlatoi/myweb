import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const demoUsers = [
  { label: "Admin Thanh", email: "admin@ytmanager.local", password: "admin123", role: "admin", name: "Admin Thanh" },
  { label: "Thanh Nguyen", email: "thanh@company.local", password: "user123", role: "user", name: "Thanh Nguyen" },
  { label: "Minh Tran", email: "minh@company.local", password: "user123", role: "user", name: "Minh Tran" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState(demoUsers[0].password);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = demoUsers.find((item) => item.email === email && item.password === password);

    if (!user) {
      setMessage("Sai email hoặc mật khẩu demo.");
      return;
    }

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email, role: user.role }));
    navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
  };

  const fillDemoUser = (user: typeof demoUsers[number]) => {
    setEmail(user.email);
    setPassword(user.password);
    setMessage("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fafc_36%,#e2e8f0_100%)] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden bg-slate-950 p-10 text-white lg:block">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-bold"><ShieldCheck size={22} /> YT Manager</div>
          <h1 className="mt-10 text-4xl font-bold leading-tight">Đăng nhập hệ thống quản lý Gmail, YouTube, ViOTP.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">Dùng tài khoản demo để test nhanh luồng admin và user trước khi deploy backend thật.</p>
          <div className="mt-10 space-y-3 text-sm text-slate-300">
            <p>Admin: admin@ytmanager.local / admin123</p>
            <p>User: thanh@company.local / user123</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-950">Đăng nhập</h2>
          <p className="mt-2 text-sm text-slate-500">Chọn nhanh tài khoản demo hoặc nhập thông tin bên dưới.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {demoUsers.map((user) => (
              <button key={user.email} type="button" onClick={() => fillDemoUser(user)} className="rounded-2xl border bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50">
                <p className="font-bold text-slate-950">{user.label}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
              </button>
            ))}
          </div>

          {message && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div><label className="mb-2 block font-medium text-slate-700">Email</label><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <div><label className="mb-2 block font-medium text-slate-700">Password</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div>
            <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
}
