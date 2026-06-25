import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import UsersClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Users - Admin",
  };
}

export default function UsersPage() {
  return (
    <LayoutProvider fullScreen>
      <UsersClient />
    </LayoutProvider>
  );
}
