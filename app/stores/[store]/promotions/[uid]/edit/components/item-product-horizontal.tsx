import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import usePricePerUnit from "@/hooks/usePricePerUnit";
import { productImageUrlWithTimestamp } from "@/lib/files";
import { Product } from "graphql-utils";
import { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ProductMetadataBadge from "@/components/product-metadata-badge";
import { currencyFormat, getPriceUnit } from "@/lib/strings";

export type ItemProductHorizontalProps = {
  product: Product;
};

export default function ItemProductHorizontal({
  product,
}: ItemProductHorizontalProps) {
  const isExpired = useIsSaleExpired(product.stock?.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: product.stock?.latestPrice,
  });
  const pricePerUnit = usePricePerUnit(calculatedAmount, product);
  const [image, setImage] = useState(
    productImageUrlWithTimestamp(product, 500),
  );

  return (
    <div>
      <AspectRatio ratio={1 / 1} className="relative overflow-hidden bg-white">
        {product.stock?.latestPrice?.sale && !isExpired && (
          <div className="absolute left-1 top-1 z-1 w-[40px]">
            <span className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold text-white">
              SALE
            </span>
          </div>
        )}

        <Image
          src={image}
          className="h-full w-full object-cover"
          width={500}
          height={500}
          alt={product.name}
          onError={() => setImage("/no_img.jpg")}
        />
      </AspectRatio>

      <div className="mt-2">
        <div className="mb-1 flex flex-row items-center gap-1">
          {product.weightValue && product.weightType ? (
            <ProductMetadataBadge
              type="weight"
              size="xs"
              text={`${product.weightValue} ${product.weightType}`}
            />
          ) : (
            <></>
          )}
          {product.quantityValue && product.quantityType ? (
            <ProductMetadataBadge
              type="quantity"
              size="xs"
              text={`${product.quantityValue} ${product.quantityType}`}
            />
          ) : (
            <></>
          )}
        </div>

        <h3 className="text-xs line-clamp-2 leading-5" title={product.name}>
          {product.name}
        </h3>
      </div>

      <div>
        {product.stock?.latestPrice && (
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex-2">
              <div
                className="flex-col"
                style={{
                  opacity:
                    product.stock.latestPrice?.outOfStock ||
                    product.stock.available === false
                      ? 0.5
                      : 1,
                }}
              >
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
                {pricePerUnit && (
                  <small className="text-[9px] text-gray-500 block leading-none">
                    {`${currencyFormat(
                      pricePerUnit.amount,
                    )} / ${pricePerUnit.unit}`}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
