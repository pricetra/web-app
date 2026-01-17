"use client";

import { SmartPagination } from "@/components/ui/smart-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productImageUrlWithTimestamp } from "@/lib/files";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import { PaginatedAdminProductViewEntriesDocument } from "graphql-utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProductViewClient() {
  const searchParams = useSearchParams();
  const { data } = useQuery(PaginatedAdminProductViewEntriesDocument, {
    variables: {
      paginator: {
        limit: 100,
        page: +(searchParams.get("page") ?? "1"),
      },
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Referer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.paginatedAdminProductViewEntries?.productViewEntries?.map(
            (p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
                <TableCell className="min-w-[300px]">
                  {p.product && (
                    <Link
                      href={`/products/${p.productId}${p.stockId ? `?stockId=${p.stockId}` : ""}`}
                      className="flex flex-row gap-3"
                    >
                      <Image
                        src={productImageUrlWithTimestamp(p.product)}
                        alt={p.product.code}
                        width={100}
                        height={100}
                        className="size-[50px]"
                      />
                      <h4 className="line-clamp-3">{p.product.name}</h4>
                    </Link>
                  )}
                </TableCell>
                <TableCell
                  className={p.user?.name ? "text-black" : "text-gray-500"}
                >
                  {p.user?.name ?? "N/A"}
                </TableCell>
                <TableCell
                  className={p.origin ? "text-black" : "text-gray-500"}
                >
                  {p.origin ?? "N/A"}
                </TableCell>
                <TableCell>{p.platform}</TableCell>
                <TableCell className="text-right">
                  {dayjs(p.createdAt).format("DD/MM/YY h:mm a")}
                </TableCell>
                <TableCell className="font-mono max-w-sm">
                  {p.metadata}
                </TableCell>
                <TableCell className="font-mono max-w-sm">
                  {p.referrer}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      {data?.paginatedAdminProductViewEntries?.paginator?.numPages &&
        data.paginatedAdminProductViewEntries.paginator.numPages > 1 && (
          <div className="mt-10">
            <SmartPagination
              paginator={data.paginatedAdminProductViewEntries.paginator}
              urlBase="/admin/products/views"
            />
          </div>
        )}
    </div>
  );
}
