import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { headers } from "next/headers";
import { getIpAddressFromRequestHeaders } from "@/lib/strings";
import SignupPage from "./signup-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create your account - Pricetra",
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
      <SignupPage ipAddress={ipAddress} />
    </GoogleOAuthProvider>
  );
}
