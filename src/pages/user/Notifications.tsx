import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Megaphone,
  PlaySquare,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { getCurrentUserName, getNotificationsForUser, markUserNotificationsRead } from "../../utils/notifications";
import type { AppNotification } from "../../utils/notifications";
import Pagination from "../../components/ui/Pagination";
import { paginate } from "../../utils/pagination";

const defaultNotifications: AppNotification[] = [
  {
    id: "NTF-001",
    title: "Admin cập nhật quy trình kiểm tra kênh",
    message:
      "Từ hôm nay, tất cả kênh YouTube trước khi bật kiếm tiền cần kiểm tra trạng thái bản quyền và cảnh cáo cộng đồng.",
    sender: "Admin System",
    time: "10 phút trước",
    type: "Admin",
    priority: "Quan trọng",
    unread: true,
    audience: "all",
  },
  {
    id: "NTF-002",
    title: "YouTube cập nhật chính sách nội dung tái sử dụng",
    message:
      "Các kênh dùng nội dung tổng hợp cần bổ sung bình luận, chỉnh sửa hoặc giá trị sáng tạo rõ ràng để tránh bị từ chối kiếm tiền.",
    sender: "YouTube Policy",
    time: "1 giờ trước",
    type: "Chính sách YouTube",
    priority: "Cảnh báo",
    unread: true,
    audience: "all",
  },
  {
    id: "NTF-003",
    title: "Bảo trì hệ thống thuê OTP",
    message:
      "Dịch vụ thuê số OTP sẽ được bảo trì trong 30 phút vào tối nay. Các yêu cầu đang chạy vẫn được xử lý bình thường.",
    sender: "Admin System",
    time: "3 giờ trước",
    type: "Hệ thống",
    priority: "Bình thường",
    unread: false,
    audience: "all",
  },
  {
    id: "NTF-004",
    title: "Nhắc kiểm tra kênh có trạng thái Review",
    message:
      "Có 2 kênh YouTube đang ở trạng thái Review quá 48 giờ. Vui lòng kiểm tra lại thông tin xác minh và video gần nhất.",
    sender: "YT Manager",
    time: "Hôm qua, 18:24",
    type: "Cảnh báo kênh",
    priority: "Quan trọng",
    unread: false,
    audience: "all",
  },
  {
    id: "NTF-005",
    title: "Chính sách thumbnail và tiêu đề gây hiểu nhầm",
    message:
      "YouTube có thể hạn chế phân phối video nếu thumbnail hoặc tiêu đề phóng đại, gây hiểu nhầm hoặc không khớp nội dung chính.",
    sender: "YouTube Policy",
    time: "26/07/2026, 09:15",
    type: "Chính sách YouTube",
    priority: "Cảnh báo",
    unread: false,
    audience: "all",
  },
];

const filters = ["Tất cả", "Chưa đọc", "Admin", "Chính sách YouTube", "Cảnh báo kênh"];

