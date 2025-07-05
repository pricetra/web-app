import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header with Logo and Auth Buttons */}
      <header className="w-full p-6 md:p-8">
        <div className="container mx-auto flex items-center justify-between">
          <Image
            src="/logotype_header.svg"
            alt="Pricetra"
            width={207.4}
            height={40}
            className="sm:h-[35px] hidden sm:block w-auto color-white"
            priority
          />

          <Image
            src="/logo_white_color_dark_leaf.svg"
            alt="Pricetra"
            width={207.4}
            height={40}
            className="h-[35px] block sm:hidden w-auto color-white"
            priority
          />

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-[#9fe342] hover:bg-white/10 px-4 py-2"
            >
              Login
            </Button>
            <Button className="bg-[#5fae23] hover:bg-[#396a12] text-white px-6 py-2 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Create Account
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
            Beat Inflation.&nbsp;
            <span className="text-[#9fe342]">Track Prices.</span>&nbsp;
            <span className="text-[#5fae23]">Save Money.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Monitor price changes across thousands of products and never overpay
            again. Get alerts when prices drop and make smarter purchasing
            decisions.
          </p>

          <Button
            size="lg"
            className="bg-[#5fae23] hover:bg-[#396a12] text-white px-8 py-4 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start for Free
          </Button>

          <p className="text-slate-400 mt-4 text-sm md:text-base">
            No credit card required • Free forever
          </p>
        </div>
      </main>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
