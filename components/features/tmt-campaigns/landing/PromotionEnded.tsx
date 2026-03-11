"use client";

export default function PromotionEnded() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Promotion Unavailable
        </h1>
        <p className="text-gray-600">
          This promotion has ended or is no longer available.
        </p>
      </div>
    </div>
  );
}
