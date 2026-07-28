import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/user/Dashboard";
import GmailPage from "../pages/user/Gmail";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route element={<UserLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gmail" element={<GmailPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}