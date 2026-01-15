import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import ProfileLayout from "../components/profile-layout";
import EditProfileClient from "./client";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Profile - Pricetra"
  }
}

export default async function EditProfilePageServer() {
  return (
    <LayoutProvider>
      <ProfileLayout>
        <EditProfileClient />
      </ProfileLayout>
    </LayoutProvider>
  );
}
