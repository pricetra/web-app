import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-slate-50">
      {/* Header */}
      <header className="w-full">
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
              className="text-slate-700 hover:text-pricetraGreenHeavyDark hover:bg-pricetraGreenLogo/10 px-3 md:px-4 font-bold"
            >
              Login
            </Button>
            <Button className="bg-pricetraGreenDark hover:bg-pricetraGreenHeavyDark text-white px-4 md:px-6 py-2 font-medium rounded-lg shadow-sm hover:shadow-md transition-all font-bold">
              Create Account
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-pricetraGreenLogo/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-12 w-72 h-72 bg-pricetraGreenDark/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Beat Inflation. <span className="">Track Prices.</span>{" "}
              <span className="text-pricetraGreenDark">Save Money.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Pricetra is a community-powered price tracking app that helps
              shoppers discover the best deals nearby. Compare costs per unit,
              watch your favorites, and get notified when prices drop.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-pricetraGreenDark hover:bg-pricetraGreenHeavyDark text-white px-6 md:px-8 py-3 text-base md:text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Start for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-6 md:px-8 py-3 text-base"
              >
                Learn More
              </Button>
            </div>
            <p className="mt-3 text-xs md:text-sm text-slate-500">
              No credit card required • Free forever
            </p>
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
              <div className="text-sm font-semibold text-pricetraGreenHeavyDark">
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
              <div className="text-sm font-semibold text-pricetraGreenHeavyDark">
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
              <div className="text-sm font-semibold text-pricetraGreenHeavyDark">
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
              <div className="text-sm font-semibold text-pricetraGreenHeavyDark">
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
              className="bg-pricetraGreenDark hover:bg-pricetraGreenHeavyDark text-white px-8 py-3 font-semibold"
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
