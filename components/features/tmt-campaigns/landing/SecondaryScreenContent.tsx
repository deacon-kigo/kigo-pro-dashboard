"use client";

import { useState, useCallback } from "react";
import { LandingPageConfig } from "@/types/tmt-campaign";
import LandingHeader from "./LandingHeader";
import CopyCodeSection from "./CopyCodeSection";
import AppStoreLinks from "./AppStoreLinks";
import LegalText from "./LegalText";
import CountdownModal from "./CountdownModal";

interface CodeInfo {
  code: string;
  affiliate_code_one: string;
  affiliate_code_two: string;
  is_used: boolean;
  has_email: boolean;
}

interface SecondaryScreenContentProps {
  config: LandingPageConfig;
  codeInfo: CodeInfo;
  type: "with-timer" | "online" | "pos";
  slug: string;
}

export default function SecondaryScreenContent({
  config,
  codeInfo,
  type,
  slug,
}: SecondaryScreenContentProps) {
  const [showModal, setShowModal] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [copiedOne, setCopiedOne] = useState(false);
  const [copiedTwo, setCopiedTwo] = useState(false);

  const handleCopy = useCallback(
    async (text: string, setter: (v: boolean) => void) => {
      try {
        await navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    []
  );

  if (type === "with-timer") {
    const tc = config.withTimerConfig;
    return (
      <div
        className="min-h-screen flex flex-col items-center"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="w-full max-w-md">
          <LandingHeader logoUrl={config.logo.url} logoAlt={config.logo.alt} />
          <div className="px-6 text-center">
            <h1 className="text-2xl font-bold mb-2">{tc.title}</h1>
            {tc.subtitle && (
              <div
                className="text-sm mb-2"
                dangerouslySetInnerHTML={{ __html: tc.subtitle }}
              />
            )}
            {tc.description && (
              <div
                className="text-sm text-gray-600 mb-6"
                dangerouslySetInnerHTML={{ __html: tc.description }}
              />
            )}
            {tc.showImage && config.image.url && (
              <img
                src={config.image.url}
                alt={config.image.alt}
                className="w-48 h-auto mx-auto mb-6 object-contain"
              />
            )}
            <button
              onClick={() => setShowModal(true)}
              disabled={timerExpired}
              className="w-full py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: tc.primaryButton.backgroundColor,
                color: tc.primaryButton.textColor,
                borderRadius: `${tc.primaryButton.borderRadius}px`,
              }}
            >
              {timerExpired ? "Timer Expired" : tc.primaryButton.text}
            </button>
            {tc.secondaryButton.enabled && (
              <a
                href={tc.secondaryButton.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 mt-3 font-medium text-center transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: tc.secondaryButton.backgroundColor,
                  color: tc.secondaryButton.textColor,
                  borderRadius: `${tc.secondaryButton.borderRadius}px`,
                  border: `2px solid ${tc.secondaryButton.textColor}`,
                }}
              >
                {tc.secondaryButton.text}
              </a>
            )}
          </div>
          {config.legalText && (
            <div className="mt-6 mb-8">
              <LegalText text={config.legalText} />
            </div>
          )}
        </div>

        <CountdownModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onExpire={() => setTimerExpired(true)}
          title={tc.modal.title}
          subtitle={tc.modal.subtitle}
          description={tc.modal.description}
          code={codeInfo.code}
          redeemText={tc.modal.redeemText}
          countdownMinutes={tc.modal.countdownMinutes}
          timerBackgroundColor={tc.modal.timerBackgroundColor}
          affiliateSlug={slug}
        />
      </div>
    );
  }

  if (type === "online") {
    const oc = config.onlineConfig;
    const codeOne =
      oc.affiliateCodeOne.hardcodedValue || codeInfo.affiliate_code_one;
    const codeTwo =
      oc.affiliateCodeTwo.hardcodedValue || codeInfo.affiliate_code_two;

    let buttonUrl = oc.button.url;
    if (oc.button.appendAffiliateCode && codeOne) {
      buttonUrl = buttonUrl.includes("?")
        ? `${buttonUrl}&code=${codeOne}`
        : `${buttonUrl}?code=${codeOne}`;
    }

    return (
      <div
        className="min-h-screen flex flex-col items-center"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="w-full max-w-md">
          <LandingHeader logoUrl={config.logo.url} logoAlt={config.logo.alt} />
          <div className="px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">{oc.title}</h1>
            {oc.showImage && config.image.url && (
              <img
                src={config.image.url}
                alt={config.image.alt}
                className="w-48 h-auto mx-auto mb-4 object-contain"
              />
            )}

            {oc.affiliateCodeOne.enabled && codeOne && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {oc.affiliateCodeOne.label}
                </p>
                <div
                  className="flex items-stretch border-2 overflow-hidden"
                  style={{
                    borderColor: oc.affiliateCodeOne.copyButtonColor,
                    borderRadius: `${oc.affiliateCodeOne.borderRadius}px`,
                  }}
                >
                  <div className="flex-1 px-4 py-3 text-sm font-bold text-center bg-white">
                    {codeOne}
                  </div>
                  <button
                    onClick={() => handleCopy(codeOne, setCopiedOne)}
                    className="px-5 py-3 text-xs font-bold text-white"
                    style={{
                      backgroundColor: oc.affiliateCodeOne.copyButtonColor,
                    }}
                  >
                    {copiedOne ? "COPIED!" : "COPY"}
                  </button>
                </div>
              </div>
            )}

            {oc.affiliateCodeTwo.enabled && codeTwo && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {oc.affiliateCodeTwo.label}
                </p>
                <div
                  className="flex items-stretch border-2 overflow-hidden"
                  style={{
                    borderColor: oc.affiliateCodeTwo.copyButtonColor,
                    borderRadius: `${oc.affiliateCodeTwo.borderRadius}px`,
                  }}
                >
                  <div className="flex-1 px-4 py-3 text-sm font-bold text-center bg-white">
                    {codeTwo}
                  </div>
                  <button
                    onClick={() => handleCopy(codeTwo, setCopiedTwo)}
                    className="px-5 py-3 text-xs font-bold text-white"
                    style={{
                      backgroundColor: oc.affiliateCodeTwo.copyButtonColor,
                    }}
                  >
                    {copiedTwo ? "COPIED!" : "COPY"}
                  </button>
                </div>
              </div>
            )}

            {oc.promoBarcodeImage.enabled && oc.promoBarcodeImage.url && (
              <div className="mb-4">
                <img
                  src={oc.promoBarcodeImage.url}
                  alt={oc.promoBarcodeImage.alt}
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            )}

            {oc.button.enabled && (
              <a
                href={buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 font-medium text-center transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: oc.button.backgroundColor,
                  color: oc.button.textColor,
                  borderRadius: `${oc.button.borderRadius}px`,
                }}
              >
                {oc.button.text}
              </a>
            )}

            {oc.description && (
              <div
                className="text-sm text-gray-600 mt-4"
                dangerouslySetInnerHTML={{ __html: oc.description }}
              />
            )}
          </div>
          {config.legalText && (
            <div className="mt-6 mb-8">
              <LegalText text={config.legalText} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // POS type
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className="w-full max-w-md">
        <LandingHeader logoUrl={config.logo.url} logoAlt={config.logo.alt} />
        <div className="px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">{config.title}</h1>
          {config.image.url && (
            <img
              src={config.image.url}
              alt={config.image.alt}
              className="w-48 h-auto mx-auto mb-4 object-contain"
            />
          )}
        </div>
        {config.copyCode.enabled && (
          <div className="mt-4">
            <CopyCodeSection
              code={codeInfo.code}
              copyButtonColor={config.copyCode.copyButtonColor}
              borderRadius={config.copyCode.borderRadius}
              button={config.copyCode.button}
            />
          </div>
        )}
        <div className="mt-4">
          <AppStoreLinks
            appStoreLink={config.appStoreLink}
            googlePlayLink={config.googlePlayLink}
          />
        </div>
        {config.legalText && (
          <div className="mt-6 mb-8">
            <LegalText text={config.legalText} />
          </div>
        )}
      </div>
    </div>
  );
}
