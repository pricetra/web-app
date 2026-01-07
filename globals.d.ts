/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.css';

export {};

declare global {
  interface Window {
    gtag: (
      command: "config" | "set" | "event" | "js",
      targetIdOrParams?: string | Date | Record<string, any>,
      params?: Record<string, any>
    ) => void;
  }
}

