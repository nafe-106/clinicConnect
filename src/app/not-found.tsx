import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">৪০৪</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">পেজ পাওয়া যায়নি</h2>
        <p className="text-gray-600 mb-6">আপনি যে পেজটি খুঁজছেন সেটি নেই</p>
        <Link href="/" className="btn-primary">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
