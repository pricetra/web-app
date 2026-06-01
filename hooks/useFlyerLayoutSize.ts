import { flyerFormatToFlyerSpec } from "@/lib/constants/flyer-formats";
import { StorefrontFlyerFormat } from "graphql-utils";
import { useEffect, useMemo, useState } from "react";

export default function useFlyerLayoutSize(format: StorefrontFlyerFormat) {
  const spec = useMemo(
    () => flyerFormatToFlyerSpec[format] ?? flyerFormatToFlyerSpec["Letter"],
    [format],
  );
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: spec?.widthPx ?? 600,
    height: spec?.heightPx ?? 800,
  }));

  useEffect(() => {
    if (!spec) return;

    const compute = () => {
      const marginW = 48; // padding around the flyer container
      const marginH = 120; // account for headers/controls
      const maxW = Math.max(200, window.innerWidth - marginW);
      const maxH = Math.max(200, window.innerHeight - marginH);

      // use pixel dimensions from spec to preserve aspect ratio
      const specW = spec.widthPx;
      const specH = spec.heightPx;

      const widthIfFitHeight = Math.round(maxH * (specW / specH));
      if (widthIfFitHeight <= maxW) {
        setSize({ width: widthIfFitHeight, height: Math.round(maxH) });
      } else {
        const heightIfFitWidth = Math.round(maxW * (specH / specW));
        setSize({ width: Math.round(maxW), height: heightIfFitWidth });
      }
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [spec]);

  return size;
}
