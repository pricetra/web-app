import YahooOAuthSuccessClient, { YahooOAuthSuccessPageProps } from "./client";


type Props = {
  searchParams: Promise<YahooOAuthSuccessPageProps>;
};

export default async function AppleOAuthSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return <YahooOAuthSuccessClient {...params} />
}
