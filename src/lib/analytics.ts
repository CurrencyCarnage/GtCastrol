import type { AnalyticsEvent } from "@/types/domain";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: event.name, ...event.payload });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event.name, event.payload);
  }
}
