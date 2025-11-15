"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Product,
  ProductDocument,
  Stock,
  StockDocument,
} from "@/graphql/types/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import LandingHeader from "@/components/ui/landing-header";
import SelectedStock, {
  SelectedStockLoading,
} from "@/components/selected-stock";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductSpecs from "@/components/product-specs";

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
  sharedBy?: number;
  sharedFrom?: string;
};

export default function ProductPageClient({
  productId,
  stockId,
}: ProductPageClientProps) {
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId, viewerTrail: { stockId } },
    }
  );
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(
    StockDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (!stockId || !productData) return;
    getStock({
      variables: {
        stockId,
      },
    });
  }, [stockId, productData, getStock]);

  return (
    <div>
      <LandingHeader />

      <div className="flex flex-col lg:flex-row gap-4 container mx-auto mb-10 mt-0 sm:mt-5 pb-7 pt-0 sm:pt-7">
        <section className="px-5 w-full">
          <article>
            {productData && !productLoading ? (
              <ProductFull
                product={productData.product as Product}
                hideDescription
              />
            ) : (
              <ProductFullLoading />
            )}
          </article>

          {stockId &&
            (stockData && !stockLoading && productData ? (
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStock
                    stock={stockData.stock as Stock}
                    quantityType={productData.product.quantityType}
                    quantityValue={productData.product.quantityValue}
                  />
                </div>
              </div>
            ) : (
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStockLoading />
                </div>
              </div>
            ))}
        </section>

        <section className="px-5 w-full">
          <Accordion
            type="multiple"
            defaultChecked
            className="w-full"
            defaultValue={["description"]}
          >
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>{productData?.product?.description}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specifications">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {productData && (
                  <ProductSpecs product={productData.product as Product} />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
