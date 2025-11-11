import type { Metadata } from "next";
import EmailVerificationPage from "./EmailVerificationPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Email verification - Pricetra",
  };
}

export default async function LoginPageServer() {
  return <EmailVerificationPage />;
}
