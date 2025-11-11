"use client";

import { ProductDocument, StockDocument } from "@/graphql/types/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
};

export default function ProductPageClient({
  productId,
  stockId,
}: ProductPageClientProps) {
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(ProductDocument, {
    fetchPolicy: "network-only",
    variables: { productId },
  });
  const [getStock, { data: stockData }] = useLazyQuery(StockDocument, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!stockId || !productData) return;
    getStock({
      variables: {
        stockId,
      },
    });
  }, [stockId, productData]);

  return (
    <section>
      <h1>{productData?.product.name}</h1>
    </section>
  );
}
