import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { POKEMON_API_BASE_URL } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string): string => {
  if (!name) return "";
  const nameParts = name.split(" ");
  return `${nameParts[0]?.[0] || ""}${nameParts[1]?.[0] || ""}`.toUpperCase();
};

// Base configuration for API requests
export const api = axios.create({
  baseURL: POKEMON_API_BASE_URL,
  timeout: 10 * 1000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
  timeout: 5 * 1000, // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});
