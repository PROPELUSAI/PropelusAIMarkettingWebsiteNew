import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center section-light">
      <div className="container-main text-center max-w-md">
        <div className="text-7xl font-light text-surface-200 mb-4">404</div>
        <h1 className="text-2xl font-medium mb-3">Page Not Found</h1>
        <p className="text-surface-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary justify-center">Back to Home</Link>
          <Link href="/contact" className="btn-secondary justify-center">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
