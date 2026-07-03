"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  Branch,
  PaginatedStocksDocument,
  RemoveStockDocument,
  Stock,
  Store,
} from "graphql-utils";
import { SmartPagination } from "@/components/ui/smart-pagination";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { RiAdminLine } from "react-icons/ri";
import { useNavbar } from "@/context/navbar-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import StoreItem from "@/components/store-item";
import Link from "next/link";
import { slugifyProductName } from "@/lib/strings";

export default function StocksClient() {
  const { setPageIndicator, resetAll } = useNavbar();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [getStocks, { data, loading }] = useLazyQuery(PaginatedStocksDocument, {
    fetchPolicy: "no-cache",
  });

  const [removeStock] = useMutation(RemoveStockDocument);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  useLayoutEffect(() => {
    setPageIndicator(
      <NavPageIndicator icon={RiAdminLine} title="Admin" href="/admin" />
    );
    return () => resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getStocks({ variables: { paginator: { limit: 25, page }, filters: {} } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const stocks = data?.paginatedStocks?.stocks ?? [];
  const paginator = data?.paginatedStocks?.paginator;

  const handleRemove = async () => {
    if (!selectedStock) return;
    setRemoving(true);
    try {
      await removeStock({ variables: { stockId: selectedStock.id } });
      setConfirmOpen(false);
      setSelectedStock(null);
      getStocks({ variables: { paginator: { limit: 25, page }, filters: {} } });
    } catch (error) {
      console.error("Error removing stock:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="w-full flex-1 p-5">
      <div className="flex flex-row items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold">Stocks</h1>
          <p className="text-sm text-gray-500">View and manage store stocks.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>Store / Branch</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Updated</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {Array(6)
                      .fill(0)
                      .map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full rounded bg-gray-100" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}

            {stocks.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.id}</TableCell>
                <TableCell className="min-w-[250px]">
                  {s.branch && s.store && (
                    <StoreItem store={s.store as Store} branch={s.branch as Branch} />
                  )}
                </TableCell>
                <TableCell className="min-w-[250px]">
                  {s.product && (
                    <Link href={`/products/${s.product.id}-${slugifyProductName(s.product.name)}${s.branch ? `/${s.branch.slug}` : ""}`} className="flex items-center gap-3">
                      <Image
                        src={s.product.image ?? "/placeholder-product.png"}
                        alt={s.product.name ?? "product"}
                        width={56}
                        height={56}
                      className="rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{s.product.name}</div>
                      <div className="text-xs text-gray-600">{s.product.brand}</div>
                    </div>
                  </Link>)}
                </TableCell>
                <TableCell>{s.latestPrice?.amount ?? "-"}</TableCell>
                <TableCell className="text-right text-sm">
                  {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="xs"
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => {
                      setSelectedStock(s as Stock);
                      setConfirmOpen(true);
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginator?.numPages && paginator.numPages > 1 && (
        <div className="mt-6">
          <SmartPagination paginator={paginator} urlBase="/admin/stocks" />
        </div>
      )}

      {selectedStock && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Stock</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to remove this stock entry?
              </p>
              {selectedStock.product && (
                <p className="text-sm text-gray-600 mt-2">
                  Product: <span className="font-medium">{selectedStock.product.name}</span>
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={removing}
              >
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? "Removing..." : "Yes, Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
