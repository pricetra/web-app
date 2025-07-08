import { readFileSync } from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import '@/public/markdown.scss'
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-static"; // Ensures this route is pre-rendered at build time

export const metadata: Metadata = {
  title: "Privacy - Pricetra",
  description: "Pricetra privacy policy",
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "app", "privacy", "privacy.md");
  const fileContent = readFileSync(filePath, "utf8");

  const processedContent = await remark().use(html).process(fileContent);
  const htmlContent = processedContent.toString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-center mb-16">
        <Link href="/">
          <Image
            src="/logotype_header_black.svg"
            alt="Pricetra"
            width={207.4}
            height={40}
            className="sm:h-[40px] hidden sm:block w-auto color-white"
            priority
          />
        </Link>
      </div>

      <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
