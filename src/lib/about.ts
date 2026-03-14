import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const ABOUT_PATH = path.join(
  process.cwd(),
  "content",
  "about",
  "onigiri.md"
);

export async function getAbout(): Promise<string | null> {
  if (!fs.existsSync(ABOUT_PATH)) return null;

  const fileContent = fs.readFileSync(ABOUT_PATH, "utf-8");

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(fileContent);

  return String(result);
}
