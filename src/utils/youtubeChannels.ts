import type { YoutubeChannel } from "../types/youtube";

export type SubmittedYoutubeChannel = YoutubeChannel & {
  channelUrl: string;
  channelStage: NonNullable<YoutubeChannel["channelStage"]>;
  gmailCode: string;
  gmailEmail: string;
  submittedAt: string;
  adminNote: string;
};

const STORAGE_KEY = "submitted_youtube_channels";

export function getSubmittedYoutubeChannels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubmittedYoutubeChannel[]) : [];
  } catch {
    return [];
  }
}

export function getSubmittedYoutubeChannelsByUser(userName: string) {
  return getSubmittedYoutubeChannels().filter((channel) => channel.owner.toLowerCase() === userName.toLowerCase());
}

export function saveSubmittedYoutubeChannel(channel: SubmittedYoutubeChannel) {
  const channels = getSubmittedYoutubeChannels();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([channel, ...channels.filter((item) => item.id !== channel.id)]));
}

export function updateSubmittedYoutubeChannel(id: string, patch: Partial<SubmittedYoutubeChannel>) {
  const channels = getSubmittedYoutubeChannels().map((channel) => channel.id === id ? { ...channel, ...patch } : channel);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  return channels;
}

export function extractYoutubeHandle(channelUrl: string) {
  const trimmedUrl = channelUrl.trim();
  const handle = trimmedUrl.match(/@([a-zA-Z0-9._-]+)/)?.[0];
  if (handle) return handle;

  const channelId = trimmedUrl.match(/channel\/([a-zA-Z0-9_-]+)/)?.[1];
  if (channelId) return `channel/${channelId}`;

  return trimmedUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/").filter(Boolean).slice(-1)[0] || "@channel";
}
