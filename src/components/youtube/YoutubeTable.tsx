import { DataTable } from "../gmail/DataTable";
import type { YoutubeChannel } from "../../types/youtube";
import { youtubeColumns } from "./YoutubeColumns";

interface Props {
  data: YoutubeChannel[];
}

export default function YoutubeTable({ data }: Props) {
  return <DataTable columns={youtubeColumns} data={data} />;
}
