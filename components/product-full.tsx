import {
  Product,
  ProductDocument,
  SanitizeProductDocument,
  UserRole,
} from "graphql-utils/types/graphql";
import ProductMetadataBadge from "./product-metadata-badge";
import { Fragment, useMemo, useState } from "react";
import { categoriesFromChild } from "@/lib/utils";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import useProductWeightBuilder from "@/hooks/useProductWeightBuilder";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { FaHandSparkles } from "react-icons/fa";
import { useAuth } from "@/context/user-context";
import { isRoleAuthorized } from "@/lib/roles";
import { useMutation } from "@apollo/client/react";
import { CgSpinner } from "react-icons/cg";

export type ProductFullProps = {
  product: Product;
  hideDescription?: boolean;
};

export default function ProductFull({
  product,
  hideDescription,
}: ProductFullProps) {
  const { user } = useAuth();
  const [imgAvailable, setImgAvailable] = useState(true);
  const weight = useProductWeightBuilder(product);
  const categories = useMemo(
    () =>
      product.category ? categoriesFromChild(product.category) : undefined,
    [product.category]
  );
  const [sanitizeProduct, { loading: sanitizing }] = useMutation(
    SanitizeProductDocument,
    {
      variables: { id: product.id },
      refetchQueries: [ProductDocument],
    }
  );

  return (
    <div className="flex flex-col gap-3">
      {imgAvailable && (
        <div className="relative mx-auto h-[30vh] mb-5">
          {user && isRoleAuthorized(UserRole.Contributor, user.role) && (
            <Button
              className="absolute top-2 right-2"
              onClick={() => sanitizeProduct()}
              disabled={sanitizing}
              size="sm"
            >
              {sanitizing ? (
                <>
                  <CgSpinner className="animate-spin" /> Sanitizing
                </>
              ) : (
                <>
                  <FaHandSparkles /> Sanitize
                </>
              )}
            </Button>
          )}

          <div className="w-full aspect-square size-full overflow-hidden">
            <Image
              src={product.image}
              className="h-full w-full object-cover rounded-xl bg-white"
              onError={() => setImgAvailable(false)}
              alt="Product image"
              width={500}
              height={500}
              quality={100}
            />
          </div>
        </div>
      )}

      <div>
        <div className="flex flex-col gap-2">
          <div className="mb-3 flex flex-row items-center gap-3">
            {product.weightValue && product.weightType ? (
              <ProductMetadataBadge type="weight" size="md" text={weight} />
            ) : (
              <></>
            )}
            {product.quantityValue && product.quantityType ? (
              <ProductMetadataBadge
                type="quantity"
                size="md"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="flex flex-row flex-wrap items-center gap-1">
            {product.brand && product.brand !== "N/A" && (
              <h2 className="text-sm sm:text-base">{product.brand}</h2>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold">{product.name}</h1>

          {categories && (
            <div className="flex flex-row flex-wrap items-center gap-1 sm:gap-2">
              {categories.map((c, i) => (
                <Fragment key={c.id}>
                  {i !== 0 && <IoIosArrowForward size={10} color="#1e2939" />}
                  <span className="text-xs sm:text-sm text-gray-800 leading-none">
                    {c.name}
                  </span>
                </Fragment>
              ))}
            </div>
          )}
        </div>

        {!hideDescription && product.description.length > 0 && (
          <div className="mt-10">
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductFullLoading() {
  return (
    <div className="flex flex-col gap-3">
      {/* Image skeleton */}
      <div className="relative mx-auto h-[30vh] mb-5">
        <div className="w-full aspect-square size-full">
          <Skeleton className="!w-full !h-full" borderRadius={12} />
        </div>
      </div>

      {/* Product metadata skeletons */}
      <div className="pt-[4px]">
        <div className="flex flex-col gap-2">
          {/* Weight + Quantity badges */}
          <div className="mb-3 flex flex-row items-center gap-3">
            <Skeleton width={50} height={24} borderRadius={12} />
            <Skeleton width={50} height={24} borderRadius={12} />
          </div>

          {/* Brand */}
          <div className="flex flex-row flex-wrap items-center gap-1">
            <Skeleton width={100} height={20} borderRadius={7} />
          </div>

          {/* Product name */}
          <div>
            <Skeleton height={28} borderRadius={10} />
            <Skeleton
              width="70%"
              height={28}
              borderRadius={10}
              style={{ marginTop: 10 }}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-row flex-wrap items-center gap-2 mt-2">
            <Skeleton width={60} height={16} borderRadius={7} />
            <Skeleton width={60} height={16} borderRadius={7} />
            <Skeleton width={60} height={16} borderRadius={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
