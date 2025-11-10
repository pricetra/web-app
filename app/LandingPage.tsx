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
  IpToAddressDocument,
  Product,
} from "@/graphql/types/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import StoreMini, {
  StoreMiniLoading,
  StoreMiniShowMore,
} from "@/components/StoreMini";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/BranchItemWithLogo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/ProductItemHorizontal";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

export default function LandingPage({ ipAddress }: { ipAddress: string }) {
  const { data: ipToAddressData } = useQuery(IpToAddressDocument, {
    fetchPolicy: "cache-first",
    variables: {
      ipAddress,
    },
  });
  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: "cache-first",
    variables: {
      paginator: { page: 1, limit: 9 },
    },
  });
  const [getBranchProducts, { data: branchesWithProducts }] = useLazyQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  useEffect(() => {
    if (!ipToAddressData) return;
    getBranchProducts({
      variables: {
        paginator: { page: 1, limit: 3 },
        productLimit: 10,
        filters: {
          location: {
            latitude: ipToAddressData.ipToAddress.latitude,
            longitude: ipToAddressData.ipToAddress.longitude,
            radiusMeters: 100_000,
          },
        },
      },
    });
  }, [getBranchProducts, ipToAddressData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="w-full z-10">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-8 py-7 md:py-10">
          <Image
            src="/logotype_header_black.svg"
            alt="Pricetra"
            width={210}
            height={40}
            className="h-[23px] sm:h-[30px] block w-auto color-white"
            priority
          />

          <div className="flex items-center gap-3">
            <Link
              href="login"
              className="text-slate-700 hover:text-pricetra-green-dark hover:bg-pricetra-green-logo/10 md:px-4 font-bold rounded-lg py-2 px-5 text-sm"
            >
              Login
            </Link>
            <Link
              href="signup"
              className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white md:px-6 rounded-lg shadow-sm hover:shadow-md transition-all font-bold hidden sm:block py-2 px-5 text-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container mx-auto flex flex-row gap-5 justify-between items-center py-6 md:py-10">
        <div className="px-6 md:px-8 py-12 md:py-20 flex-1">
          <div className="text-center relative z-10" data-aos="fade-down">
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
          <div
            className="relative rounded-4xl p-2 shadow-2xl transform rotate-6 bg-gray-100"
            data-aos="fade-up"
          >
            <Image
              src="https://res.cloudinary.com/pricetra-cdn/image/upload/homepage-main-screenshot.png"
              alt="Pricetra Mobile App"
              width={280}
              height={560}
              quality={100}
              className="md:w-52 lg:w-60 xl:w-64 h-auto rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="relative w-full max-w-[1000px] mx-auto mt-5 mb-16">
        <section className="grid grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-5 sm:gap-5 px-5 mb-10">
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

                    <div className="flex flex-row gap-5 overflow-x-auto py-2.5">
                      {Array(10)
                        .fill(0)
                        .map((_, j) => (
                          <div
                            className="first:pl-5 last:pr-5"
                            key={`branch-product-${i}-${j}`}
                          >
                            <ProductLoadingItemHorizontal />
                          </div>
                        ))}
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

                    <div className="flex flex-row gap-5 overflow-x-auto py-2.5 lg:px-2.5 lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_2em,_black_calc(100%-2em),transparent_100%)]">
                      {(branch.products ?? []).map((product) => (
                        <div
                          className="first:pl-5 last:pr-5"
                          key={`branch-product-${branch.id}-${product.id}`}
                        >
                          <ProductItemHorizontal product={product as Product} />
                        </div>
                      ))}
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
