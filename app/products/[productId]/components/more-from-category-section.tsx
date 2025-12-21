import ProductItemHorizontal, { ProductLoadingItemHorizontal } from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import { useLazyQuery } from "@apollo/client/react";
import { Category, Product, ProductSearchDocument } from "graphql-utils";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";

export type MoreFromBrandProps = {
  category: Category;
};

export default function MoreFromCategory({ category }: MoreFromBrandProps) {
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
    if (!bottomExtraSectionInView) return;

    getBrandProducts({
      variables: {
        paginator: { limit: 20, page: 1 },
        filters: { category: category.name },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, bottomExtraSectionInView]);

  return (
    <section ref={bottomExtraSectionRef}>
      <article className="my-7">
        <div className="mb-5 px-5">
          {!brandProducts || brandProductsLoading ? (
            <Skeleton width="20%" height={28} borderRadius={10} />
          ) : (
            <h2 className="text-base xs:text-lg sm:text-xl">
              Similar in category <b>{category.name}</b>
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
            {(brandProducts?.productSearch?.products ?? []).map(
              (product, i) => (
                <ProductItemHorizontal
                  product={product as Product}
                  key={`brand-product-${product.id}-${i}`}
                />
              )
            )}
          </ScrollContainer>
        )}
      </article>
    </section>
  );
}
