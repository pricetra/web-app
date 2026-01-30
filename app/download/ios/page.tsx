import LayoutProvider from "@/providers/layout-provider";
import IosClientPage from "./client";

export const metadata = {
  title: "Download our iOS App - Pricetra",
  description: "Pricetra is available to download on the AppStore for iOS.",
  image: "https://pricetra.com/screenshots/app-preview-iphone.jpg"
};

export default function IosAppPage() {
  return <LayoutProvider>
    <IosClientPage />
  </LayoutProvider>
}
