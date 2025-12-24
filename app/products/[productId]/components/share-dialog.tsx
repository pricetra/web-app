import ProductItem from "@/components/product-item";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useAuth } from "@/context/user-context";
import {
  generateProductShareDescription,
  generateProductShareLink,
} from "@/lib/strings";
import { Product, Stock } from "graphql-utils";
import { useMemo, useState } from "react";
import { FaFacebook, FaLink, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";

export type ShareDialogProps = {
  product: Product;
  stock?: Stock;
};

export default function ShareDialog({ product, stock }: ShareDialogProps) {
  const { user } = useAuth();
  const shareDescription = useMemo(
    () => generateProductShareDescription(product, stock, user, true),
    [product, stock, user]
  );
  const [shareDescriptionText, setShareDescriptionText] =
    useState(shareDescription);

  return (
    <div className="my-5">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-10">
        <ProductItem product={{ ...product, stock }} branchSlug={stock?.branch?.slug} hideStoreInfo={false} />
      </div>

      <div className="flex flex-row flex-wrap items-center justify-evenly gap-5">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            generateProductShareLink("facebook", product, stock, user)
          )}`}
          target="_blank"
          className="flex flex-col gap-2 p-1 justify-center items-center"
        >
          <div className="p-3 rounded-full bg-facebook">
            <FaFacebook color="white" size={20} />
          </div>
          <span className="text-xs">Facebook</span>
        </a>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            generateProductShareLink("whatsapp", product, stock, user)
          )}`}
          target="_blank"
          className="flex flex-col gap-2 p-1 justify-center items-center"
        >
          <div className="p-3 rounded-full bg-whatsapp">
            <FaWhatsapp color="white" size={20} />
          </div>
          <span className="text-xs">WhatsApp</span>
        </a>

        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(
            generateProductShareLink("x", product, stock, user)
          )}`}
          target="_blank"
          className="flex flex-col gap-2 p-1 justify-center items-center"
        >
          <div className="p-3 rounded-full bg-twitter">
            <FaXTwitter color="white" size={20} />
          </div>
          <span className="text-xs">X</span>
        </a>

        <a
          href={`https://nextdoor.com/news_feed/?open_composer=true&body=${encodeURIComponent(
            generateProductShareLink("nextdoor", product, stock, user)
          )}`}
          target="_blank"
          className="flex flex-col gap-2 p-1 justify-center items-center"
        >
          <div className="p-3 rounded-full bg-nextdoor">
            <svg
              fill="#ffffff"
              width="20px"
              height="20px"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M31.99 13.089l-15.99-9.792-5.495 3.365v-3.365h-5.005v6.427l-5.495 3.365 2.615 4.271 2.88-1.755v13.099h21v-13.099l2.875 1.755 2.615-4.271z"></path>{" "}
              </g>
            </svg>
          </div>
          <span className="text-xs">Nextdoor</span>
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              generateProductShareLink("other", product, stock, user)
            );
            toast.success("Copied URL to clipboard!");
          }}
          className="flex flex-col gap-2 p-1 justify-center items-center cursor-pointer"
        >
          <div className="p-3 rounded-full bg-white border border-gray-300">
            <FaLink color="black" size={20} />
          </div>
          <span className="text-xs">Copy Link</span>
        </button>
      </div>

      <div className="mt-5">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Enter your message"
            value={shareDescriptionText}
            onChange={(e) => setShareDescriptionText(e.target.value)}
            className="min-h-24"
          />
          <InputGroupAddon align="block-end">
            <Button
              variant="default"
              size="xs"
              onClick={() =>
                navigator.clipboard.writeText(shareDescriptionText)
              }
            >
              <MdContentCopy className="size-3" /> Copy
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
