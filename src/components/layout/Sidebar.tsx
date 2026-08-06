import { NavLink } from "react-router-dom";
import { LogOut, PanelLeftClose } from "lucide-react";
import { sidebarMenu } from "../../constants/sidebar";
import { getCurrentUserName } from "../../utils/notifications";

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ onClose, onLogout }: Props) {
  const currentUserName = getCurrentUserName();

  return (
    <aside className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col bg-slate-900 text-white">

      {/* Logo */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 p-6">

        {/* <Youtube size={32} className="text-red-500" /> */}

        <div>
          <h1 className="text-xl font-bold">YT Manager</h1>
          <p className="text-xs text-slate-400">
            User Dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Ẩn sidebar"
        >
          <PanelLeftClose size={20} />
        </button>

      </div>

      {/* Menu */}
      <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5">

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
      <div className="shrink-0 border-t border-slate-700 p-4">

        <div className="mb-4 flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="h-10 w-10 rounded-full"
          />

          <div>

            <h3 className="font-semibold">
              {currentUserName}
            </h3>

            <p className="text-xs text-slate-400">
              Employee
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-red-500 hover:text-white"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}
