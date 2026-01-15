"use client";

import { useAuth } from "@/context/user-context";
import { List } from "graphql-utils";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductListView from "./product-list-view";
import BranchListView from "./branch-list-view";

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

  if (!list) return <></>;

  return <div>
    <div className="mb-10">
      <h2 className="font-bold text-xl">{list.name}</h2>
    </div>

    <div>
      {tab === ListScreenTabType.Products && (<ProductListView list={list} />)}
      {tab === ListScreenTabType.Branches && (<BranchListView list={list} />)}
    </div>
  </div>;
}
