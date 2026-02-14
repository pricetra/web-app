import type { Metadata } from "next";
import ForgotPasswordClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forgot password - Pricetra",
  };
}

export default async function LoginPageServer() {
  return (
    <ForgotPasswordClient />
  );
}
