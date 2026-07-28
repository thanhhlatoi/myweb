import type { ColumnDef } from "@tanstack/react-table";
import type { Gmail } from "../../types/gmail";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const columns: ColumnDef<Gmail>[] = [
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "year",
        header: "Year",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                    row.original.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                }`}
            >
                {row.original.status}
            </span>
        ),
    },
    {
        accessorKey: "owner",
        header: "Owner",
    },
    {
        id: "actions",
        header: "Action",
        cell: () => (
            <div className="flex justify-center gap-2">
                <button>
                    <Eye size={18} />
                </button>

                <button>
                    <Pencil size={18} />
                </button>

                <button>
                    <Trash2 size={18} className="text-red-500" />
                </button>
            </div>
        ),
    },
];