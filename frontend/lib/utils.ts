import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function toTitleCase(str: string): string {
  return str.replace(
    /\b[A-Z]+\b/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
