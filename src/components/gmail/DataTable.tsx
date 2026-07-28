import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead className="bg-slate-100">

            {table.getHeaderGroups().map((headerGroup) => (

              <tr key={headerGroup.id}>

                {headerGroup.headers.map((header) => (

                  <th
                    key={header.id}
                    className="border-b px-4 py-3 text-left font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >

                    <div className="flex items-center gap-2">

                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {header.column.getIsSorted() === "asc" && "▲"}

                      {header.column.getIsSorted() === "desc" && "▼"}

                    </div>

                  </th>

                ))}

              </tr>

            ))}

          </thead>

          <tbody>

            {table.getRowModel().rows.length ? (

              table.getRowModel().rows.map((row) => (

                <tr
                  key={row.id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  {row.getVisibleCells().map((cell) => (

                    <td
                      key={cell.id}
                      className="px-4 py-3"
                    >

                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}

                    </td>

                  ))}

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >

                  No data.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex items-center justify-between border-t px-4 py-4">

        <div className="text-sm text-gray-500">

          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1}
          </strong>{" "}
          / {table.getPageCount()}

        </div>

        <div className="flex gap-2">

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}