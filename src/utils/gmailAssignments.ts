import type { Gmail } from "../types/gmail";

export type AssignedGmail = Gmail & {
  assignedTo: string;
  assignedAt: string;
  usageStatus: "assigned" | "in_use";
  source: "admin";
};

const STORAGE_KEY = "admin_assigned_gmails";

function normalizeEmployeeName(value: string) {
  return value.trim().toLowerCase();
}

export function getAssignedGmails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AssignedGmail[]) : [];
  } catch {
    return [];
  }
}

export function getAssignedGmailsForUser(userName: string) {
  const normalizedUser = normalizeEmployeeName(userName);

  return getAssignedGmails().filter((gmail) => normalizeEmployeeName(gmail.assignedTo) === normalizedUser);
}

export function upsertAssignedGmail(gmail: AssignedGmail) {
  const assignedGmails = getAssignedGmails();
  const nextAssignedGmails = [gmail, ...assignedGmails.filter((item) => item.code !== gmail.code)];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAssignedGmails));
}

export function removeAssignedGmail(code: string) {
  const nextAssignedGmails = getAssignedGmails().filter((gmail) => gmail.code !== code);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAssignedGmails));
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
