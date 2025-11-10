import LandingPage from "@/components/pages/LandingPage";
import { headers } from "next/headers";

export default async function LandingPageServer() {
  const headerList = await headers();
  let ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ??
    headerList.get("x-real-ip") ??
    "46.110.121.165";
  if (process.env.NODE_ENV !== "production") {
    ipAddress = "46.110.121.165";
  }
  return <LandingPage ipAddress={ipAddress} />;
}
