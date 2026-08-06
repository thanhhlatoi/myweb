export type ViOtpRentalStatus = "Success" | "Waiting" | "Timeout" | "Refunded";

export type ViOtpRental = {
  id: string;
  user: string;
  service: string;
  phone: string;
  price: number;
  code: string;
  status: ViOtpRentalStatus;
  rentedAt: string;
  month: number;
  quarter: number;
  year: number;
};

const STORAGE_KEY = "viotp_rentals";

export function getViOtpRentals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ViOtpRental[]) : [];
  } catch {
    return [];
  }
}

export function getViOtpRentalsForUser(userName: string) {
  return getViOtpRentals().filter((rental) => rental.user.toLowerCase() === userName.toLowerCase());
}

export function upsertViOtpRental(rental: ViOtpRental) {
  const rentals = getViOtpRentals();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([rental, ...rentals.filter((item) => item.id !== rental.id)]));
}

export function getCurrentPeriod() {
  const now = new Date();
  const month = now.getMonth() + 1;
  return { month, quarter: Math.ceil(month / 3), year: now.getFullYear() };
}
