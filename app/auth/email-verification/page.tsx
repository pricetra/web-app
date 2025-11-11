import type { Metadata } from "next";
import EmailVerificationPage from "./email-verification-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Email verification - Pricetra",
  };
}

export default async function LoginPageServer() {
  return <EmailVerificationPage />;
}
