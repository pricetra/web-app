"use client";

import LandingHeader from "@/components/ui/landing-header";
import Feature from "./components/feature";
import Step from "./components/step";
import GoogleSearchMock from "./components/google-search-mock";
import LandingFooter from "@/components/ui/landing-footer";

export default function BusinessPageClient() {
  return (
    <main className="bg-white">
      <LandingHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 flex flex-row min-h-[60vh] items-center">
        <div className="text-center flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Help customers find <span className="text-pricetra-green-dark">Your Store.</span> Online.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Pricetra helps local and chain grocery stores showcase their
            products, prices, and availability online — without building a
            website or app.
          </p>

          <div className="mt-8 flex flex-col xs:flex-row justify-center gap-4">
            <a
              href="/business/signup"
              className="rounded-full bg-pricetra-green-dark px-8 py-3 font-semibold text-white transition hover:bg-pricetra-green-heavy-dark"
            >
              List your store for free
            </a>
            <a
              href="#how-it-works"
              className="rounded-full px-8 py-3 font-semibold text-pricetra-green-dark hover:text-pricetra-green-heavy-dark"
            >
              Learn how it works
            </a>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            No upfront cost • No contracts • No risk
          </p>
        </div>

        <div></div>
      </section>

      {/* PROBLEM */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Customers can&apos;t buy what they can&apos;t find
            </h2>
          </div>

          <div>
            <p className="mt-6 text-gray-600 text-lg">
              Many shoppers default to big chains because they can see products,
              prices, and availability online — even when better local options
              exist nearby.
            </p>

            <p className="mt-4 text-gray-600 text-lg">
              If customers don&apos;t know what your store carries, they may
              never walk through your doors.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Pricetra puts your store on the map
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          With Pricetra, shoppers can discover your store based on location,
          browse your products, and see exact prices — all before leaving home.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
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
            description="When users search for a product, Pricetra shows every place they can buy it — including you."
          />
        </div>
      </section>

      {/* SEO SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Built for search. Built for visibility.
            </h2>

            <p className="mt-6 text-gray-600 text-lg">
              Pricetra uses best-in-class SEO so when shoppers search for
              products like “milk near me” or “olive oil in Batavia,” Google can
              surface:
            </p>

            <div className="mt-6 space-y-3 text-gray-600 pl-5">
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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step
            number="1"
            title="Create a store"
            description="Sign up and add your store location in minutes."
          />
          <Step
            number="2"
            title="Add products"
            description="Use our app to add products, prices, and stock."
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
          <a
            href="/business/signup"
            className="inline-flex rounded-full bg-pricetra-green-logo/20 px-8 py-3 font-semibold text-pricetra-green-heavy-dark transition hover:bg-pricetra-green-logo/30"
          >
            List your store for free
          </a>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
