import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/login", { replace: true });
    };

    return (

        <div className="flex min-h-screen">

            {isSidebarOpen && (
                <Sidebar
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />
            )}

            <div className="min-h-screen min-w-0 flex-1 bg-slate-100">

                <Header
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
                />

                <div className="p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}
