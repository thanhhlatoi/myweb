import { Bell } from "lucide-react";

export default function Header() {
    return (
        <header className="h-16 bg-white shadow flex justify-between items-center px-8">

            <h1 className="text-xl font-bold">
                Dashboard
            </h1>

            <div className="flex gap-6 items-center">

                <Bell />

                <img
                    src="https://i.pravatar.cc/40"
                    className="rounded-full"
                />

            </div>

        </header>
    );
}