function getTypeClass(type: string) {
  if (type === "Chính sách YouTube") return "bg-red-100 text-red-700";
  if (type === "Admin") return "bg-blue-100 text-blue-700";
  if (type === "Cảnh báo kênh") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function getPriorityClass(priority: string) {
  if (priority === "Quan trọng") return "bg-indigo-100 text-indigo-700";
  if (priority === "Cảnh báo") return "bg-orange-100 text-orange-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function NotificationsPage() {
  const currentUserName = getCurrentUserName();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => JSON.parse(localStorage.getItem("hidden_notifications") ?? "[]") as string[]);
  const [adminNotifications, setAdminNotifications] = useState(() => getNotificationsForUser(currentUserName));
  const [selectedNotification, setSelectedNotification] = useState<AppNotification>(() => adminNotifications[0] ?? defaultNotifications[0]);
  const notifications = [...adminNotifications, ...defaultNotifications];
  const filteredNotifications = notifications.filter((item) => {
    if (hiddenIds.includes(item.id)) return false;
    const matchesSearch = [item.title, item.message, item.sender, item.type, item.targetUser ?? ""].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "Tất cả" || (activeFilter === "Chưa đọc" ? item.unread : item.type === activeFilter);

    return matchesSearch && matchesFilter;
  });
  const unreadCount = notifications.filter((item) => item.unread).length;
  const policyCount = notifications.filter((item) => item.type === "Chính sách YouTube").length;
  const adminCount = notifications.filter((item) => item.type === "Admin").length;
  const paginatedNotifications = paginate(filteredNotifications, page, pageSize);

  const hideNotification = (id: string) => {
    const nextHiddenIds = [...hiddenIds, id];
    setHiddenIds(nextHiddenIds);
    localStorage.setItem("hidden_notifications", JSON.stringify(nextHiddenIds));
  };

  const handleMarkAllRead = () => {
    markUserNotificationsRead(currentUserName);
    setAdminNotifications(getNotificationsForUser(currentUserName));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-zinc-900 to-red-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">
              Notification Center
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Thông báo</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Nhận thông tin mới nhất từ admin, cảnh báo hệ thống và các cập
              nhật chính sách quan trọng của YouTube. Đang xem dưới tài khoản {currentUserName}.
            </p>
          </div>

          <button onClick={handleMarkAllRead} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-red-50">
            <CheckCheck size={18} />
            Đánh dấu đã đọc
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng thông báo</p>
          <strong className="mt-3 block text-2xl text-slate-950">{notifications.length}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Chưa đọc</p>
          <strong className="mt-3 block text-2xl text-red-600">{unreadCount}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Chính sách YouTube</p>
          <strong className="mt-3 block text-2xl text-orange-600">{policyCount}</strong>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Từ admin</p>
          <strong className="mt-3 block text-2xl text-blue-600">{adminCount}</strong>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="Tìm thông báo, người gửi hoặc chính sách..."
              className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
            {filters.map((filter, index) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setPage(1); }}
                className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeFilter === filter || (index === 0 && activeFilter === "Tất cả")
                    ? "bg-slate-950 text-white"
                    : "border bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {paginatedNotifications.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedNotification(item)}
              className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                item.unread ? "border-red-200 ring-4 ring-red-50" : ""
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    {item.type === "Chính sách YouTube" ? (
                      <PlaySquare size={22} />
                    ) : item.type === "Cảnh báo kênh" ? (
                      <AlertTriangle size={22} />
                    ) : item.type === "Admin" ? (
                      <Megaphone size={22} />
                    ) : (
                      <Bell size={22} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-950">{item.title}</h2>
                      {item.unread && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {item.message}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeClass(item.type)}`}>
                        {item.type}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <button type="button" onClick={(event) => { event.stopPropagation(); hideNotification(item.id); }} className="mt-3 text-xs font-semibold text-slate-400 hover:text-red-600">Ẩn thông báo</button>
                  </div>
                </div>

                <div className="shrink-0 text-sm text-slate-500 lg:text-right">
                  <p className="font-medium text-slate-700">{item.sender}</p>
                  <p>{item.time}</p>
                </div>
              </div>
            </button>
          ))}
          <Pagination page={page} pageSize={pageSize} total={filteredNotifications.length} onPageChange={setPage} onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }} />
        </div>

        <div className="h-fit rounded-2xl border bg-white p-5 shadow-sm xl:sticky xl:top-20">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={20} />
            <h2 className="font-bold">Chi tiết nổi bật</h2>
          </div>

          <h3 className="mt-4 text-xl font-bold text-slate-950">
            {selectedNotification.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {selectedNotification.message}
          </p>

          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Người gửi</span>
              <span className="font-semibold text-slate-950">{selectedNotification.sender}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Thời gian</span>
              <span className="font-semibold text-slate-950">{selectedNotification.time}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Phân loại</span>
              <span className="font-semibold text-slate-950">{selectedNotification.type}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Người nhận</span>
              <span className="font-semibold text-slate-950">{selectedNotification.audience === "all" ? "Tất cả user" : selectedNotification.targetUser}</span>
            </div>
          </div>

          <button className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700">
            Xem chi tiết đầy đủ
          </button>
        </div>
      </div>
    </div>
  );
}
