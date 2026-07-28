import { useState } from "react";
import { BookOpenCheck, Link2, ListChecks, Radar, Search, TrendingUp } from "lucide-react";
import CriteriaTab from "../../components/youtube-sources/CriteriaTab";
import SourceCheckTab from "../../components/youtube-sources/SourceCheckTab";
import SourceListTab from "../../components/youtube-sources/SourceListTab";
import TrendTab from "../../components/youtube-sources/TrendTab";
import YoutubeSourcesStats from "../../components/youtube-sources/YoutubeSourcesStats";
import { sources } from "../../components/youtube-sources/youtubeSourcesData";

const tabs = [
  { id: "trend", label: "Tìm trend", icon: TrendingUp },
  { id: "check", label: "Kiểm tra nguồn", icon: Search },
  { id: "sources", label: "Bảng nguồn", icon: BookOpenCheck },
  { id: "criteria", label: "Tiêu chí", icon: ListChecks },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function YoutubeSourcesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("trend");
  const recommendedCount = sources.filter((source) => source.verdict === "Nên tham khảo").length;
  const reviewCount = sources.filter((source) => source.verdict === "Cần kiểm tra").length;
  const rejectedCount = sources.filter((source) => source.verdict === "Không nên tham khảo").length;
  const averageScore = Math.round(
    sources.reduce((total, source) => total + source.score, 0) / sources.length
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-red-950 to-orange-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-200">
              Reference Sources
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Nguồn kênh YouTube tham khảo
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-orange-100">
              Lưu link chính chủ, tìm trend theo quốc gia và đánh giá nguồn nào
              nên dùng để tham khảo nội dung hoặc chính sách.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow transition hover:bg-orange-50">
            <Link2 size={18} />
            Lưu nguồn mới
          </button>
        </div>
      </div>

      <YoutubeSourcesStats
        total={sources.length}
        recommendedCount={recommendedCount}
        reviewCount={reviewCount}
        averageScore={averageScore}
      />

      <div className="rounded-2xl border bg-white p-3 shadow-sm">
        <div className="grid gap-2 md:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "trend" && <TrendTab />}
      {activeTab === "check" && <SourceCheckTab />}
      {activeTab === "sources" && <SourceListTab rejectedCount={rejectedCount} />}
      {activeTab === "criteria" && <CriteriaTab />}

      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        <Radar className="shrink-0 text-orange-600" size={20} />
        Các nút phía trên hoạt động như từng màn con trong cùng module, giúp không cần kéo dài trang.
      </div>
    </div>
  );
}
