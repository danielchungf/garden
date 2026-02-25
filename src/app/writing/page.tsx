import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { getAllPosts } from "@/lib/writing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing | Daniel Chung",
  description: "Thoughts on design, engineering, and building products.",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px] flex flex-col">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px]">
        <h1 className="text-hero text-content-primary">Writing</h1>
        <p className="mt-3 text-body-regular text-content-tertiary">
          Thoughts on design, engineering, and building products.
        </p>
      </div>

      <div className="mt-[60px] flex flex-col">
        {posts.length === 0 ? (
          <p className="text-body-regular text-content-tertiary">
            No posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group py-4 border-b border-muted first:border-t"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-h2 text-content-primary group-hover:text-content-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-body-regular text-content-tertiary line-clamp-2">
                  {post.description}
                </p>
                <time className="text-h3 text-content-muted mt-1">
                  {formatDate(post.date)}
                </time>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
