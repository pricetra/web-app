"use client";
import {
  Product,
  StorefrontFlyer,
  StorefrontFlyerDocument,
} from "graphql-utils";
import { useQuery } from "@apollo/client/react";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect, useMemo } from "react";
import ScrollContainer from "@/components/scroll-container";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";
import ProductItemHorizontal from "@/components/product-item-horizontal";
import HorizontalProductAd from "@/components/ads/horizontal-product-ad";
import VerticalSidebarAd from "@/components/ads/vertical-sidebar-ad";
import { uniqueId } from "lodash";

type FlyerViewPageClientProps = {
  flyer: StorefrontFlyer;
};

export default function FlyerViewPageClient({
  flyer,
}: FlyerViewPageClientProps) {
  // Get detailed flyer data including pages and sections
  const { data, loading } = useQuery(StorefrontFlyerDocument, {
    variables: { uid: flyer.uid },
  });
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
    navbarHeight,
  } = useNavbar();

  const topHeight = useMemo(() => navbarHeight + 40, [navbarHeight]);

  useLayoutEffect(() => {
    if (!flyer.store) return;

    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={flyer.store.name}
        imgSrc={createCloudinaryUrl(flyer.store.logo, 100, 100)}
        href={`/stores/${flyer.store.slug}`}
      />,
    );
    setSearchPlaceholder(`Search ${flyer.store.name}`);
    setSearchQueryPath(`/stores/${flyer.store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return <div className="text-center py-12">Loading flyer...</div>;
  }

  // TODO: Show products with their stock and price info similar to app/stores/[store]/[branch]/branch-page-client.tsx[202:272]. With the name of the section as the title of the product list.
  // If sections have hero images we can display those as well within the section header with a rounded border.
  return (
    <>
      <div className="w-full max-w-[1000px] mt-0 flex-2">
        <div className="w-full">
          <div className="px-0 lg:px-5">
            <div className="px-5 py-4 bg-gray-100 rounded-lg border border-gray-200 mb-7">
              <h1 className="text-2xl font-bold text-pricetra-green-heavy-dark mb-1">
                {data.storefrontFlyer.title}
              </h1>
              <p>{data.storefrontFlyer.description}</p>
            </div>
          </div>

          {data.storefrontFlyer.pages.map((page) => (
            <div key={`page-${page.id}`}>
              <div className="px-5">
                <h3 className="text-xl font-bold">{page.title}</h3>
                <p>{page.description}</p>
              </div>

              <div>
                {page.sections.map((section) => (
                  <div key={`section-${section.id}`}>
                    {section.heroImageId && (
                      <div className="px-0 lg:px-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={createCloudinaryUrl(section.heroImageId)}
                          alt={section.title ?? "Banner"}
                          className="w-full"
                        />
                      </div>
                    )}

                    <article className="my-7">
                      <div className="mb-5 px-5">
                        <h3 className="text-base xs:text-lg sm:text-xl font-bold">
                          {section.title}
                        </h3>
                        <p>{section.description}</p>
                      </div>

                      {section.items && section.items.length > 0 && (
                        <ScrollContainer>
                          {adify(
                            section.items,
                            getRandomIntInclusive(3, 6),
                          ).map((item, i) => {
                            if (typeof item === "object") {
                              if (item.product) {
                                const product = {
                                  ...item.product,
                                  stock: {
                                    ...item.stock,
                                    latestPriceId: item.priceId,
                                    latestPrice: { ...item.price },
                                  },
                                } as Product;
                                return (
                                  <ProductItemHorizontal
                                    product={product}
                                    branchSlug={item.stock?.branch?.slug}
                                    key={`brand-product-${item.product.id}-${i}`}
                                  />
                                );
                              } else {
                                return <></>;
                              }
                            } else {
                              return (
                                <HorizontalProductAd
                                  id={i}
                                  key={`horizontal-product-ad-${i}`}
                                />
                              );
                            }
                          })}
                        </ScrollContainer>
                      )}
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-2 relative flex-1">
        <div
          className="w-full h-screen hidden lg:block lg:sticky top-0"
          style={{
            top: topHeight,
            maxHeight: `calc(100vh - ${topHeight}px)`,
          }}
        >
          <VerticalSidebarAd id={uniqueId()} />
        </div>
      </div>
    </>
  );
}
