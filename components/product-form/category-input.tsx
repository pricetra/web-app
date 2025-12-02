import { useLazyQuery } from "@apollo/client/react";
import { Category, CategorySearchDocument } from "graphql-utils";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IoIosSearch } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { CgSpinner } from "react-icons/cg";

export type CategoryInputProps = {
  category?: Category;
  onSelectCategoryId: (categoryId: number) => void;
};

export default function CategoryInput({
  category,
  onSelectCategoryId,
}: CategoryInputProps) {
  const [search, setSearch] = useState(category?.name ?? "");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showCreateCategoryView, setShowCreateCategoryView] = useState(false);
  const [
    searchCategories,
    { data: categoriesData, loading: categoriesLoading },
  ] = useLazyQuery(CategorySearchDocument, {
    fetchPolicy: "no-cache",
  });
  // const [getCategory, { loading: categoryLoading }] =
  //   useLazyQuery(GetCategoryDocument);

  const debouncedCategorySearchHandler = useCallback(
    _.debounce((search: string) => {
      if (search.length < 2) return;
      searchCategories({
        variables: { search: search?.trim(), quickSearchMode: true },
      });
    }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedCategorySearchHandler.cancel();
  }, [debouncedCategorySearchHandler]);

  useEffect(() => {
    debouncedCategorySearchHandler(search);
  }, [search]);

  return (
    <div>
      {!showCreateCategoryView ? (
        <div>
          <InputGroup>
            <InputGroupInput
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              placeholder="Search Category"
            />

            <InputGroupAddon>
              <InputGroupButton
                variant="ghost"
                aria-label="Help"
                size="icon-xs"
              >
                {categoriesLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <IoIosSearch />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {search.length > 0 && categoriesData && (
            <div className="my-3 flex flex-row flex-wrap items-center gap-2">
              {categoriesData.categorySearch.map((c, i) => {
                const selected = c.id === selectedCategory?.id;
                return (
                  <Button
                    key={`category-${c.id}-${i}`}
                    size="xs"
                    className={cn(
                      "rounded-full",
                      selected
                        ? "bg-pricetra-green-heavy-dark hover:bg-pricetra-green-heavy-dark-hover text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                    )}
                    onClick={() => {
                      onSelectCategoryId(c.id);
                      setSelectedCategory(c as Category);
                    }}
                  >
                    {c.name}
                  </Button>
                );
              })}
              <Button
                onClick={() => setShowCreateCategoryView(true)}
                size="xs"
                className="rounded-full bg-gray-800"
              >
                <FiPlus />
                New
              </Button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
