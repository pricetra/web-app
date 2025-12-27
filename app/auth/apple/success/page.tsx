import AppleOAuthSuccessClient, { AppleOAuthSuccessPageProps } from "./client";

type Props = {
  searchParams: Promise<AppleOAuthSuccessPageProps>;
};

export default async function AppleOAuthSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return <AppleOAuthSuccessClient {...params} />
}
