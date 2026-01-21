import { postgresArrayToNumericArray } from "@/lib/strings";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Category,
  CreateCategoryDocument,
  GetCategoriesDocument,
} from "graphql-utils";
import Select from "react-dropdown-select";

export type CategoryComboboxData = {
  depth: number;
  parentCategory?: Category;
  selection?: Category;
};

export type CategorySelectorProps = CategoryComboboxData & {
  depth: number;
  onSelect: (category: Category) => void;
};

export default function CategorySelector({
  depth,
  parentCategory,
  selection,
  onSelect,
}: CategorySelectorProps) {
  const { data, loading } = useQuery(GetCategoriesDocument, {
    variables: { depth, parentId: parentCategory?.id },
    fetchPolicy: "network-only",
  });
  const [createCategory] = useMutation(CreateCategoryDocument, {
    refetchQueries: [GetCategoriesDocument],
  });

  function addNewCategory(value: string) {
    const parentPath = parentCategory
      ? postgresArrayToNumericArray(parentCategory.path)
      : [];
    return createCategory({
      variables: {
        input: {
          name: value.trim(),
          parentPath,
        },
      },
    });
  }

  return (
    <Select
      multi={false}
      options={data?.getCategories ?? []}
      onChange={(v) => {
        if (v.length === 0) return;

        const categorySelect = v.at(0);
        if (!categorySelect || !categorySelect.id) return;

        onSelect(categorySelect);
      }}
      values={selection ? [selection] : []}
      labelField="name"
      valueField="name"
      loading={loading}
      placeholder="Select Category"
      className="mb-2 text-sm"
      create
      onCreateNew={(c) => {
        addNewCategory(c.name).then(({ data }) => {
          if (!data) return;
          onSelect(data.createCategory);
        });
      }}
      createNewLabel="Add category"
    />
  );
}
