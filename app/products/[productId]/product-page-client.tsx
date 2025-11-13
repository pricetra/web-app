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

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 container mx-auto mb-10 mt-0 sm:mt-5">
        <article className="px-0 sm:px-5 py-7 pt-0 sm:pt7">
          <div>
            {productData && !productLoading ? (
              <ProductFull
                product={productData.product as Product}
                hideDescription
              />
            ) : (
              <ProductFullLoading />
            )}
          </div>

          {stockId &&
            (stockData && !stockLoading && productData ? (
              <div className="mb-5 p-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStock
                    stock={stockData.stock as Stock}
                    quantityType={productData.product.quantityType}
                    quantityValue={productData.product.quantityValue}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-5 p-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStockLoading />
                </div>
              </div>
            ))}
        </article>
        <div className=""></div>
      </section>
    </div>
  );
}
