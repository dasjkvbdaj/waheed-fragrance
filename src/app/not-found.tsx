export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center pt-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <a
          href="/"
          className="inline-block bg-accent-gold text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
