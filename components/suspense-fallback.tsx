"use client";

export function SuspenseFallbackLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Animated spinner */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative size-20 animate-pulse">
          <img src="/logo_black_color_dark_leaf.svg" alt="logo" />
        </div>
      </div>
    </div>
  );
}

export function SuspenseFallbackIcon() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Animated spinner */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative size-16">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
          ></div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-foreground">Loading</p>
        </div>
      </div>
    </div>
  );
}

export function SuspenseFallback() {
  return <SuspenseFallbackLogo />
}
