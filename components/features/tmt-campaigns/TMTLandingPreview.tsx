"use client";

import { useState } from "react";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface TMTLandingPreviewProps {
  config: LandingPageConfig;
}

export default function TMTLandingPreview({ config }: TMTLandingPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (config.copyCode?.code) {
      try {
        await navigator.clipboard.writeText(config.copyCode.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-gray-100 px-6 py-2 flex justify-between items-center text-xs">
            <span>9:41</span>
            <div className="w-20 h-6 bg-black rounded-full"></div>
            <span>100%</span>
          </div>

          {/* Content */}
          <div
            className="min-h-[500px] px-6 pt-4 pb-8 flex flex-col items-center"
            style={{ backgroundColor: config.backgroundColor }}
          >
            {/* Logo */}
            {config.logo?.url ? (
              <img
                src={config.logo.url}
                alt={config.logo.alt ?? "Logo"}
                className="h-16 w-auto object-contain mb-4"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            )}

            <div className="w-[calc(100%+48px)] -mx-6 h-px bg-gray-200 mb-6" />

            <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
              {config.title || "Your Title Here"}
            </h1>

            <div
              className="text-sm text-center text-gray-600 mb-6"
              dangerouslySetInnerHTML={{
                __html: config.description || "<p>Your description here</p>",
              }}
            />

            {config.image?.url ? (
              <img
                src={config.image.url}
                alt={config.image.alt ?? "Product"}
                className="w-48 h-36 object-contain mb-4"
              />
            ) : (
              <div className="w-48 h-36 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-xs">Product Image</span>
              </div>
            )}

            {config.secondaryDescription && (
              <div
                className="text-xs text-center text-gray-600 mb-6"
                dangerouslySetInnerHTML={{
                  __html: config.secondaryDescription,
                }}
              />
            )}

            {config.showForm && (
              <>
                <div className="w-full space-y-3 mb-4">
                  {config.formFields?.map((field) => (
                    <div key={field.id} className="flex justify-center">
                      <input
                        type={field.type === "zipcode" ? "text" : field.type}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none"
                        style={{
                          maxWidth: field.maxWidth
                            ? `${field.maxWidth}px`
                            : "100%",
                          borderRadius: `${field.borderRadius ?? 8}px`,
                        }}
                        disabled
                      />
                    </div>
                  ))}
                </div>
                <button
                  className={`w-full py-3 text-sm font-medium ${config.submitButton?.style === "text" ? "underline" : ""}`}
                  style={{
                    backgroundColor:
                      config.submitButton?.style === "contained"
                        ? config.submitButton.backgroundColor
                        : "transparent",
                    color:
                      config.submitButton?.style === "contained"
                        ? config.submitButton.textColor
                        : (config.submitButton?.backgroundColor ?? "#000000"),
                    border:
                      config.submitButton?.style === "outline"
                        ? `2px solid ${config.submitButton.backgroundColor}`
                        : "none",
                    borderRadius: `${config.submitButton?.borderRadius ?? 6}px`,
                  }}
                  disabled
                >
                  {config.submitButton?.text || "Submit"}
                </button>
              </>
            )}

            {config.linkButtons?.length > 0 && (
              <div className="w-full flex flex-col items-center space-y-2 mt-4">
                {config.linkButtons.map((button) => (
                  <span
                    key={button.id}
                    className={`block w-full py-2 text-sm text-center font-medium ${button.style === "text" ? "underline" : ""}`}
                    style={{
                      maxWidth: `${button.maxWidth}px`,
                      backgroundColor:
                        button.style === "contained"
                          ? button.backgroundColor
                          : "transparent",
                      color:
                        button.style === "contained"
                          ? button.textColor
                          : button.backgroundColor,
                      border:
                        button.style === "outline"
                          ? `2px solid ${button.backgroundColor}`
                          : "none",
                      borderRadius: `${button.borderRadius}px`,
                    }}
                  >
                    {button.text || "Link"}
                  </span>
                ))}
              </div>
            )}

            {config.copyCode?.enabled && config.copyCode.code && (
              <div className="w-full flex flex-col items-center mt-4">
                <div
                  className="w-full flex items-stretch border-2 overflow-hidden"
                  style={{
                    borderColor: config.copyCode.copyButtonColor || "#3b82f6",
                    borderRadius: `${config.copyCode.borderRadius ?? 9999}px`,
                  }}
                >
                  <div className="flex-1 px-4 py-3 text-sm font-bold text-center text-gray-800 bg-white flex items-center justify-center">
                    {config.copyCode.code}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-5 py-3 text-xs font-bold text-white"
                    style={{
                      backgroundColor:
                        config.copyCode.copyButtonColor || "#3b82f6",
                    }}
                  >
                    {copied ? "COPIED!" : "COPY"}
                  </button>
                </div>
                {config.copyCode.button?.enabled && (
                  <span
                    className="mt-3 px-8 py-2 text-sm font-medium text-center"
                    style={{
                      backgroundColor: config.copyCode.button.backgroundColor,
                      color: config.copyCode.button.textColor,
                      borderRadius: `${config.copyCode.button.borderRadius}px`,
                    }}
                  >
                    {config.copyCode.button.text || "Redeem"}
                  </span>
                )}
              </div>
            )}

            {(config.appStoreLink?.enabled ||
              config.googlePlayLink?.enabled) && (
              <div className="flex justify-center gap-2 mt-4">
                {config.appStoreLink?.enabled && (
                  <div className="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-white text-[8px]">
                    App Store
                  </div>
                )}
                {config.googlePlayLink?.enabled && (
                  <div className="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-white text-[8px]">
                    Google Play
                  </div>
                )}
              </div>
            )}

            {config.legalText && (
              <div
                className="text-[10px] text-gray-500 text-center mt-4 leading-tight"
                dangerouslySetInnerHTML={{ __html: config.legalText }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
