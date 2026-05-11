'use client';

import React, { forwardRef } from 'react';
import { FLYER_FORMATS, FlyerFormat } from '@/lib/constants/flyer-formats';
import { StorefrontFlyerSection } from 'graphql-utils';
import Image from 'next/image';

interface FlyerCanvasProps {
  format: FlyerFormat;
  sections: StorefrontFlyerSection[];
  title?: string;
  storeName?: string;
}

export const FlyerCanvas = forwardRef<HTMLDivElement, FlyerCanvasProps>(
  ({ format, sections, title, storeName }, ref) => {
    const spec = FLYER_FORMATS[format];

    return (
      <div
        ref={ref}
        className="bg-white border-4 border-gray-300 flex flex-col"
        style={{
          width: `${spec.widthPx}px`,
          height: `${spec.heightPx}px`,
          padding: '16px',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        {(title || storeName) && (
          <div className="text-center mb-4 pb-2 border-b-2 border-gray-200">
            {storeName && <p className="text-xs font-bold text-gray-600">{storeName}</p>}
            {title && <h1 className="text-lg font-bold text-gray-800">{title}</h1>}
          </div>
        )}

        {/* Sections */}
        <div className="flex-1 overflow-hidden grid gap-2 grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded p-2 flex flex-col"
            >
              {/* Section Header */}
              {section.title && (
                <div className="mb-1 pb-1 border-b border-gray-200">
                  <p className="text-xs font-bold text-gray-700">{section.title}</p>
                  {section.description && (
                    <p className="text-xs text-gray-600">{section.description}</p>
                  )}
                </div>
              )}

              {/* Items */}
              <div className="flex-1 flex flex-col justify-start gap-1 overflow-hidden">
                {section.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 p-1 border border-gray-100 rounded bg-gray-50"
                  >
                    {/* Product Image */}
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                        width={100}
                        height={100}
                        quality={100}
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      {item.label && <p className="text-xs text-gray-600">{item.label}</p>}

                      {/* Price */}
                      <div className="flex items-center gap-1">
                        {item.price.sale && item.price.originalPrice ? (
                          <>
                            <span className="text-xs line-through text-gray-500">
                              {item.price.currencyCode} {item.price.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs font-bold text-red-600">
                              {item.price.currencyCode} {item.price.amount.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-gray-800">
                            {item.price.currencyCode} {item.price.amount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

FlyerCanvas.displayName = 'FlyerCanvas';
