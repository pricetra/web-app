import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Branch, Store, StorefrontSetupTasksDocument, StorefrontSetupTaskType } from "graphql-utils";
import { Button } from "./ui/button";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { IconType } from "react-icons";
import { GiNewspaper, GiPriceTag } from "react-icons/gi";
import { FaStore, FaBoxOpen } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiClock, FiImage } from "react-icons/fi";
import Link from "next/link";
import { TOGGLE_CREATE_BRANCH_ID, TOGGLE_EDIT_DETAILS_ID } from "@/app/stores/[store]/manage/manage-store-page-client";
import { TOGGLE_ADD_PRODUCT_ID } from "@/app/stores/[store]/[branch]/manage/manage-branch-page-client";

const ICONS: Record<string, IconType | undefined> = {
  BANNER: GiNewspaper,
  BRANCH: FaStore,
  DETAILS: AiOutlineInfoCircle,
  HOURS: FiClock,
  LOGO: FiImage,
  PROMOTION: GiPriceTag,
  STOCKS: FaBoxOpen,
};

const FallbackIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="white" opacity="0.12" />
    <path
      d="M12 7v5l3 3"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function taskLink(taskType: StorefrontSetupTaskType, store: Store, branch?: Branch) {
  switch (taskType) {
    case StorefrontSetupTaskType.Logo:
      return `/stores/${store.slug}/manage#${TOGGLE_EDIT_DETAILS_ID}`
    case StorefrontSetupTaskType.Branch:
      return `/stores/${store.slug}/manage#${TOGGLE_CREATE_BRANCH_ID}`
    case StorefrontSetupTaskType.Stocks:
      return `/stores/${store.slug}${branch ? `/${branch.slug}` : ''}/manage#${TOGGLE_ADD_PRODUCT_ID}`
  }
  return `/stores/${store.slug}/manage`
}

export type StorefrontSetupTasksBannerProps = {
  storeId: number;
  store: Store;
  branchId?: number;
  branch?: Branch;
};

export default function StorefrontSetupTasksBanner({
  storeId,
  store,
  branchId,
  branch,
}: StorefrontSetupTasksBannerProps) {
  const { data } = useQuery(StorefrontSetupTasksDocument, {
    variables: { storeId, branchId },
  });
  const tasks = data?.storefrontSetupTasks ?? [];
  const total = tasks.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((i) => (tasks.length === 0 ? 0 : Math.min(i, tasks.length - 1)));
  }, [tasks.length]);

  if (tasks.length === 0) return <></>;

  const current = tasks[index];

  const prev = () =>
    setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  const next = () => setIndex((i) => (total === 0 ? 0 : (i + 1) % total));

  return (
    <div className="bg-white rounded-lg overflow-hidden block">
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-2 bg-pricetra-green-logo/20">
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-semibold">Finish Your Store Setup</span>
          <span className="text-xs sm:text-sm text-gray-600">
            {index + 1}/{total}
          </span>
        </div>
        <div className="flex items-center sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="previous"
            onClick={prev}
            className="hover:bg-pricetra-green-logo/50"
          >
            <GoChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="next"
            onClick={next}
            className="hover:bg-pricetra-green-logo/50"
          >
            <GoChevronRight />
          </Button>
        </div>
      </div>

      {/* Body */}
      <Link href={taskLink(current.taskType, store, branch)} className="flex items-start gap-4 p-4">
        <div className="shrink-0">
          <div className="size-10 sm:size-16 text-lg sm:text-3xl rounded-full bg-pricetra-green-dark flex items-center justify-center">
            {(() => {
              const Icon = ICONS[current.taskType as string];
              if (Icon) return <Icon color="white" />;
              return <FallbackIcon />;
            })()}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold">{current.title}</h3>
          {current.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">{current.description}</p>
          )}

          {current.taskProgressPercent && (
            <div className="mt-3">
              <div className="w-full h-2 bg-pricetra-green-logo/30 rounded">
                <div
                  className="h-2 rounded bg-pricetra-green-heavy-dark"
                  style={{
                    width: `${Math.min(100, Math.max(0, current.taskProgressPercent ?? 0))}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(current.taskProgressPercent ?? 0)}%
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
