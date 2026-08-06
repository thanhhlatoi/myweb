import type { ColumnDef } from "@tanstack/react-table";
import type { Gmail } from "../../types/gmail";
import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";
import { CopyableText, PasswordCell } from "./GmailCellComponents";

interface GmailActions {
  onView: (gmail: Gmail) => void;
  onEdit: (gmail: Gmail) => void;
  onDelete: (gmail: Gmail) => void;
}

export function createGmailColumns({ onView, onEdit, onDelete }: GmailActions): ColumnDef<Gmail>[] {
  return [
    {
      accessorKey: "code",
      header: "Mã Gmail",
    },
    {
      accessorKey: "email",
      header: "Tài khoản",
      cell: ({ row }) => (
        <div>
          <CopyableText value={row.original.email} className="font-semibold text-slate-950" />
          <p className="text-sm text-slate-500">Owner: {row.original.owner}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => <CopyableText value={row.original.phone} />,
    },
    {
      accessorKey: "password",
      header: "Mật khẩu",
      cell: ({ row }) => <PasswordCell value={row.original.password} />,
    },
    {
      accessorKey: "country",
      header: "Quốc gia",
    },
    {
      accessorKey: "year",
      header: "Năm tạo",
    },
    {
      accessorKey: "twoFA",
      header: "2FA",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1 py-0.5 text-xs font-semibold text-slate-700">
          <KeyRound size={14} />
          <CopyableText value={row.original.twoFA} className="py-0 text-xs" />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const statusClass = row.original.status === "Active"
          ? "bg-emerald-100 text-emerald-700"
          : row.original.status === "Locked"
            ? "bg-red-100 text-red-600"
            : "bg-amber-100 text-amber-700";

        return (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => <CopyableText value={row.original.note} className="max-w-64 text-sm text-slate-600" />,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2 text-slate-600">
          <button onClick={() => onView(row.original)} className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-950" title="Xem chi tiết">
            <Eye size={17} />
          </button>
          <button onClick={() => onEdit(row.original)} className="rounded-lg p-2 transition hover:bg-blue-50 hover:text-blue-600" title="Sửa thông tin">
            <Pencil size={17} />
          </button>
          <button onClick={() => onDelete(row.original)} className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-600" title="Xóa Gmail">
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];
}
