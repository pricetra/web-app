"use client";

import LandingHeader from "@/components/ui/landing-header";
import Feature from "./components/feature";
import Step from "./components/step";
import GoogleSearchMock from "./components/google-search-mock";
import LandingFooter from "@/components/ui/landing-footer";
import Link from "@/components/ui/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import BusinessForm from "./components/business-form";

export const G_FORM_LINK = "https://forms.gle/WTjYKPQQioGsQbWR8";

export default function BusinessPageClient() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <main className="bg-white">
      <LandingHeader />

      <Dialog
        modal
        open={openForm}
        defaultOpen={openForm}
        onOpenChange={(o) => setOpenForm(o)}
      >
        <DialogContent clickableOverlay={false} size="xl">
          <DialogHeader>
            <div className="mt-5 px-0 sm:px-3">
              <BusinessForm onCancel={() => setOpenForm(false)} />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 flex flex-row min-h-[60vh] items-center">
        <div className="text-center flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Help customers find{" "}
            <span className="text-pricetra-green-dark">Your Store.</span>{" "}
            Online.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Pricetra helps local and chain grocery stores showcase their
            products, prices, and availability online. All without building a
            website or an app.
          </p>

          <div className="mt-8 flex flex-col xs:flex-row justify-center gap-4">
            <Link
              href="/business/signup"
              className="rounded-full bg-pricetra-green-dark px-8 py-3 font-semibold text-white transition hover:bg-pricetra-green-heavy-dark"
            >
              List your store for free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full px-8 py-3 font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Learn how it works
            </a>
          </div>

          <p className="mt-5 text-xs text-gray-600">
            No upfront cost • No contracts • No risk
          </p>
        </div>

        <div></div>
      </section>

      {/* PROBLEM */}
      <section className="bg-gray-50 md:border md:border-gray-200 rounded-none md:rounded-2xl mx-auto max-w-4xl flex min-h-[30vh] flex-col items-center justify-center shadow-lg">
        <div className="max-w-3xl mx-auto py-20 px-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pricetra-green-heavy-dark">
              Customers can&apos;t buy what they can&apos;t find
            </h2>
          </div>

          <div>
            <p className="mt-6 text-gray-600 text-base sm:text-lg">
              Many shoppers default to big chains because they can see products,
              prices, and availability online — even when better local options
              exist nearby.
            </p>

            <p className="mt-2 text-gray-600 text-base sm:text-lg">
              If customers don&apos;t know what your store carries, they may
              never walk through your doors.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="h-[10vh]" />

        <h2 className="text-center text-3xl font-bold text-gray-900">
          Pricetra puts{" "}
          <i className="underline text-pricetra-green-dark">your store</i> on
          the map
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          With Pricetra, shoppers can discover your store based on location,
          browse your products, and see exact prices — all before leaving home.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3">
          <Feature
            title="Show your full catalog"
            description="Display your products, prices, and availability without building or maintaining a website."
          />
          <Feature
            title="Reach nearby shoppers"
            description="Users browse stores by location, helping hidden or overlooked stores get discovered."
          />
          <Feature
            title="Compete with big chains"
            description="When users search for a product, Pricetra shows every place they can buy it... Including yours. All sorted by distance."
          />
        </div>

        <div className="h-[10vh]" />
      </section>

      {/* SEO SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-pricetra-green-heavy-dark">
              Built for search. Built for visibility.
            </h2>

            <p className="mt-6 text-gray-600 text-lg">
              Pricetra uses best-in-class SEO so when shoppers search for
              products like “milk near me” or “olive oil in Batavia,” Google can
              surface:
            </p>

            <div className="mt-3 space-y-3 text-gray-600 pl-10">
              <ul className="list-disc">
                <li>Your store&apos;s location</li>
                <li>Exact product prices</li>
                <li>Sales and promotions</li>
                <li>Availability at your branch</li>
              </ul>
            </div>

            <p className="mt-6 text-gray-600 text-lg">
              All clearly labeled — and all pointing customers directly to you.
            </p>
          </div>

          <div>
            <GoogleSearchMock storeName="Local Grocers" city="near you" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Getting started is easy
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step
            number="1"
            title="Create a store"
            description="Sign up and add your store location in minutes."
          />
          <Step
            number="2"
            title="Add products"
            description="Use our platform to add products, prices, and stock."
          />
          <Step
            number="3"
            title="Go live instantly"
            description="Your store becomes searchable immediately."
          />
          <Step
            number="4"
            title="Get discovered"
            description="Customers find you through Pricetra and Google."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-200 py-20 text-center px-5">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Join Pricetra and grow your visibility
        </h2>

        <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto text-gray-700">
          Help shoppers discover your store, compare prices, and choose local —
          all at no upfront cost.
        </p>

        <div className="mt-8">
          <button
            onClick={() => {
              setOpenForm(true);
            }}
            className="inline-flex rounded-full bg-pricetra-green-logo/20 px-8 py-3 font-semibold text-pricetra-green-heavy-dark transition hover:bg-pricetra-green-logo/30 cursor-pointer"
          >
            List your store for free
          </button>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
