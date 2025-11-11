import Image from "next/image";

export default function ScreenshotShowcasePanel(props: {
  screenshot: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex-shrink-0 snap-center w-56">
      <div className="bg-slate-100 rounded-3xl p-4 mb-4">
        <Image
          src={`https://res.cloudinary.com/pricetra-cdn/image/upload/${props.screenshot}`}
          alt={props.title}
          width={300}
          height={600}
          className="w-full max-w-[280px] mx-auto rounded-2xl shadow-lg bg-white"
        />
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{props.title}</h3>
      <p className="text-sm text-slate-600">{props.description}</p>
    </div>
  );
}

export const screenshots = [
  {
    screenshot: "homepage-category-milk-screenshot.png",
    title: "Browse Products",
    description: "Discover products and see current prices at stores near you",
  },
  {
    screenshot: "product-page-screenshot.png",
    title: "Product Details",
    description: "View detailed product information and price history",
  },
  {
    screenshot: "add-product-price-screenshot.png",
    title: "Report Prices",
    description: "Contribute to the community by reporting current prices",
  },
  {
    screenshot: "product-page-nearby-prices-screenshot.png",
    title: "Compare Prices",
    description: "See prices across different stores to find the best deals",
  },
  {
    screenshot: "historic-price-data-screenshot.png",
    title: "Historic Price Data",
    description: "View price trends over time to see how costs change",
  },
  {
    screenshot: "store-branch-products-screenshot.png",
    title: "Store View",
    description: "Browse all products available at specific store branches",
  },
  {
    screenshot: "scan-product-screenshot.png",
    title: "Quick Scan",
    description: "Scan barcodes to quickly find and report product prices",
  },
];
