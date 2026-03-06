"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useRouteHistory } from "@/context/route-history";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 50 });

export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToHistory } = useRouteHistory();

  useEffect(() => {
    addToHistory(window.location.href);
    NProgress.done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
