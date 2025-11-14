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
            defaultValue={["item-1"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>{productData?.product?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We offer worldwide shipping through trusted courier partners.
                  Standard delivery takes 3-5 business days, while express
                  shipping ensures delivery within 1-2 business days.
                </p>
                <p>
                  All orders are carefully packaged and fully insured. Track
                  your shipment in real-time through our dedicated tracking
                  portal.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We stand behind our products with a comprehensive 30-day
                  return policy. If you&apos;re not completely satisfied, simply
                  return the item in its original condition.
                </p>
                <p>
                  Our hassle-free return process includes free return shipping
                  and full refunds processed within 48 hours of receiving the
                  returned item.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
