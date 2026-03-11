"use client";

import { useState, FormEvent } from "react";
import { FormField } from "@/types/tmt-campaign";

interface LandingFormProps {
  formFields: FormField[];
  submitButton: {
    text: string;
    backgroundColor: string;
    textColor: string;
    style: "contained" | "outline" | "text";
    borderRadius: number;
    redirectUrl: string;
  };
  affiliateSlug: string;
  code: string;
  getCode: string;
}

export default function LandingForm({
  formFields,
  submitButton,
  affiliateSlug,
  code,
  getCode,
}: LandingFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === "email" && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email address";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const emailField = formFields.find((f) => f.type === "email");
      const email = emailField ? formData[emailField.id] : "";

      if (email) {
        await fetch("/api/tmt/codes/email", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ affiliate_slug: affiliateSlug, email }),
        });
      }

      if (
        getCode === "with-timer" ||
        getCode === "online" ||
        getCode === "pos"
      ) {
        let redirectUrl = `/p/${affiliateSlug}/${getCode}?code=${encodeURIComponent(code)}`;
        const zipcodeField = formFields.find((f) => f.type === "zipcode");
        if (zipcodeField && formData[zipcodeField.id]) {
          const paramKey = zipcodeField.urlParamKey || "zipcode";
          redirectUrl += `&${paramKey}=${encodeURIComponent(formData[zipcodeField.id])}`;
        }
        window.location.href = redirectUrl;
      } else if (submitButton.redirectUrl) {
        let redirectUrl = submitButton.redirectUrl;
        if (redirectUrl.includes("?")) {
          redirectUrl += `&code=${encodeURIComponent(code)}`;
        } else {
          redirectUrl += `?code=${encodeURIComponent(code)}`;
        }
        const zipcodeField = formFields.find((f) => f.type === "zipcode");
        if (zipcodeField && formData[zipcodeField.id]) {
          const paramKey = zipcodeField.urlParamKey || "zipcode";
          redirectUrl += `&${paramKey}=${encodeURIComponent(formData[zipcodeField.id])}`;
        }
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonStyles = () => {
    const base: React.CSSProperties = {
      borderRadius: `${submitButton.borderRadius}px`,
    };
    switch (submitButton.style) {
      case "contained":
        return {
          ...base,
          backgroundColor: submitButton.backgroundColor,
          color: submitButton.textColor,
        };
      case "outline":
        return {
          ...base,
          border: `2px solid ${submitButton.backgroundColor}`,
          color: submitButton.backgroundColor,
          backgroundColor: "transparent",
        };
      case "text":
        return {
          ...base,
          color: submitButton.backgroundColor,
          backgroundColor: "transparent",
          textDecoration: "underline",
        };
      default:
        return base;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto px-6 space-y-3"
    >
      {formFields.map((field) => (
        <div key={field.id} className="flex justify-center">
          <div
            style={{
              maxWidth: field.maxWidth ? `${field.maxWidth}px` : "100%",
              width: "100%",
            }}
          >
            <input
              type={field.type === "zipcode" ? "text" : field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [field.id]: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, [field.id]: "" }));
              }}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderRadius: `${field.borderRadius ?? 8}px` }}
              required={field.required}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
            )}
          </div>
        </div>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        style={getButtonStyles()}
      >
        {isSubmitting ? "Submitting..." : submitButton.text}
      </button>
    </form>
  );
}
