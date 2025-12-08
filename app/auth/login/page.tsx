import type { Metadata } from "next";
import LoginPage from "./login-page-client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { headers } from "next/headers";
import { getIpAddressFromRequestHeaders } from "@/lib/strings";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login - Pricetra",
    description:
      "Welcome back to Pricetra. Login using Google, Apple, or using you email and password.",
  };
}

export default async function LoginPageServer() {
  // TODO: /auth/logout does not clear cookie so this does not work properly
  // const cookieStore = await cookies();
  // if (cookieStore.get(AUTH_TOKEN_KEY)) {
  //   redirect("/");
  // }

  const headerList = await headers();
  const ipAddress =
    getIpAddressFromRequestHeaders(headerList) ?? "46.110.121.165";
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ""}
    >
      <LoginPage ipAddress={ipAddress} />
    </GoogleOAuthProvider>
  );
}
