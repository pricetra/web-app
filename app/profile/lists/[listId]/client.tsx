"use client";

import { useAuth } from "@/context/user-context";
import { List } from "graphql-utils";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductListView from "./product-list-view";
import BranchListView from "./branch-list-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListIconRenderer } from "../../components/list-item";

export enum ListScreenTabType {
  Products = "products",
  Branches = "branches",
}

type MyListsClientProps = {
  listId: number;
  tab: string;
};

export default function MyListsClient({ listId, tab }: MyListsClientProps) {
  const router = useRouter();
  const { lists } = useAuth();
  const [list, setList] = useState<List>();

  useEffect(() => {
    if (!lists?.allLists) return;

    const list = lists.allLists.find(({ id }) => id === listId);
    if (!list) {
      router.replace("/profile");
      return;
    }
    setList(list);
    document.title = `${list.name} - ${capitalize(tab)} - Pricetra`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, tab, lists?.allLists]);

  function toTab(tab: ListScreenTabType) {
    router.push(`?tab=${tab}`);
  }

  if (!list) return <></>;

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-bold text-xl flex flex-row items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
            {ListIconRenderer(list.type)}
          </div>
          {list.name}
        </h2>
      </div>

      <Tabs defaultValue={ListScreenTabType.Products} value={tab}>
        <TabsList className="mb-10">
          <TabsTrigger
            value={ListScreenTabType.Products}
            onClick={() => toTab(ListScreenTabType.Products)}
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value={ListScreenTabType.Branches}
            onClick={() => toTab(ListScreenTabType.Branches)}
          >
            Branches
          </TabsTrigger>
        </TabsList>

        <TabsContent value={ListScreenTabType.Products}>
          <ProductListView list={list} />
        </TabsContent>
        <TabsContent value={ListScreenTabType.Branches}>
          <BranchListView list={list} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
