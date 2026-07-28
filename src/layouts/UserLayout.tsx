import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1 bg-slate-100 min-h-screen">

                <Header />

                <div className="p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}