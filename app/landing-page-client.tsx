"use client";

import Link from "@/components/ui/link";
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  PaginatorInput,
  Product,
} from "graphql-utils";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import StoreMini, {
  StoreMiniLoading,
  StoreMiniShowMore,
} from "@/components/store-mini";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import { useEffect } from "react";
import Aos from "aos";
import { useAuth } from "@/context/user-context";
import LandingHeader from "@/components/ui/landing-header";
import useLocationInput from "@/hooks/useLocationInput";
import ScrollContainer from "@/components/scroll-container";
import LandingFooter from "@/components/ui/landing-footer";
import { useRouter } from "next/navigation";
import {
  Search,
  Barcode,
  MapPin,
  TrendingDown,
  ListChecks,
} from "lucide-react";
import { HiMiniBellAlert } from "react-icons/hi2";
import Feature from "@/components/landing-page/features";
import TaglineWordRender from "@/components/landing-page/tagline-word-render";
import Image from "next/image";

const paginator: PaginatorInput = { page: 1, limit: 3 };
const productLimit = 10;

export default function LandingPage({ ipAddress }: { ipAddress: string }) {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const fullLocationInput = useLocationInput(ipAddress);
  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: "cache-first",
    variables: { paginator: { page: 1, limit: 9 } },
  });
  const [getBranchProducts, { data: branchesWithProducts }] = useLazyQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  useEffect(() => {
    if (!fullLocationInput) return;
    getBranchProducts({
      variables: {
        paginator,
        productLimit,
        filters: {
          location: fullLocationInput.locationInput,
        },
      },
    });
  }, [getBranchProducts, fullLocationInput]);

  useEffect(() => {
    if (!loggedIn) return;
    router.push("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative max-w-full sm:container mx-auto flex flex-row gap-5 justify-between items-center py-6 md:py-10">
        <div className="px-6 md:px-8 py-12 md:py-20 flex-2">
          <div className="max-w-4xl" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-6">
              Discover{" "}
              <TaglineWordRender words={["products", "prices", "stores"]} />{" "}
              <span className="block">near you.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Search products, compare prices across stores, discover local and
              online retailers, and get notified when prices or availability
              change.
            </p>

            {!loggedIn && (
              <div className="flex flex-col xs:flex-row gap-4">
                <Link
                  href="/home"
                  className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-8 py-3 text-base md:text-lg font-semibold rounded-xl transition-colors inline-block text-center"
                >
                  Start Exploring
                </Link>
                <a
                  href="#showcase"
                  className="border-2 border-slate-300 text-slate-900 hover:bg-slate-50 px-8 py-3 rounded-xl font-semibold transition-colors inline-block text-center"
                >
                  Learn More
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Floating Phone */}
        <div className="pointer-events-none hidden md:flex flex-1 justify-end">
          <div
            className="relative rounded-4xl p-2 shadow-2xl transform rotate-6 bg-gray-100 md:w-52 lg:w-60 xl:w-72 h-auto"
            data-aos="fade-up"
          >
            <Image
              src="https://res.cloudinary.com/pricetra-cdn/image/upload/homepage-main-screenshot.png"
              alt="Pricetra Mobile App"
              width={280}
              height={560}
              quality={100}
              className="rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Store Logos Section */}
      <section
        className="relative w-full max-w-[1000px] mx-auto py-16 md:py-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
            Explore your favorite stores
          </h2>
          <section className="grid grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-5 sm:gap-5">
            {!allStoresData ? (
              Array(10)
                .fill(0)
                .map((_, i) => <StoreMiniLoading key={`store-loading-${i}`} />)
            ) : (
              <>
                {allStoresData.allStores.stores.map((store) => (
                  <StoreMini store={store} key={`store-${store.id}`} />
                ))}
                <StoreMiniShowMore />
              </>
            )}
          </section>
        </div>
      </section>

      {/* Nearby Stores + Products Section */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">
            {`What's`} available near you
          </h2>

          <div className="flex flex-col my-10 relative">
            {!branchesWithProducts
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <article
                      className="my-7"
                      key={`branch-with-product-loading-${i}`}
                    >
                      <div className="mb-5">
                        <BranchItemWithLogoLoading />
                      </div>

                      <ScrollContainer hideButtons>
                        {Array(10)
                          .fill(0)
                          .map((_, j) => (
                            <ProductLoadingItemHorizontal
                              key={`branch-product-${i}-${j}`}
                            />
                          ))}
                      </ScrollContainer>
                    </article>
                  ))
              : branchesWithProducts.branchesWithProducts.branches.map(
                  (branch) => (
                    <article
                      className="my-7"
                      key={`branch-with-product-${branch.id}`}
                    >
                      <div className="mb-5">
                        <BranchItemWithLogo branch={branch as Branch} />
                      </div>

                      <ScrollContainer>
                        {(branch.products ?? []).map((product) => (
                          <ProductItemHorizontal
                            product={product as Product}
                            branchSlug={branch.slug}
                            key={`branch-product-${branch.id}-${product.id}`}
                          />
                        ))}
                      </ScrollContainer>
                    </article>
                  ),
                )}

            <div>
              <div className="absolute bottom-0 left-0 w-full z-2">
                <div className="inset-x-0 h-[50vh] bg-gradient-to-t from-slate-50 **from-[40%]**" />
                <div className="h-20 bg-slate-50 w-full" />
              </div>
              <div className="absolute bottom-20 left-0 flex flex-row items-center justify-center w-full">
                <Link
                  href="/home"
                  className="block bg-pricetra-green-heavy-dark hover:bg-pricetra-green-heavy-dark-hover text-white font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full text-base md:text-lg z-3 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need before you shop
            </h2>
            <p className="text-slate-600">
              Discover products and stores with tools designed for smarter
              shopping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Feature
              title="Discover Products"
              description="Find products across local and national retailers in seconds."
              icon={<Search className="w-8 h-8" />}
            />

            {/* Feature 2 */}
            <Feature
              title="Compare Prices"
              description="See pricing and promotions from multiple stores instantly."
              icon={<TrendingDown className="w-8 h-8" />}
            />

            {/* Feature 3 */}
            <Feature
              title="Find Availability"
              description="Know where products are available before leaving home."
              icon={<MapPin className="w-8 h-8" />}
            />

            {/* Feature 4 */}
            <Feature
              title="Scan Barcodes"
              description="Scan UPC codes to instantly find products and prices."
              icon={<Barcode className="w-8 h-8" />}
            />

            {/* Feature 5 */}
            <Feature
              title="Create Lists"
              description="Organize products and plan grocery trips with shopping lists."
              icon={<ListChecks className="w-8 h-8" />}
            />

            {/* Feature 6 */}
            <Feature
              title="Track Prices"
              description="Get notified about price drops and sales on your favorite items."
              icon={<HiMiniBellAlert className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Why Use Pricetra Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits List */}
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why shoppers choose Pricetra
              </h2>
              <ul className="space-y-4">
                {[
                  "Compare prices at nearby stores instantly",
                  "Discover local and national retailers",
                  "Track sales and special promotions",
                  "Save your favorite products",
                  "Build and manage shopping lists",
                  "Follow stores for new updates",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pricetra-green-dark flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Mock Search Results */}
            <div data-aos="fade-left">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-6">
                  Search example: {`"Milk"`}
                </h3>

                {/* Result Card 1 */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Whole Milk • 128 fl oz
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Jewel-Osco</span>
                      <span className="font-semibold text-pricetra-green-dark">
                        $2.99
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Walmart</span>
                      <span className="font-semibold text-slate-900">
                        $3.19
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Target</span>
                      <span className="font-semibold text-slate-900">
                        $3.49
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result Card 2 */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Almond Milk • 64 fl oz
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Whole Foods</span>
                      <span className="font-semibold text-pricetra-green-dark">
                        $3.49
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Jewel-Osco</span>
                      <span className="font-semibold text-slate-900">
                        $3.99
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Safeway</span>
                      <span className="font-semibold text-slate-900">
                        $4.19
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Discovery Flywheel */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Discover more than just prices
            </h2>
            <p className="text-slate-600">
              Pricetra connects you with products, stores, and deals all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Products Card */}
            <div
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center"
              data-aos="fade-up"
            >
              <div className="w-16 h-16 bg-pricetra-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Products
              </h3>
              <p className="text-slate-600">
                Search and explore thousands of products from your favorite
                brands.
              </p>
            </div>

            {/* Stores Card */}
            <div
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-16 h-16 bg-pricetra-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Stores</h3>
              <p className="text-slate-600">
                Discover local and national retailers near you with real-time
                information.
              </p>
            </div>

            {/* Deals Card */}
            <div
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-pricetra-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Deals</h3>
              <p className="text-slate-600">
                Find promotions, sales, and price drops on products you care
                about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Own a store?
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Showcase products, prices, inventory, and promotions to shoppers
              actively searching for what you sell.
            </p>
            <Link
              href="/business"
              className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-8 py-3 font-semibold rounded-lg inline-block transition-colors"
            >
              Learn About Pricetra for Business
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Start discovering products today
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Join shoppers using Pricetra to find products, compare prices, and
              discover stores nearby.
            </p>

            {!loggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-8 py-3 text-base md:text-lg font-semibold rounded-xl transition-colors inline-block text-center"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/home"
                  className="border-2 border-gray-400 hover:border-gray-800 text-gray-800 hover:text-white hover:bg-gray-800 px-8 py-3 text-base md:text-lg font-semibold rounded-xl transition-colors inline-block text-center"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
