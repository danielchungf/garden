import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const LEXICON_PATH = path.join(
  process.cwd(),
  "content",
  "lexicon",
  "eng-lexicon.md"
);

export interface LexiconHeading {
  id: string;
  title: string;
}

export async function getLexicon(): Promise<{
  html: string;
  headings: LexiconHeading[];
} | null> {
  if (!fs.existsSync(LEXICON_PATH)) return null;

  const fileContent = fs.readFileSync(LEXICON_PATH, "utf-8");

  // Extract h3 headings from the markdown (### Term Name)
  const headings: LexiconHeading[] = [];
  const headingRegex = /^###\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(fileContent)) !== null) {
    const title = match[1].trim();
    // Generate the same slug that rehype-slug produces
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, title });
  }

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(fileContent);

  return { html: String(result), headings };
}
