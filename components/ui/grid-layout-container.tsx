import { ReactNode } from "react";

export type GridLayoutContainerProps = {
  children: ReactNode;
};

export function GridLayoutContainerMain({
  children,
}: GridLayoutContainerProps) {
  return (
    <div className="w-full lg:flex-3 min-w-0">
      {children}
    </div>
  );
}

export type GridLayoutContainerSecondaryProps = GridLayoutContainerProps & {
  sticky?: boolean;
  stickyTopHeight?: number; 
};

export function GridLayoutContainerSecondary({
  children,
  sticky,
  stickyTopHeight = 60,
}: GridLayoutContainerSecondaryProps) {
  return (
    <aside className="w-full px-2 relative flex-1">
      {sticky ? (
        <div
          className="w-full h-screen hidden lg:block lg:sticky top-0"
          style={{
            top: stickyTopHeight,
            maxHeight: `calc(100vh - ${stickyTopHeight}px)`,
          }}
        >
          {children}
        </div>
      ) : (
        <div className="w-full h-screen hidden lg:block">
          {children}
        </div>
      )}
    </aside>
  );
}
