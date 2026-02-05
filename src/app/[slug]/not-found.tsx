import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-h1 text-content-primary mb-4">Project not found</h1>
      <p className="text-body-regular text-content-secondary mb-8">
        The project you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-body-regular text-content-accent hover:underline"
      >
        Back to home
      </Link>
    </main>
  );
}
