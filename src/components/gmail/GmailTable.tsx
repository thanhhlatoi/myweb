import type { Gmail } from "../../types/gmail";
import { columns } from "./GmailColumns";
import { DataTable } from "./DataTable";

interface Props {
    data: Gmail[];
}

export default function GmailTable({ data }: Props) {
    return (
        <DataTable
            columns={columns}
            data={data}
        />
    );
}