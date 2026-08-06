export type NotificationPriority = "Quan trọng" | "Cảnh báo" | "Bình thường";
export type NotificationAudience = "all" | "user";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  sender: string;
  time: string;
  type: string;
  priority: NotificationPriority;
  unread: boolean;
  audience: NotificationAudience;
  targetUser?: string;
};

const STORAGE_KEY = "admin_notifications";

function normalizeUser(value: string) {
  return value.trim().toLowerCase();
}

export function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

export function saveNotification(notification: AppNotification) {
  const notifications = getStoredNotifications();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([notification, ...notifications]));
}

export function getNotificationsForUser(userName: string) {
  const normalizedUser = normalizeUser(userName);

  return getStoredNotifications().filter((notification) => (
    notification.audience === "all" || normalizeUser(notification.targetUser ?? "") === normalizedUser
  ));
}

export function markUserNotificationsRead(userName: string) {
  const normalizedUser = normalizeUser(userName);
  const notifications = getStoredNotifications().map((notification) => {
    const matchesUser = notification.audience === "all" || normalizeUser(notification.targetUser ?? "") === normalizedUser;
    return matchesUser ? { ...notification, unread: false } : notification;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function getCurrentUserName() {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return "Thanh Nguyen";

    const user = JSON.parse(rawUser) as { name?: string; fullName?: string; email?: string };
    return user.name || user.fullName || user.email || "Thanh Nguyen";
  } catch {
    return "Thanh Nguyen";
  }
}
