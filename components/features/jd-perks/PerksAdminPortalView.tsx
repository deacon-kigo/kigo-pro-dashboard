"use client";

import React from "react";
import Image from "next/image";
import {
  GlobeAltIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const JD_GREEN = "#367C2B";

const STEPS = ["Code", "Verify", "Apply", "Summary"] as const;

/**
 * Static, non-functional mockup of the John Deere "Perks Admin Portal" (PDAP)
 * dealer-facing tool. Reproduces the promo-code entry screen for demo purposes;
 * no inputs are wired up.
 */
export default function PerksAdminPortalView() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
      {/* Branded header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E4E5E7" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logos/john-deere.svg"
            alt="John Deere"
            width={44}
            height={30}
            priority
          />
          <div className="leading-tight">
            <p className="text-base font-bold text-text-dark">
              Perks Admin Portal
            </p>
            <p className="text-xs text-text-muted">Dealer Access</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-text-muted"
          aria-label="Language"
        >
          <GlobeAltIcon className="h-4 w-4" />
          English
        </button>
      </div>

      {/* Body */}
      <div className="bg-[#E8F0E3] px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-center">
            {STEPS.map((label, i) => {
              const isActive = i === 0;
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{
                        backgroundColor: isActive ? JD_GREEN : "#B7C4AE",
                      }}
                    >
                      {isActive ? i + 1 : i + 1}
                    </div>
                    <span
                      className="mt-1.5 text-xs"
                      style={{ color: isActive ? JD_GREEN : "#8A968A" }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-1 mb-5 h-px w-10 bg-[#B7C4AE]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-center text-lg font-bold text-text-dark">
              Enter promo code
            </h2>
            <p className="mt-1 text-center text-sm text-text-muted">
              Enter the customer&apos;s promo code to validate and apply.
            </p>

            <input
              type="text"
              placeholder="Promo code"
              readOnly
              className="mt-5 w-full rounded-md border border-border-light px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none"
            />

            <button
              type="button"
              className="mt-4 w-full rounded-md py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: JD_GREEN }}
            >
              Verify promo code
            </button>

            <div className="mt-5 flex items-start gap-2 rounded-md bg-[#F3F6F1] p-3 text-xs text-text-muted">
              <QuestionMarkCircleIcon
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: JD_GREEN }}
              />
              <p>
                Need help? Check our{" "}
                <span className="font-medium" style={{ color: JD_GREEN }}>
                  FAQs
                </span>{" "}
                or give us a call at{" "}
                <span className="font-medium" style={{ color: JD_GREEN }}>
                  1-800-537-8233
                </span>
                . Our team is available Mon–Fri, 8AM–7 PM ET.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
