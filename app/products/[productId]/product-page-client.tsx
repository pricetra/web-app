"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Product,
  ProductDocument,
  StockDocument,
} from "@/graphql/types/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import LandingHeader from "@/components/ui/landing-header";

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
};

export default function ProductPageClient({
  productId,
  stockId,
}: ProductPageClientProps) {
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId },
    }
  );
  const [getStock] = useLazyQuery(StockDocument, {
    fetchPolicy: "no-cache",
  });

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

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 container mx-auto my-10">
        <article className="px-0 sm:px-5 py-7">
          {productData && !productLoading ? (
            <ProductFull
              product={productData.product as Product}
              hideDescription
            />
          ) : (
            <ProductFullLoading />
          )}
        </article>
        <div className=""></div>
      </section>
    </div>
  );
}
