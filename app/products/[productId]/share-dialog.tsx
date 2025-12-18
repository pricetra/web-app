import ProductItem from "@/components/product-item";
import { useAuth } from "@/context/user-context";
import { Product, Stock } from "graphql-utils";
import { useMemo } from "react";
import {
  FaFacebook,
  FaLink,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { toast } from "sonner";

export type ShareDialogProps = {
  product: Product;
  stock?: Stock;
}

export default function ShareDialog({product, stock}: ShareDialogProps) {
  const { user } = useAuth();
  const fullUrl = useMemo(() => {
      const paramBuilder = new URLSearchParams();
      if (stock) {
        paramBuilder.set("stockId", stock.id.toString());
      }
      if (user) {
        paramBuilder.set("sharedBy", user.id.toString());
      }
      paramBuilder.set("sharedFrom", "web");
      return `https://pricetra.com/products/${
        product.id
      }?${paramBuilder.toString()}`;
    }, [product.id, stock, user]);

  return (
    <div className="my-5">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-10">
        <ProductItem product={{ ...product, stock }} />
      </div>

      <div className="flex flex-row flex-wrap items-center justify-evenly gap-5">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            fullUrl
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
          href={`https://wa.me/?text=${encodeURIComponent(fullUrl)}`}
          target="_blank"
          className="flex flex-col gap-2 p-1 justify-center items-center"
        >
          <div className="p-3 rounded-full bg-whatsapp">
            <FaWhatsapp color="white" size={20} />
          </div>
          <span className="text-xs">WhatsApp</span>
        </a>

        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`}
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
            fullUrl
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
            navigator.clipboard.writeText(fullUrl);
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
    </div>
  );
}
