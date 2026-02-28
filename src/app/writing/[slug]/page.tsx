import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { getPostBySlug, getAllPostSlugs } from "@/lib/writing";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: `${post.title} | Daniel Chung`,
    description: post.description,
    ...(post.cover && {
      openGraph: {
        images: [{ url: post.cover }],
      },
    }),
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px] flex flex-col">
      <Link href="/writing">
        <IconButton icon={ArrowLeft} />
      </Link>

      <article className="mt-[60px]">
        <header>
          <h1 className="text-h1 text-content-primary">{post.title}</h1>
          <time className="block mt-3 text-h3 text-content-muted">
            {formatDate(post.date)}
          </time>
          {post.cover && (
            <Image
              src={post.cover}
              alt={post.title}
              width={660}
              height={371}
              className="w-full rounded-lg mt-8"
            />
          )}
        </header>

        <div
          className="prose mt-[40px]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}
