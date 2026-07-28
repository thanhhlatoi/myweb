import GmailDialog from "./GmailDialog";

export default function GmailToolbar() {
  return (
    <div className="flex items-center justify-between">

      <input
        placeholder="Search Gmail..."
        className="w-96 rounded-lg border px-4 py-2"
      />

      <div className="flex gap-3">

        <button className="rounded-lg border px-4 py-2">
          Export
        </button>

        <GmailDialog />

      </div>

    </div>
  );
}