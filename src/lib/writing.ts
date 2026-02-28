import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { Post, PostMeta } from "@/types/writing";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

function parsePostFile(filename: string): Post | null {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(WRITING_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  if (!data.title || !data.date || !data.description) {
    console.warn(
      `Post "${filename}" is missing required frontmatter fields.`
    );
    return null;
  }

  return {
    slug,
    title: data.title,
    date:
      typeof data.date === "string"
        ? data.date
        : new Date(data.date).toISOString().split("T")[0],
    description: data.description,
    tags: data.tags ?? [],
    published: data.published ?? false,
    cover: data.cover ?? undefined,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(WRITING_DIR)) return [];

  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map(parsePostFile)
    .filter((post): post is Post => post !== null)
    .filter((post) => {
      if (process.env.NODE_ENV === "production") return post.published;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts.map(({ content, ...meta }) => meta);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export async function getPostBySlug(
  slug: string
): Promise<(PostMeta & { html: string }) | null> {
  const filename = `${slug}.md`;
  const filePath = path.join(WRITING_DIR, filename);

  if (!fs.existsSync(filePath)) return null;

  const post = parsePostFile(filename);
  if (!post) return null;

  if (process.env.NODE_ENV === "production" && !post.published) return null;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(post.content);

  const { content, ...meta } = post;
  return { ...meta, html: String(result) };
}
