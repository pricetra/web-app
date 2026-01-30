"use client"

import { PLAY_STORE } from "@/constants/mobile-app";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react"

export default function AndroidClientPage() {
  const router = useRouter();
  useLayoutEffect(() => {
    router.push(PLAY_STORE)
  }, [router]);

  return <></>
}
