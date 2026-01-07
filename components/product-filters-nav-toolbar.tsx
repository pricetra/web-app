import { Button } from "@/components/ui/button";
import { MdLocationPin } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { COMMON_CATEGORIES } from "@/lib/categories";
import useLocationInput from "@/hooks/useLocationInput";
import { useSearchParams } from "next/navigation";
import { toBoolean } from "@/lib/utils";
import { useMemo } from "react";

type ProductFilterNavToolbarProps = {
  baseUrl?: string;
};

export default function ProductFilterNavToolbar({
  baseUrl = "/search",
}: ProductFilterNavToolbarProps) {
  const location = useLocationInput();
  const searchParams = useSearchParams();
  const searchParamsBuilder = useMemo(() => {
    const paramsBuilder = new URLSearchParams(searchParams);
    paramsBuilder.delete("page");
    return paramsBuilder;
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-row items-center gap-2 px-5 overflow-x-auto h-full">
      <div>
        <Button size="xs" rounded variant="secondary">
          <MdLocationPin /> {location?.fullAddress.split(",")[0]}
        </Button>
      </div>

      {searchParamsBuilder.size > 0 && (
        <div className="flex flex-row items-center gap-2">
          {searchParams.get("query") && (
            <Button variant="outline" size="xs" rounded>
              Search: <b>{searchParams.get("query")}</b>
            </Button>
          )}
          {searchParams.get("category") && searchParams.get("categoryId") && (
            <Button variant="outline" size="xs" rounded>
              Category: <b>{searchParams.get("category")}</b>
            </Button>
          )}
          {searchParams.get("brand") && (
            <Button variant="outline" size="xs" rounded>
              Brand: <b>{searchParams.get("brand")}</b>
            </Button>
          )}
          {searchParams.get("sale") &&
            toBoolean(searchParams.get("sale") ?? undefined) && (
              <Button variant="pricetra" size="xs" rounded>
                Sale
              </Button>
            )}
          {searchParams.get("sortByPrice") && (
            <Button variant="outline" size="xs" rounded>
              Sort by:
              <b>
                {searchParams.get("sortByPrice") === "asc"
                  ? "↓ Price"
                  : "↑ Price"}
              </b>
            </Button>
          )}
        </div>
      )}

      <div className="h-full py-2 px-2">
        <Separator orientation="vertical" />
      </div>

      <div className="flex flex-row items-center gap-2">
        {COMMON_CATEGORIES.map(({ id, name }) => (
          <Button
            href={`${baseUrl}?categoryId=${id}&category=${encodeURIComponent(
              name
            )}`}
            variant="secondary"
            size="xs"
            rounded
            key={`common-category-${id}`}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
