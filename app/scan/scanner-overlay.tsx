"use client";

import { useEffect, useState } from "react";

export default function ScannerOverlay() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size.width || !size.height) return null;

  const { width, height } = size;

  const overlayColor = "rgba(0, 0, 0, 0.6)";
  const cutoutWidth = width * 0.8;
  const cutoutHeight = cutoutWidth * 0.5;
  const borderRadius = 15;

  const cutoutX = (width - cutoutWidth) / 2;
  const cutoutY = (height - cutoutHeight) / 2;

  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      {/* SVG overlay */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <mask id="scanner-mask">
            {/* Visible area */}
            <rect x="0" y="0" width={width} height={height} fill="white" />

            {/* Transparent cutout */}
            <rect
              x={cutoutX}
              y={cutoutY}
              width={cutoutWidth}
              height={cutoutHeight}
              rx={borderRadius}
              ry={borderRadius}
              fill="black"
            />
          </mask>
        </defs>

        {/* Dimmed background */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={overlayColor}
          mask="url(#scanner-mask)"
        />

        {/* White border */}
        <rect
          x={cutoutX}
          y={cutoutY}
          width={cutoutWidth}
          height={cutoutHeight}
          rx={borderRadius}
          ry={borderRadius}
          stroke="white"
          strokeWidth={3}
          fill="transparent"
        />
      </svg>

      {/* Scan line */}
      <div
        className="scanner-line"
        style={{
          left: cutoutX + 5,
          width: cutoutWidth - 10,
          top: cutoutY + 8,
          height: 3,
        }}
      />

      {/* CSS animation */}
      <style jsx>{`
        .scanner-line {
          position: absolute;
          background: red;
          border-radius: 2px;
          opacity: 0.9;
          animation: scan 3s ease-in-out infinite;
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(${cutoutHeight - 18}px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
