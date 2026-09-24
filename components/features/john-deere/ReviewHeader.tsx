"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { cn } from "@/components/prod/utils/cn";

import { type Fact } from "./data";
import { JOHN_DEERE } from "./partner";
import { StatusPill } from "./StatusPill";
import { TONE, type Tone } from "./tone";

interface ReviewHeaderProps {
  actions?: ReactNode;
  backHref: string;
  backLabel: string;
  compactActions?: ReactNode;
  id: string;
  meta: ReactNode[];
  progress?: string;
  signals?: Fact[];
  status: { label: string; tone: Tone };
  summary: ReactNode;
}

const ReviewHeader = ({
  actions,
  backHref,
  backLabel,
  compactActions,
  id,
  meta,
  progress,
  signals,
  status,
  summary,
}: ReviewHeaderProps) => {
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { root: node.closest("main"), threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div aria-hidden={!stuck} className="sticky -top-6 z-20 -mx-6 h-0">
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex h-20 items-center gap-3 border-b border-gray-200 bg-white px-6 pt-6 transition-[opacity,transform] duration-200",
            stuck
              ? "translate-y-0 opacity-100 shadow-md"
              : "pointer-events-none -translate-y-0.5 opacity-0"
          )}
        >
          {stuck && (
            <>
              <Button
                aria-label={backLabel}
                color="secondary"
                href={backHref}
                size="icon"
                variant="ghost"
              >
                <ArrowLeft />
              </Button>
              <span className="font-mono text-base font-semibold text-gray-900">
                {id}
              </span>
              <StatusPill color={status.tone}>{status.label}</StatusPill>
              {progress && (
                <span className="ml-auto text-sm text-gray-600">
                  {progress}
                </span>
              )}
              {compactActions && (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    !progress && "ml-auto"
                  )}
                >
                  {compactActions}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div aria-hidden className="h-px" ref={sentinel} />

      <Card
        className="mb-4 overflow-hidden px-6 py-5"
        roundness="lg"
        style={{ borderTop: `3px solid ${JOHN_DEERE.green}` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              alt={JOHN_DEERE.name}
              className="h-8 w-auto shrink-0"
              src="/logos/john-deere.svg"
            />
            <div>
              <h1 className="font-mono text-2xl font-semibold text-gray-900">
                {id}
              </h1>
              <div className="mt-1 flex flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-2.5">
                  <StatusPill color={status.tone}>{status.label}</StatusPill>
                  {summary}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  {meta.map((item, index) => (
                    <Fragment key={index}>
                      {index > 0 && (
                        <span aria-hidden className="text-gray-300">
                          ·
                        </span>
                      )}
                      {item}
                    </Fragment>
                  ))}
                </span>
              </div>
            </div>
          </div>
          {(progress || actions) && (
            <div className="flex flex-col items-end gap-2">
              {progress && <p className="text-sm text-gray-600">{progress}</p>}
              {actions && (
                <div className="flex items-center gap-3">{actions}</div>
              )}
            </div>
          )}
        </div>
        {signals && signals.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-3">
            {signals.map((fact) => (
              <div className="flex flex-col" key={fact.label}>
                <dt className="text-sm text-gray-500">{fact.label}</dt>
                <dd
                  className={cn(
                    "text-base font-medium text-gray-900",
                    fact.mono && "font-mono",
                    fact.tone && TONE[fact.tone].text
                  )}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Card>
    </>
  );
};

export { ReviewHeader };
