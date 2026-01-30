import LayoutProvider from "@/providers/layout-provider";
import MobileAppPageClient from "./client";
import { Metadata } from "next";

const title = "Download our Mobile App - Pricetra";
const description =
  "Pricetra is available to download on the AppStore for iOS, and the Google PlayStore for Android.";
const image = "https://pricetra.com/screenshots/app-preview-generic.jpg";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image],
    url: "https://pricetra.com/download",
  },
};

export default function MobileAppPage() {
  return (
    <LayoutProvider>
      <MobileAppPageClient />
    </LayoutProvider>
  );
}
