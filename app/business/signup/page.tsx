import { Metadata } from "next";
import BusinessSignupPageClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Sign up for Pricetra Business";
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
      url: "https://pricetra.com/business/signup",
    },
  };
}

export default function BusinessSignupPageServer() {
    return <BusinessSignupPageClient />
}
