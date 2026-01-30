import LayoutProvider from "@/providers/layout-provider";
import AndroidClientPage from "./client";
import { Metadata } from "next";

const title = "Download our Android App - Pricetra";
const description =
  "Pricetra is available to download on the Google PlayStore for Android.";
const image = "https://pricetra.com/screenshots/app-preview-generic.jpg";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image],
  },
};

export default function AndroidAppPage() {
  return (
    <LayoutProvider>
      <AndroidClientPage />
    </LayoutProvider>
  );
}
