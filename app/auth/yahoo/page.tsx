import { redirect } from "next/navigation";
import YahooOAuthSuccessClient, { YahooOAuthSuccessPageProps } from "./client";


type Props = {
  searchParams: Promise<YahooOAuthSuccessPageProps>;
};

export default async function AppleOAuthSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.code || params.code.length === 0) {
    redirect('/');
  }
  return <YahooOAuthSuccessClient {...params} />
}
