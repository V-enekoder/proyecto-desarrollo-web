import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const regex = /\b\w/g;
  const initials = name.match(regex)?.join("").toUpperCase() || "";
  return initials.slice(0, 2);
}
