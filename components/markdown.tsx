import { readFileSync } from "fs";
import { remark } from "remark";
import html from "remark-html";
import "@/public/markdown.scss";

export type MarkdownProps = {
  filePath: string;
};

export default async function Markdown({ filePath }: MarkdownProps) {
  const fileContent = readFileSync(filePath, "utf8");

  const processedContent = await remark().use(html).process(fileContent);
  const htmlContent = processedContent.toString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <article className="prose">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
