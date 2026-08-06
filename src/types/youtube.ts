export type YoutubeChannelStatus = "Active" | "Review" | "Suspended";
export type YoutubeChannelStage = "Kênh trắng" | "Kênh kiếm tiền" | "Chờ đủ giờ" | "Đang bấm";

export interface YoutubeChannel {
  id: string;
  channelName: string;
  handle: string;
  channelUrl?: string;
  channelStage?: YoutubeChannelStage;
  gmailCode?: string;
  gmailEmail?: string;
  submittedAt?: string;
  adminNote?: string;
  subscribers: number;
  videos: number;
  monthlyViews: number;
  monetization: "Enabled" | "Pending" | "Disabled";
  status: YoutubeChannelStatus;
  owner: string;
}
