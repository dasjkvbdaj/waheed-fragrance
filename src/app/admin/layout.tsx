import Header from '@/components/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin area doesn't display the public footer and needs some top spacing beneath the fixed header
  // NOTE: avoid emitting <html> / <body> here — the root layout already provides them.
  return (
    <div className="min-h-screen pt-28 bg-primary-darker pb-8">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
