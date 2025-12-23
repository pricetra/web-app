import { Metadata } from "next";
import BusinessPageClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Pricetra for Businesses – Help Shoppers Discover Your Store Online";
  const description =
    `Make your grocery store discoverable online.
    List products, prices, and store locations so nearby shoppers can find you—at no upfront cost.
    Display your store products and prices to help you drive customers and increase you store visibility.
    Join Pricetra today.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://pricetra.com/business",
    },
  };
}

export default function BusinessPageServer() {
    return <BusinessPageClient />
}
