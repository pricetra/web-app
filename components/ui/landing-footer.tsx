import Link from "next/link";

export default function LandingFooter() {
  return (
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
  );
}
