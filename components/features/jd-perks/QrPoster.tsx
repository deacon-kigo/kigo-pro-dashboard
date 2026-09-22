"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/atoms/Button";
import {
  ArrowDownTrayIcon,
  PrinterIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { computeQrModules } from "./qrcodegen";
import { formatDate } from "./utils";

interface QrPosterProps {
  /** The URL the QR code encodes. */
  url: string;
  /** Campaign name shown on the printable poster. */
  campaignName: string;
  /** Offer headline, e.g. "$50 off Gator™ accessories". */
  offerTitle: string;
  /** Promotion expiration (ISO date) baked into the printable output. */
  expirationIso: string;
}

const JD_GREEN = "#367C2B";
const QUIET = 4; // modules of quiet zone

/**
 * A scannable QR code for a campaign activation, captioned with the offer
 * headline and expiration date, rendered so a dealer can print it for in-store
 * signage, counters, or flyers.
 */
export default function QrPoster({
  url,
  campaignName,
  offerTitle,
  expirationIso,
}: QrPosterProps) {
  const modules = useMemo(() => computeQrModules(url), [url]);
  const n = modules.length;
  const dim = n + QUIET * 2; // in modules, including quiet zone
  const expiresLabel = `Offer expires ${formatDate(expirationIso)}`;

  // Caption band (in module units) baked directly into the image so the offer
  // and expiration date travel with the QR even if only the graphic is printed
  // or screenshotted without the surrounding page text.
  const CAP = 12;
  const totalH = dim + CAP;

  // Build the SVG dark-module path once.
  const pathData = useMemo(() => {
    let d = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (modules[y][x]) {
          d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
        }
      }
    }
    return d;
  }, [modules, n]);

  /** Render the poster onto a canvas for print / PNG export. */
  const renderCanvas = async (): Promise<HTMLCanvasElement> => {
    const px = Math.max(6, Math.floor(720 / dim)); // module size in px
    const qrPx = dim * px;
    const pad = px * 2;
    const footer = px * 15;
    const W = qrPx + pad * 2;
    const H = qrPx + pad + footer;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Modules
    ctx.fillStyle = "#000000";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (modules[y][x]) {
          ctx.fillRect(pad + (x + QUIET) * px, pad + (y + QUIET) * px, px, px);
        }
      }
    }

    // Footer text
    const cx = W / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = JD_GREEN;
    ctx.font = `700 ${px * 3.2}px Inter, Arial, sans-serif`;
    ctx.fillText("Scan to redeem", cx, qrPx + pad + px * 4.5);
    ctx.fillStyle = "#111827";
    ctx.font = `700 ${px * 2.6}px Inter, Arial, sans-serif`;
    ctx.fillText(offerTitle, cx, qrPx + pad + px * 8.2);
    ctx.fillStyle = "#374151";
    ctx.font = `500 ${px * 2.1}px Inter, Arial, sans-serif`;
    ctx.fillText(campaignName, cx, qrPx + pad + px * 11.2);
    ctx.fillStyle = "#6b7280";
    ctx.font = `500 ${px * 2}px Inter, Arial, sans-serif`;
    ctx.fillText(expiresLabel, cx, qrPx + pad + px * 14);

    return canvas;
  };

  const handleDownload = async () => {
    const canvas = await renderCanvas();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "campaign-qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const handlePrint = async () => {
    const canvas = await renderCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><title>${campaignName} — QR</title>` +
        `<style>@page{margin:16mm}body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh}img{max-width:100%;height:auto}</style>` +
        `</head><body><img src="${dataUrl}" onload="window.focus();window.print();" /></body></html>`
    );
    w.document.close();
  };

  return (
    <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text-dark">
        <QrCodeIcon className="h-4 w-4" /> Printable QR code
      </h3>
      <p className="mt-0.5 text-xs text-text-muted">
        Print for in-store signage, counters, and flyers. Includes the offer and
        its expiration date.
      </p>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="rounded-md border border-border-light p-3">
          <svg
            viewBox={`0 0 ${dim} ${totalH}`}
            width={220}
            height={(220 * totalH) / dim}
            role="img"
            aria-label={`QR code for ${campaignName}. ${offerTitle}. ${expiresLabel}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={dim} height={totalH} fill="#ffffff" />
            <g shapeRendering="crispEdges">
              <path d={pathData} fill="#000000" />
            </g>
            {/* Caption baked into the image (offer + expiration travel with the code) */}
            <text
              x={dim / 2}
              y={dim + 2.8}
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize={2.3}
              fontWeight={700}
              fill={JD_GREEN}
            >
              Scan to redeem
            </text>
            <text
              x={dim / 2}
              y={dim + 6}
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize={2.1}
              fontWeight={700}
              fill="#111827"
            >
              {offerTitle}
            </text>
            <text
              x={dim / 2}
              y={dim + 8.8}
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize={1.8}
              fontWeight={500}
              fill="#374151"
            >
              {campaignName}
            </text>
            <text
              x={dim / 2}
              y={dim + 11.4}
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize={1.8}
              fontWeight={500}
              fill="#6b7280"
            >
              {expiresLabel}
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          icon={<PrinterIcon className="h-4 w-4" />}
          onClick={handlePrint}
        >
          Print
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          icon={<ArrowDownTrayIcon className="h-4 w-4" />}
          onClick={handleDownload}
        >
          Download PNG
        </Button>
      </div>
    </div>
  );
}
