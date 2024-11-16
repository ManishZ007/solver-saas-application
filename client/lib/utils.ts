import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkDateStatus = (dbDateString: string): boolean => {
  const dbDate = new Date(dbDateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dbDate < yesterday) {
    return true;
  } else if (dbDate.getTime() === tomorrow.getTime()) {
    return false;
  } else {
    return false;
  }
};

export const checkUserRating = (ratings?: Array<RatingsType>, user?: User) => {
  const check = ratings?.filter();

  console.log(check);

  return check;
};
