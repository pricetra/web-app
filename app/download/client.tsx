"use client";

import {
  AppStoreButton,
  GooglePlayButton,
} from "@/components/ui/app-store-buttons";
import { APP_STORE, PLAY_STORE } from "@/constants/mobile-app";

export default function MobileAppPageClient() {
  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen/2 px-5 py-10 flex flex-col items-center justify-center gap-10">
      <div className="text-center">
        <h1 className="font-bold text-2xl md:text-3xl">Download our Mobile App</h1>
        <p className="mt-5">Our mobile app makes it easy to browse, scan, report, and compare prices. Discover new stores, support local retailers, save money. Download our mobile app on Android or iOS for free.</p>
      </div>
      <div className="flex flex-col items-center gap-3 xs:flex-row">
        <AppStoreButton size="xl" href={APP_STORE} />
        <GooglePlayButton size="xl" href={PLAY_STORE} />
      </div>
    </div>
  );
}
