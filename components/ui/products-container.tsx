import { Branch, Product, ProductSimple } from "graphql-utils";
import ScrollContainer from "../scroll-container";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";
import ProductItemHorizontal from "../product-item-horizontal";
import HorizontalProductAd from "../ads/horizontal-product-ad";
import ProductItem from "../product-item";
import { isMobile } from "react-device-detect";

export type ProductContainerProps = {
  products: ProductSimple[];
  branch: Branch;
  itemKeyPrefix?: string;
};

export default function ProductsContainer({
  products,
  branch,
}: ProductContainerProps) {
  return (
    <>
      {(!isMobile && products.length > 6) || (isMobile && products.length > 3) ? (
        <HorizontalProductContainer products={products} branch={branch} />
      ) : (
        <div className="px-5 mt-7 my-14">
          <VerticalProductContainer products={products} branch={branch} />
        </div>
      )}
    </>
  );
}

export function HorizontalProductContainer({
  products,
  branch,
  itemKeyPrefix,
}: ProductContainerProps) {
  return (
    <ScrollContainer>
      {adify(products, getRandomIntInclusive(3, 6)).map((product, i) =>
        typeof product === "object" ? (
          <ProductItemHorizontal
            product={product as Product}
            branchSlug={branch.slug}
            key={`${itemKeyPrefix ?? "product"}-${branch.id}-${product.id}`}
          />
        ) : (
          <HorizontalProductAd
            id={i}
            key={`${itemKeyPrefix ?? "horizontal-product-ad"}-${branch.id}-${product}-${i}`}
          />
        ),
      )}
    </ScrollContainer>
  );
}

export function VerticalProductContainer({
  products,
  branch,
  itemKeyPrefix,
}: ProductContainerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-3">
      {products.map((product, i) => (
        <ProductItem
          product={product as Product}
          branchSlug={branch.slug}
          imgWidth={isMobile ? 110 : 130}
          key={`${itemKeyPrefix ?? "product"}-${branch.id}-${product.id}-${i}`}
          hideStoreInfo
        />
      ))}
    </div>
  );
}
