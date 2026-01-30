"use client"

import { APP_STORE } from "@/constants/mobile-app";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react"

export default function IosClientPage() {
  const router = useRouter();
  useLayoutEffect(() => {
    router.push(APP_STORE)
  }, [router]);

  return <></>
}
