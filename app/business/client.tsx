"use client";

import LandingHeader from "@/components/ui/landing-header";
import LandingFooter from "@/components/ui/landing-footer";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import BusinessForm from "./components/business-form";
import GoogleSearchMock from "./components/google-search-mock";
import Step from "./components/step";
import { BiSolidBadgeDollar, BiSolidBinoculars } from "react-icons/bi";
import { PiSparkleBold } from "react-icons/pi";
import { GrCatalog } from "react-icons/gr";
import { FaShop } from "react-icons/fa6";
import { TbPlugConnected } from "react-icons/tb";
import Image from 'next/image';

export const G_FORM_LINK = "https://forms.gle/WTjYKPQQioGsQbWR8";

function FeatureCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
      <div className="flex items-start gap-4">
        <div className="shrink-0">{children}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow">
      <h4 className="text-lg font-semibold">Store Analytics (Example)</h4>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Product views</div>
          <div className="text-2xl font-bold">12.4k</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Store views</div>
          <div className="text-2xl font-bold">8.9k</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Flyer views</div>
          <div className="text-2xl font-bold">3.2k</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Promotion clicks</div>
          <div className="text-2xl font-bold">1.1k</div>
        </div>
      </div>
    </div>
  );
}

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
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Put Your Store In Front Of Shoppers Ready To Buy
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-3xl">
              Pricetra helps retailers showcase products, prices, promotions,
              inventory, and store information across web and mobile. All
              without building a website or mobile app.
            </p>

            <div className="mt-8 flex flex-col xs:flex-row gap-4">
              <button
                onClick={() => setOpenForm(true)}
                className="rounded-full bg-pricetra-green-dark px-6 py-3 font-semibold text-white shadow hover:opacity-95 cursor-pointer"
              >
                List Your Store For Free
              </button>
              <a
                href="#why"
                className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 text-center"
              >
                Learn more
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              No setup fees • No contracts • Get discovered immediately
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-md">
              <Image src="/business/storefront.png" width={10000} height={10000} quality={100} alt="storefront" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-5xl px-0 sm:px-6 py-12" id="why">
        <div className="rounded-none sm:rounded-2xl bg-gradient-to-tl from-green-200 to-pricetra-green-logo/50 py-10 px-8 sm:px-12 sm:shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-5">
            Customers {`Can't`} Buy What They {`Can't`} Find
          </h2>
          <p className="mt-4 text-gray-800">
            Many local retailers lose customers simply because shoppers cannot
            see what they carry before visiting. Large retailers invest heavily
            in websites, apps, and online catalogs. Smaller businesses often
            have no digital storefront at all.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
            <ul className="list-disc pl-5">
              <li>Products remain undiscovered</li>
              <li>Promotions go unseen</li>
              <li>Stores lose foot traffic</li>
            </ul>
            <div>
              Pricetra helps level the playing field by providing discovery,
              product visibility, and easy storefront management.
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Everything You Need To Run Your Digital Storefront
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          Manage locations, products, prices, promotions, flyers, and more. All
          in one place.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Multiple Store Locations"
            desc="Create and manage unlimited physical or online locations."
          >
            <FaShop className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>

          <FeatureCard
            title="Product Catalog Management"
            desc="Create a searchable catalog of products with images, descriptions, and categories."
          >
            <GrCatalog className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>

          <FeatureCard
            title="Price Management"
            desc="Manage current, unit, and location-specific pricing with bulk updates."
          >
            <BiSolidBadgeDollar className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>

          <FeatureCard
            title="Promotions & Sales"
            desc="Create sale pricing, percentage discounts, and time-limited promotions."
          >
            <PiSparkleBold className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>

          <FeatureCard
            title="Inventory Visibility"
            desc="Show where products are available across branches and locations."
          >
            <BiSolidBinoculars className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>

          <FeatureCard
            title="Online Store Linking"
            desc="Connect products directly to your website to drive online sales."
          >
            <TbPlugConnected className="w-8 h-8 text-pricetra-green-dark" />
          </FeatureCard>
        </div>
      </section>

      {/* INTERACTIVE STOREFRONT */}
      <section className="mx-auto max-w-7xl px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Your Own Storefront On Pricetra
            </h2>
            <p className="mt-4 text-gray-600">
              Every business receives a dedicated storefront where shoppers can
              browse products, promotions, prices, categories, and locations.
              Think of it as a mini website provided by Pricetra.
            </p>

            <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2">
              <li>Store logo and description</li>
              <li>Featured products and promotional banners</li>
              <li>Branch locations and availability</li>
            </ul>
          </div>

          <div>
            <div className="rounded-2xl bg-white border overflow-hidden shadow inline-block float-right">
              <Image src="/business/store-with-prices.png" className="w-full max-w-80" width={1000} height={1000} quality={100} alt="storefront" />
            </div>
          </div>
        </div>
      </section>

      {/* BANNERS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="text-2xl font-bold text-center">
          Highlight Promotions With Store Banners
        </h3>
        <p className="mt-3 text-center text-gray-600">
          Create eye-catching promotional banners that appear directly on your
          storefront.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-yellow-50 to-white p-6 border">
            Weekly specials • Save up to 20%
          </div>
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-pink-50 to-white p-6 border">
            Seasonal produce • Fresh arrivals
          </div>
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-white p-6 border">
            New in store • Local brands
          </div>
        </div>
      </section>

      {/* FLYER BUILDER */}
      <section className="mx-auto max-w-7xl px-6 py-20 bg-pricetra-green-dark/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Create Interactive Digital Flyers
            </h2>
            <p className="mt-4 text-gray-700">
              Design and publish fully interactive flyers that customers can
              browse online, and share.
            </p>

            <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2">
              <li>Drag and drop flyer builder with multiple pages</li>
              <li>Export as PNG/JPEG, share on social, or print</li>
              <li>Click products in flyers to view details or save to lists</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button
                className="rounded-full bg-pricetra-green-dark px-5 py-2 text-white font-semibold cursor-pointer"
                onClick={() => setOpenForm(true)}
              >
                List Your Store
              </button>
              <a
                className="rounded-full border px-5 py-2 text-gray-700"
                href="#"
              >
                See Flyer Examples
              </a>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white border p-4 shadow">
              <div className="h-56 bg-gray-100 rounded" />
              <div className="mt-3 text-sm text-gray-500">
                Interactive flyer preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & DISCOVERY */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Built For Search. Built For Discovery.
          </h2>
          <p className="mt-4 text-gray-600">
            When shoppers search for products near them, Pricetra surfaces store
            locations, products, prices, promotions, and flyers, driving
            organic local traffic to your business.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <ul className="list-disc pl-5 text-gray-700">
              <li>Increases visibility in local search</li>
              <ul className="list-disc list-inside pl-5 text-gray-700">
                <h5 className="font-semibold italic">Search examples:</h5>
                <li>“Milk near me”</li>
                <li>“Olive oil in Batavia”</li>
                <li>“Laundry detergent deals”</li>
                <li>Pricetra matches product intent to nearby stores</li>
              </ul>
              <li>Improves organic traffic for product queries</li>
              <li>Surfaces promotions and sales directly in search</li>
            </ul>

            <div className="order-first sm:order-last">
              <GoogleSearchMock storeName="Local Grocers" city="near you" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY BUSINESSES JOIN */}
      <section className="mx-auto max-w-7xl px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-2xl font-bold">Why Businesses Join Pricetra</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-gray-700">
              <li>✓ Reach nearby shoppers</li>
              <li>✓ Compete with larger retailers</li>
              <li>✓ Showcase promotions</li>
              <li>✓ Manage multiple locations</li>
              <li>✓ Publish interactive flyers</li>
              <li>✓ Improve local visibility</li>
              <li>✓ Display real-time prices</li>
              <li>✓ Drive traffic to your website</li>
            </ul>
          </div>

          <div>
            <AnalyticsCard />
          </div>
        </div>
      </section>

      {/* GETTING STARTED */}
      <section className="mx-auto max-w-7xl px-6 py-20 mb-16">
        <h3 className="text-3xl font-bold text-center mb-16">
          Getting started is easy
        </h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Step
            number="1"
            title="Create your store"
            description="Sign up and add your store location in minutes."
          />
          <Step
            number="2"
            title="Add locations and products"
            description="Use our platform to add branches, products, prices, and stock."
          />
          <Step
            number="3"
            title="Publish prices and promotions"
            description="Create your inventory, add promotions, and prices."
          />
          <Step
            number="4"
            title="Get discovered"
            description="Your store becomes searchable immediately."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center bg-pricetra-green-dark/5 rounded-t-2xl">
        <h2 className="text-3xl font-bold">
          Turn Product Searches Into Store Visits
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Join Pricetra and help shoppers discover your products, promotions,
          and locations before they shop.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setOpenForm(true)}
            className="rounded-full bg-pricetra-green-dark px-6 py-3 text-white font-semibold cursor-pointer"
          >
            List Your Store For Free
          </button>
          <a
            href="mailto:hello@pricetra.com"
            className="rounded-full border px-6 py-3 text-gray-700"
          >
            Contact Sales
          </a>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
