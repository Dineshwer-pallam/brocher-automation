import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ensure this is installed if cn is used, although it wasn't strictly in Prompt 1.
// Since it wasn't requested strictly to have clsx and tailwind-merge, I'll provide a simpler cn fallback if they aren't installed.
export function safeCn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
