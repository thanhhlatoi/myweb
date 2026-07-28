import type { Gmail } from "../../types/gmail";
import { createGmailColumns } from "./GmailColumns";
import { DataTable } from "./DataTable";

interface Props {
    data: Gmail[];
    onView: (gmail: Gmail) => void;
    onEdit: (gmail: Gmail) => void;
    onDelete: (gmail: Gmail) => void;
}

export default function GmailTable({ data, onView, onEdit, onDelete }: Props) {
    const columns = createGmailColumns({ onView, onEdit, onDelete });

    return (
        <DataTable
            columns={columns}
            data={data}
        />
    );
}
