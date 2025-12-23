import Image from "next/image";
import slugify from "slugify";

type GoogleSearchMockProps = {
  storeName: string;
  city?: string;
};

export default function GoogleSearchMock({
  storeName,
  city = "near you",
}: GoogleSearchMockProps) {
  return (
    <div className="max-w-2xl rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      {/* Search bar mock */}
      <div className="mb-5 flex items-center gap-3 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600">
        <span className="size-6">
          <Image
            src="/icons/google-color-icon.svg"
            alt="Pricetra"
            width={210}
            height={40}
            className="size-6 block w-auto color-white"
            priority
          />
        </span>
        <span className="truncate">
          {storeName} at Pricetra
        </span>
      </div>

      {/* Result */}
      <div>
        <div className="text-sm text-gray-600">
          pricetra.com
          <span className="mx-1">›</span>
          stores
          <span className="mx-1">›</span>
          <span className="lowercase">{slugify(storeName)}</span>
        </div>

        <a
          href="#"
          className="mt-1 inline-block text-xl font-medium text-blue-700 hover:underline"
        >
          {storeName} – Pricetra
        </a>

        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          Discover products and prices at{" "}
          <span className="font-medium">{storeName}</span>{" "}
          stores {city}. Browse nearby branches, discover popular products,
          and compare prices to get the best deals.
        </p>
      </div>
    </div>
  );
}
