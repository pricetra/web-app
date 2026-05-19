import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type HeroUploadProps = {
  isSectionSelected: boolean;
  heroImage?: string;

  onImageChange: (file: File) => void;
  onImageRemove: () => void;
};

export default function HeroUpload({
  isSectionSelected,
  heroImage,
  onImageChange,
  onImageRemove,
}: HeroUploadProps) {
  const [heroPreview, setHeroPreview] = useState<string>();
  const heroUploadInputRef = useRef<HTMLInputElement>(null);

  function handleHeroImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onImageChange(file);
  }

  function clearHeroImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onImageRemove();
  }

  useEffect(() => {
    if (!heroImage) {
      setHeroPreview(undefined);
      return;
    }

    if (typeof heroImage === "string") {
      setHeroPreview(heroImage);
      return;
    }

    const previewUrl = URL.createObjectURL(heroImage);
    setHeroPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [heroImage]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        {heroPreview && isSectionSelected && (
          <Button onClick={clearHeroImage} variant="destructive" size="xs">
            Remove
          </Button>
        )}
      </div>

      <div
        onClick={() => {
          if (!heroUploadInputRef.current) return;
          heroUploadInputRef.current.click();
        }}
        className="bg-gray-100 overflow-hidden cursor-pointer"
      >
        {heroPreview ? (
          <div className="relative h-40 w-full">
            <Image
              src={heroPreview}
              alt="Section hero preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center text-sm text-gray-500",
              !isSectionSelected && "hidden",
            )}
          >
            <p>Drag or upload a Hero Image Banner to make this section pop.</p>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleHeroImageChange}
        className="sr-only"
        ref={heroUploadInputRef}
      />
    </div>
  );
}
