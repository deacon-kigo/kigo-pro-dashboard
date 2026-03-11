"use client";

interface LandingHeroProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  secondaryDescription?: string;
}

export default function LandingHero({
  title,
  description,
  imageUrl,
  imageAlt,
  secondaryDescription,
}: LandingHeroProps) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      {description && (
        <div
          className="text-sm text-gray-600 mb-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt || "Product"}
          className="w-64 h-auto object-contain mb-4"
        />
      )}
      {secondaryDescription && (
        <div
          className="text-xs text-gray-600 mb-6"
          dangerouslySetInnerHTML={{ __html: secondaryDescription }}
        />
      )}
    </div>
  );
}
