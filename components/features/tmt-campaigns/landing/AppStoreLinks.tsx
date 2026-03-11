"use client";

interface AppStoreLinksProps {
  appStoreLink?: { enabled: boolean; url: string };
  googlePlayLink?: { enabled: boolean; url: string };
}

export default function AppStoreLinks({
  appStoreLink,
  googlePlayLink,
}: AppStoreLinksProps) {
  if (!appStoreLink?.enabled && !googlePlayLink?.enabled) return null;

  return (
    <div className="flex justify-center gap-3 px-6">
      {appStoreLink?.enabled && appStoreLink.url && (
        <a href={appStoreLink.url} target="_blank" rel="noopener noreferrer">
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on the App Store"
            className="h-10"
          />
        </a>
      )}
      {googlePlayLink?.enabled && googlePlayLink.url && (
        <a href={googlePlayLink.url} target="_blank" rel="noopener noreferrer">
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="h-10"
          />
        </a>
      )}
    </div>
  );
}
