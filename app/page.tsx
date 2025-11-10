import LandingPage from "@/app/LandingPage";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getIpAddressFromRequestHeaders } from "@/lib/strings";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pricetra - Your Price Tracking Companion",
  };
}

export default async function LandingPageServer() {
  const headerList = await headers();
  let ipAddress =
    getIpAddressFromRequestHeaders(headerList) ?? "46.110.121.165";
  if (process.env.NODE_ENV !== "production") {
    ipAddress = "70.91.104.137";
  }
  return <LandingPage ipAddress={ipAddress} />;
}
