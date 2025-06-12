"use client";

import { NewsletterHeader } from "./NewsletterHeader";
import { NewsletterHero } from "./NewsletterHero";
import { LocalOffersSection } from "./LocalOffersSection";
import { RewardsSection } from "./RewardsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { NewsletterFooter } from "./NewsletterFooter";

interface UserLocation {
  city: string;
  state: string;
  country: string;
}

interface MastercardNewsletterProps {
  userLocation?: UserLocation;
}

export function MastercardNewsletter({
  userLocation = { city: "San Francisco", state: "CA", country: "USA" },
}: MastercardNewsletterProps) {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg">
      {/* Email-safe container with max-width for email clients */}
      <div className="w-full">
        <NewsletterHeader />
        <NewsletterHero userLocation={userLocation} />
        <LocalOffersSection userLocation={userLocation} />
        <RewardsSection />
        <HowItWorksSection />
        <NewsletterFooter />
      </div>
    </div>
  );
}
