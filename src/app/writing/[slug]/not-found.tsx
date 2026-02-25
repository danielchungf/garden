import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-h1 text-content-primary mb-4">Post not found</h1>
      <p className="text-body-regular text-content-secondary mb-8">
        The post you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/writing"
        className="text-body-regular text-content-accent hover:underline"
      >
        Back to writing
      </Link>
    </main>
  );
}
