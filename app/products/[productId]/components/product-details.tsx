import { Product, Stock } from "graphql-utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductSpecs from "@/components/product-specs";
import { useMemo, useState } from "react";
import { LocationInputWithFullAddress } from "@/context/location-context";
import MultiplexAds from "@/components/ads/multiplex-ads";
import { slugifyProductName } from "@/lib/strings";
import ProductDetailsFavoriteStoresTab from "./product-details-favorite-stores-tab";
import ProductDetailsInStoreStocksTab from "./product-details-in-store-stocks-tab";
import ProductDetailsOnlineStocksTab from "./product-details-online-stocks-tab";
import ProductDetailsNutritionTab from "./product-details-nutrition-tab";
import ProductDetailsRelatedSection from "./product-details-related-section";

export type ProductDetailsProps = {
  product: Product;
  stock?: Stock;
  locationInput: LocationInputWithFullAddress;
};

export default function ProductDetails({
  product,
  stock,
  locationInput,
}: ProductDetailsProps) {
  const productUrlPath = useMemo(
    () => `/products/${product.id}-${slugifyProductName(product.name)}`,
    [product.id, product.name],
  );
  const [accordionValues, setAccordionValues] = useState<string[]>([
    "favorite-stores",
    "description",
  ]);

  return (
    <div>
      <Accordion
        type="multiple"
        defaultChecked
        className="w-full px-5"
        value={accordionValues}
        onValueChange={setAccordionValues}
      >
        <ProductDetailsFavoriteStoresTab product={product} />

        <ProductDetailsInStoreStocksTab
          product={product}
          locationInput={locationInput}
          productUrlPath={productUrlPath}
          onDataLoaded={(tabName) => {
            setAccordionValues((v) => [...v, tabName]);
          }}
        />

        <ProductDetailsOnlineStocksTab
          product={product}
          productUrlPath={productUrlPath}
          onDataLoaded={(tabName) => {
            setAccordionValues((v) => [...v, tabName]);
          }}
        />

        <div className="my-5 flex flex-row items-center justify-center bg-gray-50">
          <MultiplexAds id="product-details-multiplex-1" />
        </div>

        <ProductDetailsNutritionTab
          product={product}
          onDataLoaded={(tabName) => {
            setAccordionValues((v) => [...v, tabName]);
          }}
        />

        {product.description.length > 0 && (
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{product.description}</p>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="specifications">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ProductSpecs product={product} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ProductDetailsRelatedSection
        product={product}
        locationInput={locationInput}
        stock={stock}
      />
    </div>
  );
}
