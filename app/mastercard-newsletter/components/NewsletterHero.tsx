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
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#141413",
        fontFamily: "Montserrat, Arial, sans-serif",
        height: "500px",
        display: "flex",
        alignItems: "stretch",
        marginBottom: "0",
      }}
    >
      {/* Left Content */}
      <div
        style={{
          flex: "1",
          maxWidth: "500px",
          padding: "40px 40px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
            backgroundColor: "#ff671b",
          }}
        ></div>

        <p
          className="leading-relaxed mb-10"
          style={{
            fontSize: "18px",
            fontWeight: "200",
            color: "#c0c0c0",
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
            color: "#ffffff",
            padding: "16px 32px",
            borderRadius: "24px",
            fontSize: "16px",
            fontWeight: "300",
            letterSpacing: "0.02em",
            alignSelf: "flex-start",
            flexShrink: 0,
          }}
        >
          <span className="block">Discover Local Offers</span>
          <span
            className="block"
            style={{
              fontSize: "14px",
              fontWeight: "200",
              marginTop: "4px",
              opacity: "0.9",
            }}
          >
            personalized for your area
          </span>
        </div>
      </div>

      {/* Right Illustration - Full Height with Geometric Overlay */}
      <div
        style={{
          flex: "1",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/illustration/mastercard/purchase.png"
          alt="Shopping illustration"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Geometric overlay shapes for visual interest */}
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            width: "80px",
            background:
              "linear-gradient(90deg, #141413 0%, rgba(20, 20, 19, 0.8) 40%, transparent 100%)",
            zIndex: 2,
          }}
        ></div>

        {/* Triangular accent shapes */}
        <div
          style={{
            position: "absolute",
            left: "60px",
            top: "25%",
            width: "0",
            height: "0",
            borderLeft: "25px solid rgba(255, 103, 27, 0.15)",
            borderTop: "15px solid transparent",
            borderBottom: "15px solid transparent",
            zIndex: 3,
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            left: "40px",
            bottom: "30%",
            width: "0",
            height: "0",
            borderLeft: "20px solid rgba(255, 103, 27, 0.1)",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            zIndex: 3,
          }}
        ></div>

        {/* Subtle line accents */}
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "15%",
            width: "30px",
            height: "1px",
            backgroundColor: "rgba(255, 103, 27, 0.3)",
            zIndex: 3,
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            left: "10px",
            bottom: "20%",
            width: "40px",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            zIndex: 3,
          }}
        ></div>
      </div>

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: "0.02",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          style={{ position: "absolute", top: "0", left: "0" }}
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#74726e"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
}
