import Image from "next/image";
import { Product, ProductSimple } from "graphql-utils";
import { createCloudinaryUrl, productImageUrlWithTimestamp } from "@/lib/files";
import { currencyFormat, getPriceUnit, validBrand } from "@/lib/strings";
import Skeleton from "react-loading-skeleton";
import ProductMetadataBadge from "./product-metadata-badge";
import Link from "next/link";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import { useMemo } from "react";

export type ProductItemHorizontalProps = {
  product: ProductSimple | Product;
  branchSlug?: string;
  hideStoreInfo?: boolean | undefined;
  handleOnClick?: () => void;
};

export default function ProductItemHorizontal({
  product,
  branchSlug,
  hideStoreInfo = true,
  handleOnClick,
}: ProductItemHorizontalProps) {
  const isExpired = useIsSaleExpired(product.stock?.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: product.stock?.latestPrice,
  });
  const href = useMemo(() => {
    return `/products/${product.id}${branchSlug ? `/${branchSlug}` : ''}`;
  }, [product.id, branchSlug]);

  return (
    <Link
      href={href}
      className="flex flex-col gap-2 max-w-[130px] md:max-w-[180px]"
      onClick={handleOnClick}
    >
      <div className="relative size-[130px] md:size-[180px] overflow-hidden rounded-xl bg-white">
        {product.stock?.latestPrice?.sale && !isExpired && (
          <div className="absolute left-1 top-1 z-1 w-[40px]">
            <span className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold text-white">
              SALE
            </span>
          </div>
        )}

        <Image
          src={productImageUrlWithTimestamp(product, 500)}
          className="h-full w-full object-cover"
          width={500}
          height={500}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType ? (
              <ProductMetadataBadge
                type="weight"
                size="sm"
                text={`${product.weightValue} ${product.weightType}`}
              />
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

          <div className="flex flex-row flex-wrap items-center gap-2">
            {validBrand(product.brand) && (
              <h5
                className="text-xs text-gray-600"
                // title={`Search "${product.brand}"`}
              >
                {product.brand}
              </h5>
            )}
          </div>
          <h3
            className="text-sm sm:text-base line-clamp-2 leading-5"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {product.stock?.latestPrice && (
          <div className="flex flex-row items-center justify-between gap-2">
            {!hideStoreInfo &&
              product.__typename === "Product" &&
              product.stock.store && (
                <div
                  title={product.stock.branch?.name ?? product.stock.store.name}
                >
                  <Image
                    src={createCloudinaryUrl(
                      product.stock.store.logo ?? "",
                      100,
                      100
                    )}
                    className="size-[25px] rounded-sm"
                    width={100}
                    height={100}
                    alt={product.stock.store.name}
                  />
                </div>
              )}
            <div className="flex-1 flex-col">
              {product.stock.latestPrice.sale &&
                !isExpired &&
                product.stock.latestPrice.originalPrice && (
                  <small className="text-[10px] line-through text-red-700 block leading-none">
                    {currencyFormat(product.stock.latestPrice.originalPrice)}
                  </small>
                )}
              <div className="flex flex-row items-center justify-start gap-1 leading-none">
                <h5 className="text-sm md:text-lg font-black">
                  {currencyFormat(calculatedAmount)}
                </h5>
                <small className="text-xs text-gray-500">
                  {getPriceUnit(product.stock.latestPrice)}
                </small>
              </div>
              {product.quantityValue > 1 && (
                <small className="text-[10px] text-gray-500 block leading-none">
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
    <div className="flex flex-col gap-2 max-w-[130px] md:max-w-[180px]">
      <div className="size-[130px] md:size-[180px]">
        <Skeleton
          className="size-full rounded-xl"
          style={{ borderRadius: 10 }}
        />
      </div>
      <div className="max-w-full gap-2">
        <Skeleton className="h-6 w-full" style={{ borderRadius: 7 }} />
        <Skeleton
          className="h-6 w-full"
          style={{ borderRadius: 7, width: "80%" }}
        />
        <Skeleton
          className="mt-5 h-6 w-[100px]"
          style={{ borderRadius: 7, width: 80 }}
        />
      </div>
    </div>
  );
}
