import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login - Pricetra",
  };
}

export default function LoginPageServer() {
  return <LoginPage />;
}
