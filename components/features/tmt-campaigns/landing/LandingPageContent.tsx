"use client";

import { useEffect, useState } from "react";
import { LandingPageConfig } from "@/types/tmt-campaign";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingForm from "./LandingForm";
import CopyCodeSection from "./CopyCodeSection";
import LinkButtons from "./LinkButtons";
import AppStoreLinks from "./AppStoreLinks";
import LegalText from "./LegalText";

interface CodeInfo {
  code: string;
  affiliate_code_one: string;
  affiliate_code_two: string;
  is_used: boolean;
  has_email: boolean;
}

interface LandingPageContentProps {
  config: LandingPageConfig;
  codeInfo: CodeInfo;
  slug: string;
  code: string;
}

export default function LandingPageContent({
  config,
  codeInfo,
  slug,
  code,
}: LandingPageContentProps) {
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Set verification cookie
    fetch("/api/tmt/codes/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, affiliate_slug: slug }),
    }).catch(console.error);

    // Mark code as used
    fetch("/api/tmt/codes/mark-used", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliate_slug: slug }),
    }).catch(console.error);
  }, [code, slug]);

  useEffect(() => {
    if (hasRedirected) return;
    if (codeInfo.has_email && config.getCode) {
      setHasRedirected(true);
      window.location.href = `/p/${slug}/${config.getCode}?code=${encodeURIComponent(code)}`;
    }
  }, [codeInfo, config.getCode, slug, code, hasRedirected]);

  if (codeInfo.has_email && config.getCode) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className="w-full max-w-md">
        <LandingHeader logoUrl={config.logo.url} logoAlt={config.logo.alt} />
        <LandingHero
          title={config.title}
          description={config.description}
          imageUrl={config.image.url}
          imageAlt={config.image.alt}
          secondaryDescription={config.secondaryDescription}
        />
        {config.showForm && (
          <LandingForm
            formFields={config.formFields}
            submitButton={config.submitButton}
            affiliateSlug={slug}
            code={code}
            getCode={config.getCode}
          />
        )}
        {config.linkButtons.length > 0 && (
          <div className="mt-4">
            <LinkButtons buttons={config.linkButtons} />
          </div>
        )}
        {config.copyCode.enabled && config.copyCode.code && (
          <div className="mt-4">
            <CopyCodeSection
              code={config.copyCode.code}
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
