import FlyerCard from "@/components/flyer-card";
import { useQuery } from "@apollo/client/react";
import { Branch, Store, StorefrontFlyer, StorefrontFlyersDocument } from "graphql-utils";
import Link from "next/link";

export type ShowFlyersStorefrontProps = {
  store: Store;
  branch?: Branch;
};

export default function ShowFlyersStorefront({
  store,
}: ShowFlyersStorefrontProps) {
  const { data } = useQuery(
    StorefrontFlyersDocument,
    {
      variables: {
        storeId: store.id,
        paginator: { limit: 20, page: 1 },
      },
    },
  );

  if (!data) return;

  return <div>
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.storefrontFlyers.flyers.map((flyer) => (
              <Link
                href={`/stores/${store.slug}/promotions/${flyer.uid}`}
                key={flyer.uid}
              >
                <FlyerCard flyer={flyer as StorefrontFlyer} store={store} />
              </Link>
            ))}
          </div>
  </div>
}
