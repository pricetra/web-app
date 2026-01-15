import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import ProfileLayout from "../../components/profile-layout";
import MyListsClient from "./client";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Lists - Pricetra",
  };
}

export default async function MyProfileListsPageServer({
  params,
  searchParams,
}: Props) {
  let listId = 0;
  try {
    listId = parseInt((await params).listId);
  } catch {
    redirect("/profile");
  }

  const tab = (await searchParams).tab;
  if (!tab) {
    redirect(`/profile/lists/${listId}?tab=products`);
  }
  switch(tab) {
    case "branches":
      break;
    case "products":
      break;
    default:
      redirect(`/profile/lists/${listId}?tab=products`);
  }

  return (
    <LayoutProvider>
      <ProfileLayout>
        <MyListsClient listId={listId} tab={tab} />
      </ProfileLayout>
    </LayoutProvider>
  );
}
