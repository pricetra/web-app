import NutritionFacts from "@/components/nutrition-facts";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GetProductNutritionDataDocument,
  Product,
  ProductNutrition,
  UpdateProductNutritionDataDocument,
} from "graphql-utils";
import { useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";

export type ProductDetailsNutritionTabProps = {
  product: Product;
  onDataLoaded: (tabName: string) => void;
};

const TAB_NAME = "available-online";

export default function ProductDetailsNutritionTab({
  product,
  onDataLoaded,
}: ProductDetailsNutritionTabProps) {
  const { data: productNutritionData } = useQuery(
    GetProductNutritionDataDocument,
    {
      variables: {
        productId: product.id,
      },
      fetchPolicy: "network-only",
    },
  );
  const [updateProductNutrition, { loading: updatingProductNutrition }] =
    useMutation(UpdateProductNutritionDataDocument, {
      refetchQueries: [GetProductNutritionDataDocument],
    });

  useEffect(() => {
    if (!productNutritionData) return;

    onDataLoaded(TAB_NAME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productNutritionData]);

  if (!productNutritionData) return;

  return (
    <AccordionItem value={TAB_NAME}>
      <AccordionTrigger>Nutrition Facts</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance">
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            size="xs"
            variant="default"
            rounded
            href={`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${product.code}`}
            target="_blank"
          >
            <FiEdit className="size-3.5" />
            Edit
          </Button>

          <Button
            size="xs"
            variant="pricetra"
            rounded
            onClick={() =>
              updateProductNutrition({
                variables: { productId: product.id },
              })
            }
            disabled={updatingProductNutrition}
          >
            <IoRefresh />
            Refetch
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 lg:gap-7 mb-7">
          {productNutritionData.getProductNutritionData.nutriments && (
            <div className="flex-2 xl:flex-1">
              <NutritionFacts
                {...(productNutritionData.getProductNutritionData as ProductNutrition)}
              />
            </div>
          )}

          {productNutritionData.getProductNutritionData.ingredientList &&
            productNutritionData.getProductNutritionData.ingredientList.length >
              0 && (
              <div className="flex-2">
                <h5 className="mb-1.5 text-base font-semibold">Ingredients</h5>
                <p className="text-xs">
                  {productNutritionData.getProductNutritionData.ingredientList
                    .map((i) => i.toUpperCase())
                    .join(", ")}
                </p>
              </div>
            )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
