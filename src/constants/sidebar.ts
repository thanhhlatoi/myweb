import {
  LayoutDashboard,
  Mail,
  Bell,
  BookOpenCheck,
  PlaySquare,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Gmail",
    path: "/gmail",
    icon: Mail,
  },
  {
    title: "YouTube",
    path: "/youtube",
    icon: PlaySquare,
  },
  {
    title: "Nguồn YTB",
    path: "/youtube-sources",
    icon: BookOpenCheck,
  },
  {
    title: "Lương",
    path: "/salary",
    icon: Wallet,
  },
  {
    title: "Thuê OTP",
    path: "/viotp",
    icon: ShieldCheck,
  },
  {
    title: "Thông báo",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Cài đặt",
    path: "/settings",
    icon: Settings,
  },
];
