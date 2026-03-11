"use client";

interface LandingHeaderProps {
  logoUrl: string;
  logoAlt: string;
}

export default function LandingHeader({
  logoUrl,
  logoAlt,
}: LandingHeaderProps) {
  if (!logoUrl) return null;

  return (
    <div className="flex flex-col items-center pt-6 pb-4">
      <img
        src={logoUrl}
        alt={logoAlt || "Logo"}
        className="h-16 w-auto object-contain"
      />
      <div className="w-full h-px bg-gray-200 mt-4" />
    </div>
  );
}
