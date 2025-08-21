import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
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
      <section className="relative container mx-auto">
        <div className="container mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Beat Inflation. <span>Track Prices.</span>{" "}
                <span className="text-pricetra-green-dark">Save Money.</span>
              </h1>
            </div>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
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
        <div className="absolute bottom-0 right-0 -z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pricetra-green-logo/20 to-pricetra-green-dark/20 rounded-3xl blur-xl transform rotate-6 scale-110"></div>
            <div className="relative rounded-3xl p-2 shadow-2xl transform rotate-6">
              <Image
                src="/screenshots/homepage-main-screenshot.PNG"
                alt="Pricetra Mobile App"
                width={280}
                height={560}
                className="sm:w-40 md:w-56 lg:w-60 h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
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

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4">
            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/homepage-category-milk-screenshot.PNG"
                  alt="Pricetra Homepage"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg bg-white"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Browse Products
              </h3>
              <p className="text-sm text-slate-600">
                Discover products and see current prices at stores near you
              </p>
            </div>

            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/product-page-screenshot.PNG"
                  alt="Product Details"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg bg-white"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Product Details
              </h3>
              <p className="text-sm text-slate-600">
                View detailed product information and price history
              </p>
            </div>

            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/add-product-price-screenshot.PNG"
                  alt="Add Price"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg bg-white"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Report Prices
              </h3>
              <p className="text-sm text-slate-600">
                Contribute to the community by reporting current prices
              </p>
            </div>

            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/product-page-nearby-prices-screenshot.PNG"
                  alt="Nearby Prices"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg bg-white"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Compare Prices
              </h3>
              <p className="text-sm text-slate-600">
                See prices across different stores to find the best deals
              </p>
            </div>

            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/store-branch-products-scrrenshot.PNG"
                  alt="Store Products"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg bg-white"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Store View</h3>
              <p className="text-sm text-slate-600">
                Browse all products available at specific store branches
              </p>
            </div>

            <div className="flex-shrink-0 snap-center w-80">
              <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Image
                  src="/screenshots/scan-product-screenshot.PNG"
                  alt="Scan Product"
                  width={300}
                  height={600}
                  className="w-full max-w-[280px] mx-auto rounded-xl shadow-lg"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Quick Scan</h3>
              <p className="text-sm text-slate-600">
                Scan barcodes to quickly find and report product prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 py-14 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
              Everything you need to shop smarter
            </h2>
            <p className="mt-3 text-slate-600">
              Powered by community data, geolocation validation, and smart
              notifications.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">🧑‍🤝‍🧑</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Crowdsourced price tracking
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Browse and report grocery and health product prices at local
                store branches to keep data fresh.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">📍</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Geolocation-powered accuracy
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Only submit prices within ~500 meters of a store branch for
                trustworthy, verified updates.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">📊</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Smart product insights
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Products include unit counts (like “12 eggs” or “126 loads”) to
                compare true price per unit.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">🔔</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Watchlist & notifications
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Watch products or store branches and get alerts when prices
                change or sales occur.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">🧪</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Community-driven validation
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Algorithmic checks catch outliers while the community helps
                verify and improve accuracy.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl">🛡️</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                Secure accounts & data
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Passwords hashed with bcrypt; auth uses JWT over HTTPS. Location
                stored only with consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50">
        <div className="container mx-auto px-6 md:px-8 py-14 md:py-16">
          <h2 className="text-center text-2xl md:text-4xl font-bold text-slate-900">
            How Pricetra works
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-pricetra-green-dark">
                Step 1
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">
                Find products and stores
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Search products near you and browse branches to see current
                prices and trends.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-pricetra-green-dark">
                Step 2
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">
                Scan and Search prices
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Finding prices for a product is as simple as scanning the
                barcode. Scan and find prices and sales in nearby stores.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-pricetra-green-dark">
                Step 3
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">
                Report accurate prices
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Visit a store and submit a price within ~500 meters. Unit counts
                help normalize costs.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-pricetra-green-dark">
                Step 4
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">
                Watch and get alerts
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Add items or branches to your watchlist and get notified when
                prices change.
              </p>
            </div>
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
