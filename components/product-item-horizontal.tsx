import { useMemo } from "react";

import Image from "next/image";
import { Product, ProductSimple } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import { currencyFormat, getPriceUnit } from "@/lib/strings";
import { isSaleExpired } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import ProductMetadataBadge from "./product-metadata-badge";
import Link from "next/link";

export type ProductItemHorizontalProps = {
  product: ProductSimple | Product;
};

export default function ProductItemHorizontal({
  product,
}: ProductItemHorizontalProps) {
  const isExpired = useMemo(
    () =>
      product.stock?.latestPrice
        ? isSaleExpired(product.stock.latestPrice)
        : false,
    [product.stock?.latestPrice]
  );
  const calculatedAmount = useMemo(() => {
    if (!product.stock?.latestPrice) return 0;
    return !isExpired
      ? product.stock.latestPrice.amount
      : product.stock.latestPrice.originalPrice ??
          product.stock.latestPrice.amount;
  }, [product.stock?.latestPrice, isExpired]);

  return (
    <Link
      href={`/products/${product.id}?stockId=${product.stock?.id}`}
      className="flex flex-col gap-2 max-w-[130px] md:max-w-[180px]"
    >
      <div className="relative size-[130px] md:size-[180px]">
        {product.stock?.latestPrice?.sale && !isExpired && (
          <div className="absolute left-1 top-1 z-[1] w-[40px]">
            <span className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold text-white">
              SALE
            </span>
          </div>
        )}

        <Image
          src={createCloudinaryUrl(product.code, 500)}
          className="rounded-xl"
          width={500}
          height={500}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType && (
              <ProductMetadataBadge
                type="weight"
                size="sm"
                text={`${product.weightValue} ${product.weightType}`}
              />
            )}
            {product.quantityValue && product.quantityType && (
              <ProductMetadataBadge
                type="quantity"
                size="sm"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            )}
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2">
            {product.brand && product.brand !== "N/A" && (
              <h5 className="text-xs text-gray-600">{product.brand}</h5>
            )}
          </div>
          <h3 className="text-sm sm:text-base line-clamp-2 leading-5">
            {product.name}
          </h3>
        </div>

        {product.stock?.latestPrice && (
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex-[1] flex-col">
              {product.stock.latestPrice.sale &&
                !isExpired &&
                product.stock.latestPrice.originalPrice && (
                  <small className="text-xs line-through text-red-700">
                    {currencyFormat(product.stock.latestPrice.originalPrice)}
                  </small>
                )}
              <div className="flex flex-row items-center justify-start gap-1">
                <h5 className="text-lg font-black">
                  {currencyFormat(calculatedAmount)}
                </h5>
                <small className="text-xs text-gray-500">
                  {getPriceUnit(product.stock.latestPrice)}
                </small>
              </div>
              {product.quantityValue > 1 && (
                <small className="text-[10px] text-gray-500">
                  {`${currencyFormat(
                    calculatedAmount / product.quantityValue
                  )}/${product.quantityType}`}
                </small>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductLoadingItemHorizontal() {
  return (
    <div className="flex max-w-full flex-col gap-2 max-w-[130px] md:max-w-[180px]">
      <div className="size-[130px] md:size-[180px]">
        <Skeleton
          className="size-full rounded-xl"
          style={{ borderRadius: 10 }}
        />
      </div>
      <div className="max-w-full gap-2">
        <Skeleton className="h-6 w-full" style={{ borderRadius: 7 }} />
        <Skeleton className="h-6 w-full" style={{ borderRadius: 7 }} />
        <Skeleton className="mt-5 h-6 w-[100px]" style={{ borderRadius: 7 }} />
      </div>
    </div>
  );
}
