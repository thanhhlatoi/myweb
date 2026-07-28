import type { ColumnDef } from "@tanstack/react-table";
import { BarChart3, Eye, Pencil, Trash2 } from "lucide-react";
import type { YoutubeChannel } from "../../types/youtube";

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

export const youtubeColumns: ColumnDef<YoutubeChannel>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "channelName",
    header: "Channel",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900">{row.original.channelName}</p>
        <p className="text-sm text-slate-500">{row.original.handle}</p>
      </div>
    ),
  },
  {
    accessorKey: "subscribers",
    header: "Subscribers",
    cell: ({ row }) => formatNumber(row.original.subscribers),
  },
  {
    accessorKey: "videos",
    header: "Videos",
    cell: ({ row }) => formatNumber(row.original.videos),
  },
  {
    accessorKey: "monthlyViews",
    header: "Monthly Views",
    cell: ({ row }) => formatNumber(row.original.monthlyViews),
  },
  {
    accessorKey: "monetization",
    header: "Monetization",
    cell: ({ row }) => {
      const monetization = row.original.monetization;
      const className =
        monetization === "Enabled"
          ? "bg-emerald-100 text-emerald-700"
          : monetization === "Pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-600";

      return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
          {monetization}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const className =
        status === "Active"
          ? "bg-green-100 text-green-700"
          : status === "Review"
            ? "bg-blue-100 text-blue-700"
            : "bg-red-100 text-red-700";

      return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="flex justify-center gap-2 text-slate-600">
        <button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-950">
          <Eye size={17} />
        </button>
        <button className="rounded-lg p-2 transition hover:bg-blue-50 hover:text-blue-600">
          <Pencil size={17} />
        </button>
        <button className="rounded-lg p-2 transition hover:bg-violet-50 hover:text-violet-600">
          <BarChart3 size={17} />
        </button>
        <button className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-600">
          <Trash2 size={17} />
        </button>
      </div>
    ),
  },
];
