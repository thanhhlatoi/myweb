import GmailToolbar from "../../components/gmail/GmailToolbar";
import GmailTable from "../../components/gmail/GmailTable";
import { gmailData } from "../../data/gmailData";

export default function GmailPage() {
  return (
    <div className="space-y-6 p-6">

      <div>

        <h1 className="text-3xl font-bold">
          Gmail Management
        </h1>

        <p className="text-gray-500">
          Manage all Gmail accounts
        </p>

      </div>

      <GmailToolbar />

      <GmailTable data={gmailData} />

    </div>
  );
}