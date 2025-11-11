import type { Metadata } from "next";
import LogoutClientPage from "./logout-page-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Logging out - Pricetra",
  };
}

export default async function LoginPageServer() {
  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_TOKEN_KEY)) {
    redirect('/');
  }
  return <LogoutClientPage />;
}
