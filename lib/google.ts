import { GA_TRACKING_ID } from "@/constants/google";

export function setGoogleAnalyticsUserId(userId?: string | null) {
  if (process.env.NODE_ENV === "production" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      user_id: userId ?? null,
    });
  }
}
