import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import ProfileLayout from "../../components/profile-layout";
import { redirect } from "next/navigation";
import MyHistoryListsClient from "./client";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My History - Pricetra",
  };
}

export default async function MyHistoryListsPageServer({
  searchParams,
}: Props) {
  const tab = (await searchParams).tab;
  if (!tab) {
    redirect(`/profile/lists/history?tab=products`);
  }
  switch(tab) {
    case "branches":
      break;
    case "products":
      break;
    default:
      redirect(`/profile/lists/history?tab=products`);
  }

  return (
    <LayoutProvider>
      <ProfileLayout>
        <MyHistoryListsClient tab={tab} />
      </ProfileLayout>
    </LayoutProvider>
  );
}
