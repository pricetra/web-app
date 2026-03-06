"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouteHistory } from "@/context/route-history";

NProgress.configure({ showSpinner: false, trickleSpeed: 50 });

export default function RouteProgress() {
  const { addToHistory, history } = useRouteHistory();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => { console.log(history) }, [history])

  useEffect(() => {
    addToHistory(window.location.href);
    NProgress.done();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
