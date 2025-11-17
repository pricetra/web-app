import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Stores - Pricetra";
  return {
    title,
    openGraph: {
      title,
      url: "https://pricetra.com/stores",
    },
  };
}

export default async function AllStoresPageServer() {
  return <h1>Stores</h1>;
}
