import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import usePricePerUnit from "@/hooks/usePricePerUnit";
import { productImageUrlWithTimestamp } from "@/lib/files";
import { Product } from "graphql-utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ProductMetadataBadge from "@/components/product-metadata-badge";
import { currencyFormat, getPriceUnit } from "@/lib/strings";
import { cn } from "@/lib/utils";

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
  const [image, setImage] = useState(productImageUrlWithTimestamp(product, 500));

  useEffect(() => {
    setImage(productImageUrlWithTimestamp(product, 500));
  }, [product]);

  return (
    <div>
      <AspectRatio ratio={1 / 1} className="relative overflow-hidden bg-white">
        <div className="absolute left-0 top-0 p-1 z-1">
          <div className="flex flex-row gap-2 items-center flex-wrap">
            {product.stock?.latestPrice?.sale && !isExpired && (
              <ProductMetadataBadge
                type="sale"
                size="xs"
                text="SALE"
              />
            )}

            {product.weightValue && product.weightType && (
              <ProductMetadataBadge
                type="weight"
                size="xs"
                text={`${product.weightValue} ${product.weightType}`}
              />
            )}

            {product.quantityValue && product.quantityType && (
              <ProductMetadataBadge
                type="quantity"
                size="xs"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            )}
          </div>
        </div>

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
        <h3 className="text-xs line-clamp-2 leading-4" title={product.name}>
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
                  <h5 className="text-lg font-bold">
                    <span className={cn(product.stock.latestPrice.sale &&
                  !isExpired ? 'bg-yellow-300/50' : 'bg-transparent')}>
                      {currencyFormat(calculatedAmount)}
                    </span>
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
