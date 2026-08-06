import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../pages/admin/layout/AdminLayout";
import Dashboard from "../pages/user/Dashboard";
import GmailPage from "../pages/user/Gmail";
import NotificationsPage from "../pages/user/Notifications";
import SalaryPage from "../pages/user/Salary";
import SettingsPage from "../pages/user/Settings";
import ViOtpPage from "../pages/user/ViOtp";
import YoutubePage from "../pages/user/Youtube";
import YoutubeSourcesPage from "../pages/user/YoutubeSources";
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import UserManagement from "../pages/admin/users/UserManagement";
import ProductManagement from "../pages/admin/products/ProductManagement";
import AdminSettings from "../pages/admin/settings/Settings";
import UserRevenue from "../pages/admin/revenue/UserRevenue";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications";
import AdminYoutubeChannels from "../pages/admin/youtube/AdminYoutubeChannels";
import AdsenseProducts from "../pages/admin/products/adsense/AdsenseProducts";
import ViOtpProducts from "../pages/admin/products/viotp/ViOtpProducts";
import GmailProducts from "../pages/admin/products/gmail/GmailProducts";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/login" element={<Login />} />

                <Route element={<UserLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gmail" element={<GmailPage />} />
                    <Route path="/youtube" element={<YoutubePage />} />
                    <Route path="/youtube-sources" element={<YoutubeSourcesPage />} />
                    <Route path="/salary" element={<SalaryPage />} />
                    <Route path="/viotp" element={<ViOtpPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/products/adsense" element={<AdsenseProducts />} />
                    <Route path="/admin/products/viotp" element={<ViOtpProducts />} />
                    <Route path="/admin/products/gmail" element={<GmailProducts />} />
                    <Route path="/admin/revenue" element={<UserRevenue />} />
                    <Route path="/admin/youtube" element={<AdminYoutubeChannels />} />
                    <Route path="/admin/notifications" element={<AdminNotifications />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
