import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { StorefrontSetupTasksDocument } from "graphql-utils";
import { Button } from "./ui/button";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

export type StorefrontSetupTasksBannerProps = {
  storeId: number;
  branchId?: number;
};

export default function StorefrontSetupTasksBanner({ storeId, branchId }: StorefrontSetupTasksBannerProps) {
  const { data } = useQuery(StorefrontSetupTasksDocument, { variables: { storeId, branchId } });
  const tasks = data?.storefrontSetupTasks ?? [];
  const total = tasks.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((i) => (tasks.length === 0 ? 0 : Math.min(i, tasks.length - 1)));
  }, [tasks.length]);

  if (tasks.length === 0) return <></>;

  const current = tasks[index];

  const prev = () => setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  const next = () => setIndex((i) => (total === 0 ? 0 : (i + 1) % total));

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-2 bg-pricetra-green-logo/20">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Store setup</span>
          <span className="text-sm text-gray-600">{index + 1}/{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="previous" onClick={prev} className="hover:bg-pricetra-green-logo/50">
            <GoChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" aria-label="next" onClick={next} className="hover:bg-pricetra-green-logo/50">
            <GoChevronRight />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-start gap-4 p-4">
        <div className="flex-shrink-0">
          <div
            className="size-16 rounded-full bg-pricetra-green-dark"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{current.title}</h3>
          {current.description && <p className="text-sm text-gray-600 mt-2">{current.description}</p>}

          {current.taskProgressPercent && <div className="mt-3">
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 rounded"
                style={{
                  width: `${Math.min(100, Math.max(0, current.taskProgressPercent ?? 0))}%`,
                  backgroundColor: "var(--pricetra-dark, #0f172a)",
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{Math.round(current.taskProgressPercent ?? 0)}%</div>
          </div>}
        </div>
      </div>
    </div>
  );
}
