'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">কিছু ভুল হয়েছে!</h2>
        <p className="text-gray-600 mb-4">দয়া করে পেজটি রিফ্রেশ করুন</p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          রিফ্রেশ করুন
        </button>
      </div>
    </div>
  );
}
