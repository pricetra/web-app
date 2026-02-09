import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Paginator } from "graphql-utils";
import { useSearchParams } from "next/navigation";

export type SmartPaginationProps = {
  paginator: Paginator;
  urlBase?: string;
  onPageChange?: (page: number) => void;
  disableHref?: boolean;
};

export function SmartPagination({
  paginator,
  urlBase = "",
  disableHref = false,
  onPageChange,
}: SmartPaginationProps) {
  const { page, numPages, prev, next } = paginator;
  const searchParams = useSearchParams();
  const searchParamsBuilder = new URLSearchParams(searchParams);

  function buildHref(page: number) {
    if (disableHref) return "";
    searchParamsBuilder.set("page", String(page));
    return `${urlBase}?${searchParamsBuilder.toString()}`;
  }

  // Helper to create a safe page range
  const pages: (number | "...")[] = [];

  const firstPages = [1, 2];
  const lastPages = [numPages - 1, numPages];

  const middlePages = [page - 1, page, page + 1].filter(
    (p) => p >= 1 && p <= numPages,
  );

  // Add first two pages
  for (const p of firstPages) {
    if (p <= numPages) pages.push(p);
  }

  // Insert ellipsis if needed
  if (middlePages[0] > 3) pages.push("...");

  // Add middle pages
  for (const p of middlePages) {
    if (!pages.includes(p)) pages.push(p);
  }

  // Insert ellipsis if needed
  if (middlePages[middlePages.length - 1] < numPages - 2) pages.push("...");

  // Add last two pages
  for (const p of lastPages) {
    if (p > 0 && p !== 1 && !pages.includes(p)) pages.push(p);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={prev ? buildHref(prev) : undefined}
            onClick={() => {
              if (!onPageChange || !prev) return;
              onPageChange(prev);
            }}
            aria-disabled={!prev}
            className={!prev ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page links */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis className="text-gray-500" />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildHref(p)}
                onClick={() => {
                  if (!onPageChange) return;
                  onPageChange(p);
                }}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={next ? buildHref(next) : undefined}
            onClick={() => {
              if (!onPageChange || !next) return;
              onPageChange(next);
            }}
            aria-disabled={!next}
            className={!next ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
