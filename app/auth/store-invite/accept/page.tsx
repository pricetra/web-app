import LayoutProvider from "@/providers/layout-provider";
import { StoreUserData } from "graphql-utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import AcceptInviteClient from "./client";

type Props = {
  searchParams: Promise<{ data?: string }>;
};

export async function generateMetadata({}: Props): Promise<Metadata> {
  return {
    title: `Processing invite...`,
  };
}

export default async function StoreUserInviteAcceptPage(props: Props) {
  const searchParams = await props.searchParams;
  if (!searchParams.data || searchParams.data === "") redirect("/");

  const bufferDataObj = Buffer.from(searchParams.data, "base64");
  const decodedRawDataObj = bufferDataObj.toString("utf-8");
  let parsedData = {} as StoreUserData;
  try {
    parsedData = JSON.parse(decodedRawDataObj);
  } catch {
    redirect("/");
  }
  return (
    <LayoutProvider>
      <AcceptInviteClient data={searchParams.data} parsedData={parsedData} />
    </LayoutProvider>
  );
}
