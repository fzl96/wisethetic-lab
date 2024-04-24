import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export const convertToSlug = (text: string) => {
  return text.replace(/ /g, "-").replace(/[^\w-]+/g, "");
};

export const reverseSlug = (text: string) => {
  return text.replace(/-/g, " ");
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// create a function to get 5 characters from the start and end of a string and put ... in the middle
export const truncateString = (str: string) => {
  return str.slice(0, 7) + "..." + str.slice(-7);
};
