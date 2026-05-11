'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { useReactToPrint } from '@hugocxl/react-to-image';
import dayjs from 'dayjs';

import {
  CreateStorefrontFlyerPageDocument,
  AllProductsDocument,
  type StorefrontFlyerItem,
  type StorefrontFlyerSection,
  type FlyerFormat,
} from 'graphql-utils';
import { FLYER_FORMATS } from '@/lib/constants/flyer-formats';
import { FlyerCanvas } from './flyer-canvas';
import { Button } from '@/components/ui/button';
import { InputGroup } from '@/components/ui/input-group';

interface FlyerEditorProps {
  flyerId: number;
  storeId: number;
  branchId: number | null;
  storeName: string;
  format: FlyerFormat;
  flyerTitle: string;
  onPageCreated: () => void;
  onPublishReady: () => void;
}

export const FlyerEditorClient: React.FC<FlyerEditorProps> = ({
  flyerId,
  storeId,
  branchId,
  storeName,
  format,
  flyerTitle,
  onPageCreated,
  onPublishReady,
}) => {
  const [sections, setSections] = useState<Partial<StorefrontFlyerSection>[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<number, Partial<StorefrontFlyerItem>>>(new Map());
  const [pageTitle, setPageTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch products
  const [searchProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(
    AllProductsDocument,
    {
      onError: (error) => toast.error(`Search failed: ${error.message}`),
    }
  );

  // Create page mutation
  const [createPage] = useMutation(CreateStorefrontFlyerPageDocument, {
    onCompleted: () => {
      toast.success('Page added successfully!');
      setSections([]);
      setSelectedProducts(new Map());
      setPageTitle('');
      onPageCreated();
    },
    onError: (error) => {
      toast.error(`Failed to create page: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // React to image hook for capturing canvas as image
  const reactToPrint = useReactToPrint({
    contentRef: canvasRef,
    copyStyles: true,
    fonts: [
      {
        family: 'system-ui',
        source: 'system-ui',
      },
    ],
  });

  // Trigger product search
  const handleSearchProducts = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    searchProducts({
      variables: {
        search: {
          query: searchQuery,
          storeId,
          branchId: branchId || undefined,
        },
      },
    });
  };

  // Add product to selected items
  const handleAddProduct = (product: any) => {
    if (selectedProducts.has(product.id)) {
      toast.info('Product already added');
      return;
    }

    const newItem: Partial<StorefrontFlyerItem> = {
      id: `item-${product.id}-${Date.now()}`,
      sortOrder: selectedProducts.size,
      productId: Number(product.id),
      stockId: Number(product.stock?.id || 0),
      product: {
        id: Number(product.id),
        name: product.name,
        image: product.image,
      },
      price: {
        id: Number(product.stock?.latestPriceId || 0),
        amount: product.stock?.price?.amount || 0,
        currencyCode: product.stock?.price?.currencyCode || 'USD',
        originalPrice: product.stock?.price?.originalPrice,
        sale: product.stock?.price?.sale,
      },
    } as any;

    setSelectedProducts((prev) => new Map(prev).set(product.id, newItem));
    toast.success(`${product.name} added`);
  };

  // Create a new section
  const handleAddSection = () => {
    const newSection: Partial<StorefrontFlyerSection> = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      sortOrder: sections.length,
      items: [],
    } as any;
    setSections([...sections, newSection]);
  };

  // Add item to section
  const handleAddItemToSection = (sectionId: string, item: FlyerItem) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, item] }
          : section
      )
    );
    setSelectedProducts((prev) => {
      const updated = new Map(prev);
      updated.delete(item.productId);
      return updated;
    });
  };

  // Update section title
  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // Remove item from section
  const handleRemoveItemFromSection = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((i) => i.id !== itemId) }
          : section
      )
    );
  };

  // Generate image and submit page
  const handleSubmitPage = async () => {
    if (sections.length === 0 || sections.every((s) => s.items.length === 0)) {
      toast.error('Please add at least one item to your flyer');
      return;
    }

    setIsSubmitting(true);

    try {
      // Capture canvas as image
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas reference not available');
      }

      // Convert HTML to image using html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const imageCanvas = await html2canvas(canvas, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const imageBlob = await new Promise<Blob>((resolve) => {
        imageCanvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const imageFile = new File([imageBlob], `flyer-page-${Date.now()}.png`, {
        type: 'image/png',
      });

      // Prepare sections for mutation
      const sectionsInput = sections.map((section) => ({
        title: section.title,
        sortOrder: section.sortOrder,
        items: section.items.map((item) => ({
          sortOrder: item.sortOrder,
          productId: item.productId,
          stockId: item.stockId,
          label: item.label,
        })),
      }));

      // Submit page
      await createPage({
        variables: {
          input: {
            storefrontFlyerId: flyerId,
            title: pageTitle || undefined,
            pageImage: imageFile,
            styles: '{}',
            layout: '{}',
            sections: sectionsInput,
          },
        },
      });
    } catch (error) {
      console.error('Error submitting page:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Left Panel: Product Search */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg mb-4">Search Products</h3>

          <div className="space-y-2">
            <InputGroup
              type="text"
              placeholder="Search by name, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchProducts()}
              disabled={productsLoading}
            />
            <Button
              onClick={handleSearchProducts}
              disabled={productsLoading}
              className="w-full"
            >
              {productsLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded">
            {productsData?.products?.map((product: any) => (
              <div
                key={product.id}
                className="p-2 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-600">
                    {product.stock?.price?.currencyCode} {product.stock?.price?.amount}
                  </p>
                </div>
                <Button
                  onClick={() => handleAddProduct(product)}
                  size="sm"
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Products */}
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-bold mb-2">Selected ({selectedProducts.size})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Array.from(selectedProducts.values()).map((item) => (
              <div
                key={item.id}
                className="p-2 bg-blue-50 rounded text-sm flex justify-between items-center"
              >
                <p className="truncate flex-1">{item.product.name}</p>
                <p className="font-semibold text-xs">{item.price.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Panel: Canvas Preview */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="bg-gray-100 rounded-lg p-4 overflow-auto" style={{ maxHeight: '70vh' }}>
          <FlyerCanvas
            ref={canvasRef}
            format={format}
            sections={sections}
            title={pageTitle || undefined}
            storeName={storeName}
          />
        </div>

        {/* Page Title */}
        <InputGroup
          type="text"
          placeholder="Page title (optional)"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Submit Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSubmitPage}
            disabled={isSubmitting || sections.length === 0}
            className="flex-1"
          >
            {isSubmitting ? 'Creating Page...' : 'Add Page'}
          </Button>
          <Button
            onClick={onPublishReady}
            variant="outline"
            className="flex-1"
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Right Panel: Section Editor */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Sections</h3>
            <Button onClick={handleAddSection} size="sm">
              + Add Section
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded p-3">
                {/* Section Title */}
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  className="w-full text-sm font-bold mb-2 px-2 py-1 border border-gray-300 rounded"
                  placeholder="Section title"
                />

                {/* Items in Section */}
                <div className="space-y-2 mb-2">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded"
                    >
                      <span className="truncate">{item.product.name}</span>
                      <button
                        onClick={() => handleRemoveItemFromSection(section.id, item.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Item Dropdown */}
                {selectedProducts.size > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const item = selectedProducts.get(Number(e.target.value));
                        if (item) {
                          handleAddItemToSection(section.id, item);
                          e.target.value = '';
                        }
                      }
                    }}
                    className="w-full text-xs mb-2 px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Add product to section...</option>
                    {Array.from(selectedProducts.values()).map((item) => (
                      <option key={item.id} value={item.productId}>
                        {item.product.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Delete Button */}
                <Button
                  onClick={() => handleDeleteSection(section.id)}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-500"
                >
                  Delete Section
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
