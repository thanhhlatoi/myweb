import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/login", { replace: true });
    };

    return (

        <div className="min-h-screen lg:flex">

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Đóng sidebar"
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />
            </div>

            <div className="min-h-screen min-w-0 flex-1 bg-slate-100">

                <Header
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
                />

                <div className="p-4 sm:p-6 lg:p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}
