"use server";

import ScanPageClient from "./scan-page-client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Scan UPCs or Product Labels - Pricetra";
  const description =
    "Simply point your camera at the product UPC/Barcode and find out prices near you.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://pricetra.com/scan",
    },
  };
}

export default async function ScanPageServer() {
  return (
    <ScanPageClient />
  );
}
