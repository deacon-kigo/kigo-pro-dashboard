"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpire: () => void;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  redeemText: string;
  countdownMinutes: number;
  timerBackgroundColor: string;
  affiliateSlug: string;
}

export default function CountdownModal({
  isOpen,
  onClose,
  onExpire,
  title,
  subtitle,
  description,
  code,
  redeemText,
  countdownMinutes,
  timerBackgroundColor,
  affiliateSlug,
}: CountdownModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(countdownMinutes * 60);
  const [copied, setCopied] = useState(false);

  const storageKey = `timer_${affiliateSlug}_${code}`;

  useEffect(() => {
    if (!isOpen) return;

    const stored = sessionStorage.getItem(storageKey);
    let startTime: number;

    if (stored) {
      startTime = parseInt(stored, 10);
    } else {
      startTime = Date.now();
      sessionStorage.setItem(storageKey, String(startTime));
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, countdownMinutes * 60 - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdownMinutes, storageKey, onExpire]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [code]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {subtitle && (
          <div
            className="text-sm mb-2"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
        {description && (
          <div
            className="text-sm text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <div className="mb-4">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-2xl font-bold"
            style={{ backgroundColor: timerBackgroundColor }}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="text-sm text-gray-500 mt-2">{redeemText}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">Your Code</p>
          <p className="text-2xl font-bold tracking-wider">{code}</p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 bg-black text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
    </div>
  );
}
