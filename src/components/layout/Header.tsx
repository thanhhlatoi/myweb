import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    CircleUserRound,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Settings,
    ShieldCheck,
} from "lucide-react";

interface Props {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/gmail": "Gmail",
    "/youtube": "YouTube",
    "/youtube-sources": "Nguồn YTB",
    "/salary": "Lương",
    "/viotp": "Thuê OTP",
    "/notifications": "Thông báo",
    "/settings": "Cài đặt",
};

const recentNotifications = [
    {
        title: "Admin cập nhật quy trình kiểm tra kênh",
        message: "Kiểm tra bản quyền và cảnh cáo cộng đồng trước khi bật kiếm tiền.",
        time: "10 phút trước",
        unread: true,
    },
    {
        title: "YouTube cập nhật chính sách tái sử dụng",
        message: "Kênh tổng hợp cần bổ sung giá trị sáng tạo rõ ràng.",
        time: "1 giờ trước",
        unread: true,
    },
    {
        title: "Bảo trì hệ thống thuê OTP",
        message: "Dịch vụ OTP sẽ bảo trì trong 30 phút vào tối nay.",
        time: "3 giờ trước",
        unread: false,
    },
];

export default function Header({ isSidebarOpen, onToggleSidebar }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const title = pageTitles[location.pathname] ?? "Dashboard";

    const openNotificationsPage = () => {
        setIsNotificationOpen(false);
        navigate("/notifications");
    };

    const goToSettings = () => {
        setIsUserMenuOpen(false);
        navigate("/settings");
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="rounded-xl border p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                        aria-label={isSidebarOpen ? "Ẩn sidebar" : "Hiện sidebar"}
                    >
                        {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-slate-950">{title}</h1>
                        <p className="text-sm text-slate-500">Quản lý nhanh thông tin và thao tác hệ thống</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Tìm Gmail, kênh, OTP, thông báo..."
                            className="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsNotificationOpen((value) => !value)}
                                className="relative rounded-xl border p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                                title="Thông báo"
                            >
                                <Bell size={20} />
                                <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                    2
                                </span>
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border bg-white shadow-xl">
                                    <div className="flex items-center justify-between border-b px-4 py-3">
                                        <div>
                                            <h2 className="font-bold text-slate-950">Thông báo mới</h2>
                                            <p className="text-xs text-slate-500">2 thông báo chưa đọc</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openNotificationsPage}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            Xem tất cả
                                        </button>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {recentNotifications.map((item) => (
                                            <button
                                                key={`${item.title}-${item.time}`}
                                                type="button"
                                                onClick={openNotificationsPage}
                                                className="flex w-full gap-3 border-b px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                                            >
                                                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.unread ? "bg-red-600" : "bg-slate-300"}`} />
                                                <span>
                                                    <span className="block font-semibold text-slate-950">{item.title}</span>
                                                    <span className="mt-1 block text-sm leading-5 text-slate-600">{item.message}</span>
                                                    <span className="mt-2 block text-xs font-medium text-slate-400">{item.time}</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/settings")}
                            className="rounded-xl border p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                            title="Cài đặt"
                        >
                            <Settings size={20} />
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((value) => !value)}
                                className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left transition hover:bg-slate-50"
                                title="Tài khoản"
                            >
                                <img
                                    src="https://i.pravatar.cc/40"
                                    alt="Avatar"
                                    className="h-9 w-9 rounded-full"
                                />
                                <div className="hidden text-sm md:block">
                                    <p className="font-semibold text-slate-950">Thanh</p>
                                    <p className="text-xs text-slate-500">Employee</p>
                                </div>
                                <ChevronDown className="hidden text-slate-400 md:block" size={16} />
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border bg-white shadow-xl">
                                    <div className="border-b p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://i.pravatar.cc/48"
                                                alt="Avatar"
                                                className="h-12 w-12 rounded-full"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-950">Thanh Nguyen</p>
                                                <p className="text-sm text-slate-500">thanh.nguyen@example.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            type="button"
                                            onClick={goToSettings}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                        >
                                            <CircleUserRound size={18} />
                                            Hồ sơ cá nhân
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goToSettings}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                        >
                                            <Settings size={18} />
                                            Cài đặt tài khoản
                                        </button>
                                        <button
                                            type="button"
                                            onClick={openNotificationsPage}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                        >
                                            <Bell size={18} />
                                            Thông báo của tôi
                                        </button>
                                    </div>

                                    <div className="border-t p-3">
                                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                            <ShieldCheck size={17} />
                                            Tài khoản đã xác minh
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
