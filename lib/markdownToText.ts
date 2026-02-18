import { unified } from "unified";
import remarkParse from "remark-parse";
import strip from "strip-markdown";

export async function markdownToText(markdown: string): Promise<string> {
  if (!markdown) return "";
  const file = await unified()
    .use(remarkParse)
    .use(strip)
    .process(markdown);

  return String(file).replace(/\s+/g, " ").trim();
}
