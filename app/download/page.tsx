import LayoutProvider from "@/providers/layout-provider";
import MobileAppPageClient from "./client";

export const metadata = {
  title: "Download our Mobile App - Pricetra",
  description: "Pricetra is available to download on the AppStore for iOS, and the Google PlayStore for Android.",
  image: "https://pricetra.com/screenshots/app-preview-generic.jpg"
};

export default function MobileAppPage() {
  return <LayoutProvider>
    <MobileAppPageClient />
  </LayoutProvider>
}
