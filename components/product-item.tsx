import { Product } from "graphql-utils";
import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import useProductWeightBuilder from "@/hooks/useProductWeightBuilder";
import { createCloudinaryUrl } from "@/lib/files";
import { currencyFormat, getPriceUnit, validBrand } from "@/lib/strings";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ProductMetadataBadge from "./product-metadata-badge";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useMemo } from "react";

export type ProductItemOptionalProps = {
  imgWidth?: number;
  hideStoreInfo?: boolean;
  hideAddButton?: boolean;
};

export type ProductItemProps = ProductItemOptionalProps & {
  product: Product;
};

export default function ProductItem({
  product,
  hideStoreInfo = false,
  imgWidth = 130,
}: // hideAddButton = false,
ProductItemProps) {
  const isExpired = useIsSaleExpired(product.stock?.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: product.stock?.latestPrice,
  });
  const weight = useProductWeightBuilder(product);

  const href = useMemo(() => {
    const paramBuilder = new URLSearchParams();
    if (product.stock) {
      paramBuilder.set("stockId", String(product.stock.id));
    }
    const params = paramBuilder.size > 0 ? `?${paramBuilder.toString()}` : "";
    return `/products/${product.id}${params}`;
  }, [product.id, product.stock]);

  return (
    <Link href={href} className="flex max-w-full flex-row gap-2">
      <div style={{ width: imgWidth, height: imgWidth, position: "relative" }}>
        {product.stock?.latestPrice?.sale && !isExpired && (
          <div className="absolute left-1 top-1 z-1 w-[40px]">
            <span className="inline-block rounded-sm bg-red-700 px-1.5 py-2 text-center text-[9px] font-bold text-white leading-0">
              SALE
            </span>
          </div>
        )}

        <Image
          src={createCloudinaryUrl(product.code, 500)}
          alt={product.code}
          className="h-full w-full object-cover rounded-xl"
          width={500}
          height={500}
        />
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-3 px-2">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType ? (
              <ProductMetadataBadge type="weight" size="sm" text={weight} />
            ) : (
              <></>
            )}
            {product.quantityValue && product.quantityType ? (
              <ProductMetadataBadge
                type="quantity"
                size="sm"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="flex flex-row flex-wrap items-center gap-1">
            {validBrand(product.brand) && (
              <h4
                className="text-[11px] sm:text-xs text-gray-600"
                title={`Search "${product.brand}"`}
              >
                {product.brand}
              </h4>
            )}
          </div>

          <h3
            className="text-sm sm:text-base line-clamp-3"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {product.stock && (
          <div className="flex flex-row items-center justify-between gap-2">
            {/* {!hideStoreInfo && product.stock.store && product.stock.branch && (
              <div className="flex-[2] gap-1">
                <ProductStockMini stock={product.stock} />
              </div>
            )} */}

            {product.stock.latestPrice && (
              <div
                className={cn(
                  "flex-1 flex-col",
                  hideStoreInfo ? "items-start" : "items-end"
                )}
              >
                {product.stock.latestPrice.sale &&
                  !isExpired &&
                  product.stock.latestPrice.originalPrice && (
                    <span className="text-right text-xs line-through text-red-700">
                      {currencyFormat(product.stock.latestPrice.originalPrice)}
                    </span>
                  )}
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-black">
                    {currencyFormat(calculatedAmount)}
                  </span>
                  {product.stock.latestPrice.unitType !== "item" && (
                    <span className="text-xs text-gray-500">
                      {getPriceUnit(product.stock.latestPrice)}
                    </span>
                  )}
                </div>
                {product.quantityValue > 1 && (
                  <span className="text-right text-[10px] text-gray-500">
                    {`${currencyFormat(
                      calculatedAmount / product.quantityValue
                    )}/${product.quantityType}`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductItemLoading({
  imgWidth = 130,
}: Pick<ProductItemProps, "imgWidth">) {
  return (
    <div className="flex max-w-full flex-row gap-2">
      <div style={{ width: imgWidth, height: imgWidth }}>
        <Skeleton className="size-full rounded-xl" borderRadius={15} />
      </div>
      <div className="max-w-full flex flex-col flex-1 gap-1 px-2 py-0">
        <Skeleton className="h-6 w-full" borderRadius={7} />
        <Skeleton className="h-6 w-full" borderRadius={7} />
        <Skeleton className="h-6 w-1/2" width={"50%"} borderRadius={7} />
      </div>
    </div>
  );
}
