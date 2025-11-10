import LandingPage from "@/components/pages/LandingPage";
import { headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pricetra - Your Price Tracking Companion",
  };
}

export default async function LandingPageServer() {
  const headerList = await headers();
  let ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ??
    headerList.get("x-real-ip") ??
    "46.110.121.165";
  if (process.env.NODE_ENV !== "production") {
    ipAddress = "70.91.104.137";
  }
  return <LandingPage ipAddress={ipAddress} />;
}
