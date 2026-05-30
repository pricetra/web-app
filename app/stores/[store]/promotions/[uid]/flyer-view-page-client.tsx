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
import { useLayoutEffect } from "react";
import Image from "next/image";
import ScrollContainer from "@/components/scroll-container";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";
import ProductItemHorizontal from "@/components/product-item-horizontal";
import HorizontalProductAd from "@/components/ads/horizontal-product-ad";

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
  } = useNavbar();

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
    <div className="w-full">
      <h1 className="text-2xl font-bold">{data.storefrontFlyer.title}</h1>
      <p>{data.storefrontFlyer.description}</p>
      {data.storefrontFlyer.pages.map((page) => (
        <div key={`page-${page.id}`}>
          <h3 className="text-xl font-bold">{page.title}</h3>
          <p>{page.description}</p>

          <div>
            {page.sections.map((section) => (
              <div key={`section-${section.id}`}>
                {/* <Image src={createCloudinaryUrl(section.)} /> */}

                <article className="my-7">
                  <div className="mb-5">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold">
                      {section.title}
                    </h3>
                    <p>{section.description}</p>
                  </div>

                  {section.items && section.items.length > 0 && (
                    <ScrollContainer>
                      {adify(section.items, getRandomIntInclusive(3, 6)).map(
                        (item, i) =>
                          typeof item === "object" ? (
                            <ProductItemHorizontal
                              product={item.product as Product}
                              key={`brand-product-${item.product.id}-${i}`}
                            />
                          ) : (
                            <HorizontalProductAd
                              id={i}
                              key={`horizontal-product-ad-${i}`}
                            />
                          ),
                      )}
                    </ScrollContainer>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
