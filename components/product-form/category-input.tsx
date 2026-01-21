import { useLazyQuery } from "@apollo/client/react";
import {
  Category,
  CategorySearchDocument,
  GetCategoryDocument,
} from "graphql-utils";
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
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { categoriesFromChild, cn } from "@/lib/utils";
import { CgSpinner } from "react-icons/cg";
import CategorySelector, { CategoryComboboxData } from "./category-selector";

export type CategoryInputProps = {
  category?: Category;
  onSelectCategory: (category: Category) => void;
};

export default function CategoryInput({
  category,
  onSelectCategory,
}: CategoryInputProps) {
  const [search, setSearch] = useState(category?.name ?? "");
  const [categoryDataSet, setCategoryDataSet] = useState<
    CategoryComboboxData[]
  >([{ depth: 1 }]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showCreateCategoryView, setShowCreateCategoryView] = useState(false);
  const [
    searchCategories,
    { data: categoriesData, loading: categoriesLoading },
  ] = useLazyQuery(CategorySearchDocument, {
    fetchPolicy: "no-cache",
  });
  const [getCategory, { loading: categoryLoading }] =
    useLazyQuery(GetCategoryDocument);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCategorySearchHandler = useCallback(
    _.debounce((search: string) => {
      if (search.length < 2) return;
      searchCategories({
        variables: { search: search?.trim(), quickSearchMode: true },
      });
    }, 500),
    [],
  );

  useEffect(() => {
    return () => debouncedCategorySearchHandler.cancel();
  }, [debouncedCategorySearchHandler]);

  useEffect(() => {
    debouncedCategorySearchHandler(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (!category) {
      setCategoryDataSet([{ depth: 1 }]);
      return;
    }

    const categories = categoriesFromChild(category);
    categories.push({ depth: categories.length + 1 } as Category);
    setCategoryDataSet(
      categories.map(
        (c, i) =>
          ({
            parentCategory: i > 0 ? categories[i - 1] : undefined,
            depth: c.depth ?? i + 1,
            selection: c,
          }) as CategoryComboboxData,
      ),
    );
  }, [category]);

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
                        : "bg-gray-100 hover:bg-gray-200 text-black",
                    )}
                    onClick={() => {
                      setSelectedCategory(c as Category);
                      getCategory({
                        variables: { id: c.id },
                      }).then(({ data }) => {
                        if (!data) return;

                        setSelectedCategory(data.getCategory);
                        onSelectCategory(data.getCategory);
                      });
                    }}
                  >
                    {selected && categoryLoading && <CgSpinner />}
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
        <div className="mt-5">
          <div className="mb-3 flex flex-row">
            <Button
              onClick={() => setShowCreateCategoryView(false)}
              size="xs"
              variant="secondary"
            >
              <FiArrowLeft className="size-3.5" /> Search
            </Button>
          </div>

          <div>
            {categoryDataSet.map(({ parentCategory, depth, selection }, i) => (
              <CategorySelector
                depth={depth}
                selection={selection}
                parentCategory={parentCategory}
                onSelect={(category) => {
                  const prevDepth = category.depth ?? i;
                  setCategoryDataSet([
                    ...categoryDataSet.splice(0, i + 1),
                    { parentCategory: category, depth: prevDepth + 1 },
                  ]);
                  onSelectCategory(category);
                }}
                key={`category-select-${i}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
