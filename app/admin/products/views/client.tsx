"use client";

import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
import { useLazyQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import { PaginatedAdminProductViewEntriesDocument } from "graphql-utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";

export default function ProductViewClient() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const [limit, setLimit] = useState(50);
  const [reload, setReload] = useState(false);
  const [getAdminProductViewEntries, { data, loading }] = useLazyQuery(
    PaginatedAdminProductViewEntriesDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    getAdminProductViewEntries({
      variables: {
        paginator: {
          limit,
          page: +(searchParams.get("page") ?? "1"),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, reload, limit]);

  return (
    <div>
      <div className="flex flex-row items-center gap-3 mb-10 px-5">
        <Button
          onClick={() => setReload((r) => !r)}
          variant="secondary"
          size="sm"
        >
          <FiRefreshCcw className="size-3" /> Refresh
        </Button>

        <div className="w-full max-w-28">
          <NativeSelect
            onChange={(e) => {
              const limit = +e.target.value;
              setLimit(limit);
            }}
          >
            {Array(3)
              .fill(0)
              .map((_, i) => {
                const value = (i + 1) * 50;
                return (
                  <NativeSelectOption key={`select-limit-${i}`} value={value}>
                    Limit: {(i + 1) * 50}
                  </NativeSelectOption>
                );
              })}
          </NativeSelect>
        </div>
      </div>

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
          {loading &&
            Array(limit)
              .fill(0)
              .map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  <TableCell className="font-medium">
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell className="min-w-[300px]">
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell className="font-mono max-w-sm">
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                  <TableCell className="font-mono max-w-sm">
                    <Skeleton
                      style={{ borderRadius: 10, height: 20, width: 50 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
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
                      <div>
                        <h4 className="line-clamp-2">{p.product.name}</h4>
                        {p.stockId && (<p className="text-xs text-gray-500 mt-1">Stock: {p.stockId}</p>)}
                      </div>
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
