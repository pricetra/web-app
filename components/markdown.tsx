import { readFileSync } from "fs";
import { remark } from "remark";
import html from "remark-html";
import "@/public/markdown.scss";
import Image from "next/image";
import Link from "next/link";

export type MarkdownProps = {
  filePath: string;
};

export default async function Markdown({ filePath }: MarkdownProps) {
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
            className="h-[25px] xs:h-[30px] w-auto color-white"
            priority
          />
        </Link>
      </div>

      <article className="prose">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
