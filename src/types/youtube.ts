export type YoutubeChannelStatus = "Active" | "Review" | "Suspended";

export interface YoutubeChannel {
  id: string;
  channelName: string;
  handle: string;
  subscribers: number;
  videos: number;
  monthlyViews: number;
  monetization: "Enabled" | "Pending" | "Disabled";
  status: YoutubeChannelStatus;
  owner: string;
}
