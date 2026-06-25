import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import BusinessSignUpClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Business Signups - Admin",
  };
}

export default function BusinessSignUpPage() {
  return (
    <LayoutProvider fullScreen>
      <BusinessSignUpClient />
    </LayoutProvider>
  );
}
