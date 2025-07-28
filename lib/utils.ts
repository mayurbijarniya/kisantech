import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "₹0";
  }
  return price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}