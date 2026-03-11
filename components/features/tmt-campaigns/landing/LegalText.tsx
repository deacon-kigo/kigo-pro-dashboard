"use client";

interface LegalTextProps {
  text: string;
}

export default function LegalText({ text }: LegalTextProps) {
  if (!text) return null;

  return (
    <div
      className="text-[10px] text-gray-500 text-center px-6 leading-tight"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
