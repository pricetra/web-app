import HorizontalProductAd from "@/components/ads/horizontal-product-ad";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";
import { useLazyQuery } from "@apollo/client/react";
import { Product, ProductSearchDocument } from "graphql-utils";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";

export type MoreFromBrandProps = {
  brand: string;
};

export default function MoreFromBrand({ brand }: MoreFromBrandProps) {
  const [bottomExtraSectionRef, bottomExtraSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
  });
  const [
    getBrandProducts,
    { data: brandProducts, loading: brandProductsLoading },
  ] = useLazyQuery(ProductSearchDocument, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (brand === "" || brand === "N/A") return;
    if (!bottomExtraSectionInView) return;

    getBrandProducts({
      variables: {
        paginator: { limit: 20, page: 1 },
        filters: { brand },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, bottomExtraSectionInView]);

  return (
    <section ref={bottomExtraSectionRef}>
      <article className="my-7">
        <div className="mb-5 px-5">
          {!brandProducts || brandProductsLoading ? (
            <Skeleton width="20%" height={28} borderRadius={10} />
          ) : (
            <h2 className="text-base xs:text-lg sm:text-xl">
              More from <b>{brand}</b>
            </h2>
          )}
        </div>

        {!brandProducts || brandProductsLoading ? (
          <ScrollContainer hideButtons>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <ProductLoadingItemHorizontal
                  key={`brand-product-loading-${i}`}
                />
              ))}
          </ScrollContainer>
        ) : (
          <ScrollContainer>
            {adify(
              brandProducts?.productSearch?.products ?? [],
              getRandomIntInclusive(3, 6),
            ).map((product, i) =>
              typeof product === "object" ? (
                <ProductItemHorizontal
                  product={product as Product}
                  key={`brand-product-${product.id}-${i}`}
                />
              ) : (
                <HorizontalProductAd
                  id={i}
                  key={`horizontal-product-ad-${product}-${i}`}
                />
              ),
            )}
          </ScrollContainer>
        )}
      </article>
    </section>
  );
}
