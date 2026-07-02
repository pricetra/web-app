import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AuthSessionsClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Authentication Sessions - Admin",
  };
}

export default function AuthSessionsPage() {
  return (
    <LayoutProvider fullScreen>
      <AuthSessionsClient />
    </LayoutProvider>
  );
}
