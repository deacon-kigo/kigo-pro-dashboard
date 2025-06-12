interface UserLocation {
  city: string;
  state: string;
  country: string;
}

interface NewsletterHeroProps {
  userLocation: UserLocation;
}

export function NewsletterHero({ userLocation }: NewsletterHeroProps) {
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section
      className="relative"
      style={{
        backgroundColor: "#141413",
        fontFamily: "Montserrat, Arial, sans-serif",
        padding: "60px 40px 60px 40px",
      }}
    >
      <div className="max-w-2xl relative z-10">
        <h1
          className="leading-tight"
          style={{
            fontSize: "42px",
            fontWeight: "200",
            color: "#ffffff",
            marginBottom: "24px",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          }}
        >
          Shopping local in{" "}
          <span style={{ color: "#ff671b", fontWeight: "300" }}>
            {userLocation.city}
          </span>{" "}
          has never been more rewarding
        </h1>

        <div
          className="mb-8"
          style={{
            width: "60px",
            height: "0.5px",
            backgroundColor: "#74726e",
          }}
        ></div>

        <p
          className="leading-relaxed mb-10"
          style={{
            fontSize: "18px",
            fontWeight: "200",
            color: "#74726e",
            lineHeight: "1.6",
            letterSpacing: "0.01em",
          }}
        >
          Your {currentMonth} guide to exclusive local offers, rewards, and
          community highlights in {userLocation.city}, {userLocation.state}.
        </p>

        <div
          className="inline-block"
          style={{
            backgroundColor: "#ff671b",
            color: "#141413",
            padding: "16px 32px",
            borderRadius: "2px",
            fontSize: "16px",
            fontWeight: "300",
            letterSpacing: "0.02em",
          }}
        >
          <span className="block">Earn 5% cash back</span>
          <span
            className="block"
            style={{
              fontSize: "14px",
              fontWeight: "200",
              marginTop: "4px",
              opacity: "0.9",
            }}
          >
            with your eligible Mastercard®
          </span>
        </div>
      </div>

      {/* Minimalistic geometric background - email safe */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "0.04" }}
      >
        {/* Subtle geometric lines */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          style={{ position: "absolute", top: "0", left: "0" }}
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#74726e"
                strokeWidth="0.25"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating geometric shapes */}
        <div
          style={{
            position: "absolute",
            right: "10%",
            top: "20%",
            width: "120px",
            height: "120px",
            border: "0.5px solid #74726e",
            borderRadius: "50%",
            opacity: "0.3",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            right: "15%",
            bottom: "25%",
            width: "60px",
            height: "60px",
            border: "0.5px solid #74726e",
            transform: "rotate(45deg)",
            opacity: "0.2",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            left: "5%",
            top: "60%",
            width: "80px",
            height: "0.5px",
            backgroundColor: "#74726e",
            opacity: "0.4",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            right: "25%",
            top: "70%",
            width: "100px",
            height: "0.5px",
            backgroundColor: "#74726e",
            transform: "rotate(30deg)",
            opacity: "0.3",
          }}
        ></div>
      </div>
    </section>
  );
}
