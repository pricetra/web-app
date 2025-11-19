import LandingPage from "@/app/landing-page-client";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { getIpAddressFromRequestHeaders } from "@/lib/strings";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Pricetra - Your Price Tracking Companion";
  const description =
    "Monitor price changes across thousands of products and never overpay again. Get alerts when prices drop and make smarter purchasing decisions.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://pricetra.com",
      images:
        "https://res.cloudinary.com/pricetra-cdn/image/upload/v1763021499/banner_c3gig7.png",
    },
  };
}

export default async function LandingPageServer() {
  const cookieStore = await cookies();
  if (cookieStore.get(AUTH_TOKEN_KEY)) {
    redirect("/home");
  }
  const headerList = await headers();
  let ipAddress =
    getIpAddressFromRequestHeaders(headerList) ?? "46.110.121.165";
  if (process.env.NODE_ENV !== "production") {
    ipAddress = "70.91.104.137";
  }
  return <LandingPage ipAddress={ipAddress} />;
}
