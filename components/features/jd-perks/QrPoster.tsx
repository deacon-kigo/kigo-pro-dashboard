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
  /** Promotion expiration (ISO date) baked into the printable output. */
  expirationIso: string;
  /** Same-origin John Deere logo overlaid in the QR center. */
  logoSrc?: string;
}

const JD_GREEN = "#367C2B";
const QUIET = 4; // modules of quiet zone

/**
 * A scannable QR code for a campaign activation with the John Deere logo in the
 * center and the promotion's expiration date, rendered so a dealer can print it
 * for in-store signage, counters, or flyers. Uses QUARTILE error correction so
 * the center logo overlay does not stop the code from scanning.
 */
export default function QrPoster({
  url,
  campaignName,
  expirationIso,
  logoSrc = "/logos/john-deere.svg",
}: QrPosterProps) {
  const modules = useMemo(() => computeQrModules(url), [url]);
  const n = modules.length;
  const dim = n + QUIET * 2; // in modules, including quiet zone
  const expiresLabel = `Offer expires ${formatDate(expirationIso)}`;

  // Center logo footprint (in modules). QUARTILE ECC tolerates ~25% loss.
  const logoModules = Math.round(n * 0.26);
  const logoOffset = (dim - logoModules) / 2;

  // Caption band (in module units) baked directly into the image so the
  // expiration date travels with the QR even if only the graphic is printed
  // or screenshotted without the surrounding page text.
  const CAP = 8;
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
    const footer = px * 12;
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

    // Center white knockout + logo
    const boxPx = logoModules * px;
    const boxX = pad + logoOffset * px;
    const boxY = pad + logoOffset * px;
    const knockPad = px;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      boxX - knockPad,
      boxY - knockPad,
      boxPx + knockPad * 2,
      boxPx + knockPad * 2
    );

    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ar = img.width / img.height || 1;
        let lw = boxPx;
        let lh = boxPx / ar;
        if (lh > boxPx) {
          lh = boxPx;
          lw = boxPx * ar;
        }
        ctx.drawImage(img, boxX + (boxPx - lw) / 2, boxY + (boxPx - lh) / 2, lw, lh);
        resolve();
      };
      img.onerror = () => resolve(); // still export QR even if logo fails
      img.src = logoSrc;
    });

    // Footer text
    const cx = W / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = JD_GREEN;
    ctx.font = `700 ${px * 3.2}px Inter, Arial, sans-serif`;
    ctx.fillText("Scan to redeem", cx, qrPx + pad + px * 4.5);
    ctx.fillStyle = "#111827";
    ctx.font = `600 ${px * 2.4}px Inter, Arial, sans-serif`;
    ctx.fillText(campaignName, cx, qrPx + pad + px * 8);
    ctx.fillStyle = "#6b7280";
    ctx.font = `500 ${px * 2}px Inter, Arial, sans-serif`;
    ctx.fillText(expiresLabel, cx, qrPx + pad + px * 11);

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
        Print for in-store signage, counters, and flyers. Includes the John
        Deere logo and the offer expiration date.
      </p>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="rounded-md border border-border-light p-3">
          <svg
            viewBox={`0 0 ${dim} ${totalH}`}
            width={220}
            height={(220 * totalH) / dim}
            role="img"
            aria-label={`QR code for ${campaignName}. ${expiresLabel}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={dim} height={totalH} fill="#ffffff" />
            <g shapeRendering="crispEdges">
              <path d={pathData} fill="#000000" />
              {/* Center knockout for the logo */}
              <rect
                x={logoOffset - 1}
                y={logoOffset - 1}
                width={logoModules + 2}
                height={logoModules + 2}
                fill="#ffffff"
              />
            </g>
            <image
              href={logoSrc}
              x={logoOffset}
              y={logoOffset}
              width={logoModules}
              height={logoModules}
              preserveAspectRatio="xMidYMid meet"
            />
            {/* Caption baked into the image (expiration travels with the code) */}
            <text
              x={dim / 2}
              y={dim + 3}
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
              y={dim + 6.2}
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize={2}
              fontWeight={600}
              fill="#111827"
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
