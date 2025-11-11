"use client";

import { useAuth } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutClientPage() {
  const router = useRouter();
  const { loggedIn, logout } = useAuth();

  useEffect(() => {
    if (!loggedIn) return;

    logout().then(() => {
      router.replace("/");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Animated spinner */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative size-16">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-foreground">Logging out</p>
        </div>
      </div>
    </div>
  );
}
