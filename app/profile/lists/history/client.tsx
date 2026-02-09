"use client"

import { ListScreenTabType } from "../[listId]/client";
import { ListIconRenderer } from "../../components/list-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHistoryListView from "./product-history-list-view";
import { useRouter } from "next/navigation";

export type MyHistoryListsClientProps = {
  tab: string;
};

export default function MyHistoryListsClient({
  tab,
}: MyHistoryListsClientProps) {
  const router = useRouter();

  function toTab(tab: ListScreenTabType) {
    router.push(`?tab=${tab}`);
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-bold text-xl flex flex-row items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
            {ListIconRenderer("history")}
          </div>
          History
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
          <ProductHistoryListView />
        </TabsContent>
        <TabsContent value={ListScreenTabType.Branches}>
          {/* TODO: Add branch view history */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
