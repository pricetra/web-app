import LayoutProvider from "@/providers/layout-provider";
import IosClientPage from "./client";
import { Metadata } from "next";

const title = "Download our iOS App - Pricetra";
const description =
  "Pricetra is available to download on the AppStore for iOS.";
const image = "https://pricetra.com/screenshots/app-preview-iphone.jpg";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image],
  },
};

export default function IosAppPage() {
  return (
    <LayoutProvider>
      <IosClientPage />
    </LayoutProvider>
  );
}
