import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Paginator } from "graphql-utils/types/graphql";

export function SmartPagination({ paginator }: { paginator: Paginator }) {
  const { page, numPages, prev, next } = paginator;

  // Helper to create a safe page range
  const pages: (number | "...")[] = [];

  const firstPages = [1, 2];
  const lastPages = [numPages - 1, numPages];

  const middlePages = [page - 1, page, page + 1].filter(
    (p) => p >= 1 && p <= numPages
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
            href={prev ? `?page=${prev}` : undefined}
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
                href={`?page=${p}`}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={next ? `?page=${next}` : undefined}
            aria-disabled={!next}
            className={!next ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
