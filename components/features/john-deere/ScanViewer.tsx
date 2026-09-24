"use client";

import { useEffect, useId, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { Download, ZoomIn, ZoomOut } from "lucide-react";

import { Button, buttonVariants } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { Skeleton } from "@/components/prod/skeleton";
import { cn } from "@/components/prod/utils/cn";

import { ResultBanner } from "./ResultBanner";
import { type ReviewDocument } from "./data";

type FitMode = "custom" | "fit-page" | "fit-width";

const STEPS = [75, 100, 125, 150];
const BASE_WIDTH = 560;
const THUMB_WIDTH = 72;
const LETTER_RATIO = 8.5 / 11;
const FRAME_BORDER = 2;

const PdfDocument = dynamic(
  async () => {
    const reactPdf = await import("react-pdf");
    reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    return reactPdf.Document;
  },
  { ssr: false }
);

const PdfPage = dynamic(async () => (await import("react-pdf")).Page, {
  ssr: false,
});

interface ScanViewerProps {
  caption: string;
  className?: string;
  document: ReviewDocument;
  thumbnails?: boolean;
}

const ScanViewer = ({
  caption,
  className,
  document,
  thumbnails = true,
}: ScanViewerProps) => {
  const pages = document.pages;
  const [page, setPage] = useState(1);
  const [pageDraft, setPageDraft] = useState("1");
  const [mode, setMode] = useState<FitMode>("fit-page");
  const [scale, setScale] = useState(100);
  const [railVisible, setRailVisible] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [box, setBox] = useState({ height: 0, width: 0 });
  const [canvasNode, setCanvasNode] = useState<HTMLDivElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const fieldId = useId();

  /* prod.css's `.pro-root .hidden` outranks any `xl:` display utility, so the rail is gated in JS. */
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const sync = () => setRailVisible(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setNarrow(entry.contentRect.width < 400)
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasNode) return;
    const observer = new ResizeObserver(([entry]) =>
      setBox({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      })
    );
    observer.observe(canvasNode);
    return () => observer.disconnect();
  }, [canvasNode]);

  const goToPage = (next: number) => {
    setPage(next);
    setPageDraft(String(next));
  };

  const commitDraft = () => {
    const next = Number(pageDraft);
    if (Number.isInteger(next) && next >= 1 && next <= pages) goToPage(next);
    else setPageDraft(String(page));
  };

  const stepZoom = (direction: -1 | 1) => {
    const index = STEPS.indexOf(scale);
    const next =
      STEPS[
        Math.min(
          STEPS.length - 1,
          Math.max(0, (index === -1 ? 1 : index) + direction)
        )
      ];
    setScale(next);
    setMode("custom");
  };

  const pageWidth =
    mode === "fit-width"
      ? Math.max(box.width - FRAME_BORDER, 0)
      : mode === "custom"
        ? (BASE_WIDTH * scale) / 100
        : undefined;
  const pageHeight =
    mode === "fit-page" ? Math.max(box.height - FRAME_BORDER, 0) : undefined;
  const measured = box.width > 0 && box.height > 0;

  const frameStyle = {
    height: pageHeight ?? (pageWidth ? pageWidth / LETTER_RATIO : undefined),
    width: pageWidth ?? (pageHeight ? pageHeight * LETTER_RATIO : undefined),
  };

  const placeholder = (
    <div className="flex-1 overflow-hidden bg-gray-100 p-4">
      <Skeleton
        className="mx-auto h-full rounded"
        style={{ width: frameStyle.width }}
      />
    </div>
  );

  const pageNode =
    document.kind === "pdf" ? (
      <PdfPage
        height={pageHeight}
        loading={
          <Skeleton className="h-full w-full rounded-none" style={frameStyle} />
        }
        pageNumber={page}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        width={pageWidth}
      />
    ) : (
      <img
        alt={caption}
        className="block"
        src={document.src}
        style={{ height: pageHeight, width: pageWidth }}
      />
    );

  const body = (
    <div className="flex min-h-0 flex-1">
      {thumbnails && railVisible && document.kind === "pdf" && (
        <div className="flex w-24 shrink-0 flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-gray-50 p-2">
          {Array.from({ length: pages }, (_, index) => index + 1).map(
            (number) => (
              <div key={number}>
                <button
                  aria-current={number === page}
                  aria-label={`Page ${number}`}
                  className={cn(
                    "block overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm",
                    number === page && "border-primary border-2"
                  )}
                  onClick={() => goToPage(number)}
                  type="button"
                >
                  <PdfPage
                    pageNumber={number}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    width={THUMB_WIDTH}
                  />
                </button>
                <span className="mt-1 block text-center text-sm text-gray-500">
                  {number}
                </span>
              </div>
            )
          )}
        </div>
      )}
      <div
        aria-label={caption}
        className="flex-1 overflow-auto bg-gray-100 p-4"
        ref={setCanvasNode}
        role="group"
      >
        {measured && (
          <div className="flex h-full w-max min-w-full justify-center">
            <div className="shrink-0 border border-gray-300 bg-white shadow-sm">
              {pageNode}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card
      className={cn("flex min-w-0 flex-col overflow-hidden", className)}
      ref={root}
      roundness="lg"
    >
      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-gray-200 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
          <label
            className="flex shrink-0 items-center gap-2 text-base text-gray-700"
            htmlFor={`${fieldId}-page`}
          >
            Page
            <input
              className="h-8 w-12 rounded-md border border-gray-200 text-center text-base text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              disabled={pages === 1}
              id={`${fieldId}-page`}
              inputMode="numeric"
              onBlur={commitDraft}
              onChange={(event) => setPageDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitDraft();
              }}
              value={pageDraft}
            />
          </label>
          <span className="shrink-0 text-base text-gray-700">of {pages}</span>
          {!narrow && (
            <span className="min-w-0 truncate text-sm text-gray-500">
              {document.fileName}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!narrow && (
            <Button
              aria-label="Zoom out"
              color="secondary"
              disabled={mode === "custom" && scale === STEPS[0]}
              onClick={() => stepZoom(-1)}
              size="icon"
              variant="ghost"
            >
              <ZoomOut />
            </Button>
          )}
          <label className="sr-only" htmlFor={`${fieldId}-zoom`}>
            Zoom
          </label>
          <select
            className="h-8 rounded-md border border-gray-200 bg-white px-2 text-base text-gray-900"
            id={`${fieldId}-zoom`}
            onChange={(event) => {
              const value = event.target.value as FitMode;
              setMode(value);
              if (value === "custom") setScale(100);
            }}
            value={mode}
          >
            <option value="fit-page">Fit page</option>
            <option value="fit-width">Fit width</option>
            <option value="custom">{scale}%</option>
          </select>
          {!narrow && (
            <Button
              aria-label="Zoom in"
              color="secondary"
              disabled={mode === "custom" && scale === STEPS[STEPS.length - 1]}
              onClick={() => stepZoom(1)}
              size="icon"
              variant="ghost"
            >
              <ZoomIn />
            </Button>
          )}
          {!narrow && (
            <span aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
          )}
          <a
            aria-label="Download file"
            className={cn(
              buttonVariants({
                color: "secondary",
                size: "icon",
                variant: "ghost",
              })
            )}
            download={document.fileName}
            href={document.src}
          >
            <Download />
          </a>
        </div>
      </div>
      {document.kind === "pdf" ? (
        <PdfDocument
          className="contents"
          error={
            <div className="flex-1 bg-gray-100 p-4">
              <ResultBanner
                title="Could not load the document"
                tone="destructive"
              />
            </div>
          }
          file={document.src}
          loading={placeholder}
        >
          {body}
        </PdfDocument>
      ) : (
        body
      )}
    </Card>
  );
};

export { ScanViewer };
