import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { sidebarMenu } from "../../constants/sidebar";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700 p-6">

        {/* <Youtube size={32} className="text-red-500" /> */}

        <div>
          <h1 className="text-xl font-bold">YT Manager</h1>
          <p className="text-xs text-slate-400">
            User Dashboard
          </p>
        </div>

      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-5">

        {sidebarMenu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >

              <Icon size={20} />

              <span>{item.title}</span>

            </NavLink>

          );

        })}

      </nav>

      {/* User */}
      <div className="border-t border-slate-700 p-4">

        <div className="mb-4 flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="h-10 w-10 rounded-full"
          />

          <div>

            <h3 className="font-semibold">
              Thanh
            </h3>

            <p className="text-xs text-slate-400">
              Employee
            </p>

          </div>

        </div>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-red-500 hover:text-white">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}