import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const LEXICON_PATH = path.join(
  process.cwd(),
  "content",
  "lexicon",
  "eng-lexicon.md"
);

export async function getLexicon(): Promise<{ html: string } | null> {
  if (!fs.existsSync(LEXICON_PATH)) return null;

  const fileContent = fs.readFileSync(LEXICON_PATH, "utf-8");

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(fileContent);

  return { html: String(result) };
}
