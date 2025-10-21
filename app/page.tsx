"use client";
import StepsPanel, { steps } from "@/components/landing-page/Screenshot";
import ScreenshotShowcasePanel, {
  screenshots,
} from "@/components/landing-page/StepsPanel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  Product,
} from "@/graphql/types/graphql";
import { useQuery } from "@apollo/client/react";
import StoreMini, { StoreMiniLoading } from "@/components/StoreMini";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/BranchItemWithLogo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/ProductItemHorizontal";

export default function LandingPage() {
  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: "cache-first",
    variables: {
      paginator: { page: 1, limit: 9 },
    },
  });

  const { data: branchesWithProducts } = useQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
      variables: {
        paginator: {
          limit: 3,
          page: 1,
        },
        productLimit: 10,
        filters: {
          branchIds: [2, 6, 14, 38, 42, 11],
        },
      },
    }
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-slate-50">
      {/* Header */}
      <header className="w-full z-10">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-8 py-7 md:py-10">
          <Image
            src="/logotype_header_black.svg"
            alt="Pricetra"
            width={210}
            height={40}
            className="sm:h-[30px] hidden sm:block w-auto color-white"
            priority
          />

          <Image
            src="/logo_black_color_dark_leaf.svg"
            alt="Pricetra"
            width={210}
            height={40}
            className="h-[30px] block sm:hidden w-auto color-white"
            priority
          />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-pricetra-green-dark hover:bg-pricetra-green-logo/10 px-3 md:px-4 font-bold"
            >
              Login
            </Button>
            <Button className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-4 md:px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-bold">
              Create Account
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container mx-auto flex flex-row gap-5 justify-between items-center py-10">
        <div className="px-6 md:px-8 py-12 md:py-20 flex-1">
          <div className="text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Beat Inflation. <span>Track Prices.</span>{" "}
                <span className="text-pricetra-green-dark">Save Money.</span>
              </h1>
            </div>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-800 max-w-3xl mx-auto">
              Pricetra is a community-powered price tracking app that helps
              shoppers discover the best deals nearby. Compare costs per unit,
              watch your favorites, and get notified when prices change.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Start for Free
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Learn More
              </Button>
            </div>
            <p className="mt-3 text-xs md:text-sm text-slate-500">
              No credit card required • Free forever
            </p>
          </div>
        </div>

        {/* Floating Phone Background */}
        <div className="pointer-events-none hidden md:block">
          <div className="relative rounded-4xl p-2 shadow-2xl transform rotate-6 bg-gray-100">
            <Image
              src="https://res.cloudinary.com/pricetra-cdn/image/upload/homepage-main-screenshot.png"
              alt="Pricetra Mobile App"
              width={280}
              height={560}
              className="md:w-52 lg:w-60 xl:w-64 h-auto rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="relative container mx-auto mt-5 mb-16">
        <section className="flex flex-row flex-wrap items-center justify-center gap-5 px-5 mb-10">
          {!allStoresData
            ? Array(10)
                .fill(0)
                .map((_, i) => <StoreMiniLoading key={`store-loading-${i}`} />)
            : allStoresData.allStores.stores.map((store) => (
                <StoreMini store={store} key={`store-${store.id}`} />
              ))}
        </section>

        <section className="flex flex-col my-10">
          {!branchesWithProducts
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-loading-${i}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogoLoading />
                    </div>

                    <div className="overflow-x-auto py-2">
                      <div className="px-5 flex flex-row gap-5 ">
                        {Array(10)
                          .fill(0)
                          .map((_, j) => (
                            <ProductLoadingItemHorizontal
                              key={`branch-product-${i}-${j}`}
                            />
                          ))}
                      </div>
                    </div>
                  </article>
                ))
            : branchesWithProducts.branchesWithProducts.branches.map(
                (branch) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-${branch.id}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogo branch={branch as Branch} />
                    </div>

                    <div className="overflow-x-auto py-2">
                      <div className="px-5 flex flex-row gap-5 ">
                        {branch.products?.map((product) => (
                          <ProductItemHorizontal
                            product={product as Product}
                            key={`branch-product-${branch.id}-${product.id}`}
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                )
              )}
        </section>
      </section>

      {/* Mobile App Showcase */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
              See Pricetra in action
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our mobile app makes it easy to track prices, compare deals, and
              contribute to the community from anywhere.
            </p>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 [mask-image:_linear-gradient(to_right,transparent_0,_black_2em,_black_calc(100%-2em),transparent_100%)] px-24">
            {screenshots.map((props, i) => (
              <ScreenshotShowcasePanel {...props} key={`screenshot-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50">
        <div className="container mx-auto px-6 md:px-8 py-14 md:py-16">
          <h2 className="text-center text-2xl md:text-4xl font-bold text-slate-900">
            How Pricetra works
          </h2>
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((props, i) => (
              <StepsPanel step={i + 1} {...props} key={`step-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
            Start saving on your next grocery run
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Join the community that keeps prices honest and helps everyone shop
            smarter.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white px-8 py-3 font-semibold"
            >
              Create your free account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">
              © {new Date().getFullYear()} Pricetra
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-900">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
