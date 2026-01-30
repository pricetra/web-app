import LayoutProvider from "@/providers/layout-provider";
import AndroidClientPage from "./client";

export const metadata = {
  title: "Download our Android App - Pricetra",
  description: "Pricetra is available to download on the Google PlayStore for Android.",
  image: "https://pricetra.com/screenshots/app-preview-generic.jpg"
};

export default function AndroidAppPage() {
  return <LayoutProvider>
    <AndroidClientPage />
  </LayoutProvider>
}
