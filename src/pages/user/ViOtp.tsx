import { useState } from "react";
import { Copy, KeyRound, Phone, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { getCurrentUserName } from "../../utils/notifications";
import { getCurrentPeriod, getViOtpRentalsForUser, upsertViOtpRental } from "../../utils/viotpRentals";

type OtpOrder = { id: string; service: string; phone: string; price: number; code: string; timeLeft: string; status: "Đã nhận OTP" | "Đang chờ" | "Hết hạn" };

const initialOtpOrders: OtpOrder[] = [
  {
    id: "OTP-1001",
    service: "YouTube",
    phone: "0867 234 901",
    price: 1800,
    code: "482913",
    timeLeft: "02:14",
    status: "Đã nhận OTP",
  },
  {
    id: "OTP-1002",
    service: "Gmail",
    phone: "0912 884 620",
    price: 1500,
    code: "Đang chờ",
    timeLeft: "04:32",
    status: "Đang chờ",
  },
  {
    id: "OTP-1003",
    service: "Facebook",
    phone: "0775 119 345",
    price: 2200,
    code: "913047",
    timeLeft: "01:05",
    status: "Đã nhận OTP",
  },
  {
    id: "OTP-1004",
    service: "Telegram",
    phone: "0398 541 778",
    price: 2500,
    code: "Hết hạn",
    timeLeft: "00:00",
    status: "Hết hạn",
  },
];

const services = ["YouTube", "Gmail", "Facebook", "Telegram", "TikTok", "Shopee"];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default function ViOtpPage() {
  const currentUserName = getCurrentUserName();
  const savedRentals = getViOtpRentalsForUser(currentUserName).map((rental) => ({
    id: rental.id,
    service: rental.service,
    phone: rental.phone,
    price: rental.price,
    code: rental.code,
    timeLeft: rental.status === "Waiting" ? "05:00" : "03:12",
    status: rental.status === "Success" ? "Đã nhận OTP" : rental.status === "Waiting" ? "Đang chờ" : "Hết hạn",
  } satisfies OtpOrder));
  const [otpOrders, setOtpOrders] = useState(() => [...savedRentals, ...initialOtpOrders]);
  const [service, setService] = useState("YouTube");
  const [carrier, setCarrier] = useState("Tất cả nhà mạng");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const filteredOrders = otpOrders.filter((order) => [order.id, order.service, order.phone, order.code, order.status].join(" ").toLowerCase().includes(search.toLowerCase()));
  const totalSpent = otpOrders.reduce((total, order) => total + order.price, 0);
  const successOrders = otpOrders.filter((order) => order.status === "Đã nhận OTP").length;

  const rentNumber = () => {
    const nextOrder: OtpOrder = {
      id: `OTP-${1000 + otpOrders.length + 1}`,
      service,
      phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
      price: service === "Telegram" ? 2500 : service === "Facebook" ? 2200 : service === "YouTube" ? 1800 : 1500,
      code: "Đang chờ",
      timeLeft: "05:00",
      status: "Đang chờ",
    };
    const period = getCurrentPeriod();

    setOtpOrders((current) => [nextOrder, ...current]);
    upsertViOtpRental({
      id: nextOrder.id,
      user: currentUserName,
      service: nextOrder.service,
      phone: nextOrder.phone,
      price: nextOrder.price,
      code: nextOrder.code,
      status: "Waiting",
      rentedAt: new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
      ...period,
    });
    setMessage(`Đã thuê số ${nextOrder.phone} cho ${service}${carrier !== "Tất cả nhà mạng" ? ` (${carrier})` : ""}.`);
  };

  const refreshOrder = (id: string) => {
    setOtpOrders((current) => current.map((order) => {
      if (order.id !== id || order.status !== "Đang chờ") return order;
      const nextOrder = { ...order, code: String(Math.floor(100000 + Math.random() * 899999)), status: "Đã nhận OTP" as const, timeLeft: "03:12" };
      const period = getCurrentPeriod();
      upsertViOtpRental({ id: nextOrder.id, user: currentUserName, service: nextOrder.service, phone: nextOrder.phone, price: nextOrder.price, code: nextOrder.code, status: "Success", rentedAt: new Date().toLocaleString("vi-VN"), ...period });
      return nextOrder;
    }));
    setMessage(`Đã cập nhật trạng thái ${id}.`);
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setMessage("Đã copy vào clipboard.");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
              ViOTP Rental
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Thuê số OTP ViOTP</h1>
            <p className="mt-2 max-w-2xl text-sm text-cyan-100">
              Chọn dịch vụ, thuê số điện thoại nhận OTP và theo dõi mã xác minh
              theo thời gian thực.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-cyan-50">
            <Phone size={18} />
            Thuê số mới
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Số đang thuê</p>
          <strong className="mt-3 block text-2xl text-slate-950">{otpOrders.length}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Nhận OTP thành công</p>
          <strong className="mt-3 block text-2xl text-emerald-600">{successOrders}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Chi phí hôm nay</p>
          <strong className="mt-3 block text-2xl text-cyan-600">{formatCurrency(totalSpent)}</strong>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
            <KeyRound size={20} />
            Tạo yêu cầu thuê số
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Dịch vụ</label>
              <select value={service} onChange={(event) => setService(event.target.value)} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100">
                {services.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">Nhà mạng</label>
              <select value={carrier} onChange={(event) => setCarrier(event.target.value)} className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100">
                <option>Tất cả nhà mạng</option>
                <option>Viettel</option>
                <option>Mobifone</option>
                <option>Vinaphone</option>
              </select>
            </div>

            <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-800">
              Giá dự kiến từ <strong>1.500đ</strong> đến <strong>2.500đ</strong> cho mỗi số.
            </div>

            {message && <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</div>}

            <button onClick={rentNumber} className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700">
              Thuê số ngay
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <ShieldCheck size={20} />
              Lịch sử thuê số
            </h2>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm số, dịch vụ hoặc mã OTP..."
                className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100 text-left text-sm text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã thuê</th>
                  <th className="px-4 py-3 font-semibold">Dịch vụ</th>
                  <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                  <th className="px-4 py-3 font-semibold">OTP</th>
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                  <th className="px-4 py-3 font-semibold">Giá</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusClass =
                    order.status === "Đã nhận OTP"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "Đang chờ"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700";

                  return (
                    <tr key={order.id} className="border-b transition hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-700">{order.id}</td>
                      <td className="px-4 py-4 font-semibold text-slate-950">{order.service}</td>
                      <td className="px-4 py-4">{order.phone}</td>
                      <td className="px-4 py-4 font-bold text-cyan-700">{order.code}</td>
                      <td className="px-4 py-4">{order.timeLeft}</td>
                      <td className="px-4 py-4">{formatCurrency(order.price)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => copyText(`${order.phone} | OTP: ${order.code}`)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                            <Copy size={17} />
                          </button>
                          <button onClick={() => refreshOrder(order.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-600">
                            <RefreshCw size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
