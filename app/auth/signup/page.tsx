import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignupPage from "./SignupPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create your account - Pricetra",
  };
}

export default async function LoginPageServer() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ""}
    >
      <SignupPage />
    </GoogleOAuthProvider>
  );
}
