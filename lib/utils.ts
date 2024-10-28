/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from 'qs';
import { twMerge } from "tailwind-merge";

import { aspectRatioOptions } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

// PLACEHOLDER LOADER - while image is transforming
const shimmer = (width: number, height: number): string => `
<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#7986AC" />
  <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

// FORM URL QUERY
export interface FormUrlQueryParams {
  searchParams: URLSearchParams;
  key: string;
  value: string;
}

export const formUrlQuery = ({ searchParams, key, value }: FormUrlQueryParams): string => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, { skipNulls: true })}`;
};

// REMOVE KEY FROM QUERY
export interface RemoveUrlQueryParams {
  searchParams: URLSearchParams;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({ searchParams, keysToRemove }: RemoveUrlQueryParams): string => {
  const currentUrl = qs.parse(searchParams.toString()) as Record<string, unknown>;

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach((key) => {
    if (currentUrl[key] == null) delete currentUrl[key];
  });

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
};

// DEBOUNCE
export const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout | null;
  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// GET IMAGE SIZE
export type AspectRatioKey = keyof typeof aspectRatioOptions;

export interface Image {
  aspectRatio?: AspectRatioKey;
  width?: number;
  height?: number;
}

export const getImageSize = (
  type: "fill" | "default",
  image: Image,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return aspectRatioOptions[image.aspectRatio ?? "default"]?.[dimension] || 1000;
  }
  return image[dimension] || 1000;
};

// DOWNLOAD IMAGE
export const download = (url: string, filename: string): void => {
  if (!url) throw new Error("Resource URL not provided! You need to provide one");

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.download = `${filename.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobURL);
    })
    .catch((error) => console.error("Download failed:", error));
};

// DEEP MERGE OBJECTS
export const deepMergeObjects = <T extends Record<string, unknown>, U extends Record<string, unknown>>(obj1: T, obj2: U | null | undefined): T & U => {
  if (obj2 === null || obj2 === undefined) return obj1;

  const output = { ...obj2 } as T & U;

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (typeof obj1[key] === "object" && obj1[key] !== null && typeof obj2[key] === "object" && obj2[key] !== null) {
        output[key] = deepMergeObjects(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>) as T[keyof T];
      } else {
        output[key] = obj1[key] as T[keyof T];
      }
    }
  }

  return output;
};
