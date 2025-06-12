export function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Find offers",
      description: "Browse and search offers within the offers experience.",
      icon: (
        <div
          style={{
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/illustration/mastercard/search-discount.svg"
            alt="Find offers"
            style={{ width: "64px", height: "64px" }}
          />
        </div>
      ),
    },
    {
      id: 2,
      title: "Show and Save Offers",
      description:
        "These are high-value, local deals you can redeem at the point of sales for instant savings.",
      icon: (
        <div
          style={{
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/illustration/mastercard/save-money.svg"
            alt="Save money"
            style={{ width: "64px", height: "64px" }}
          />
        </div>
      ),
    },
    {
      id: 3,
      title: "Cash Back Offers",
      description:
        "Enroll your eligible Mastercard and swipe to earn cash back at participating businesses.",
      icon: (
        <div
          style={{
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/illustration/mastercard/cashback.svg"
            alt="Cash back"
            style={{ width: "64px", height: "64px" }}
          />
        </div>
      ),
    },
  ];

  return (
    <section style={{ backgroundColor: "#f7f7f7", padding: "80px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#141413",
              marginBottom: "16px",
              fontFamily: "Montserrat, Arial, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              width: "60px",
              height: "0.5px",
              backgroundColor: "#ff671b",
              margin: "0 auto",
            }}
          ></div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "60px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {steps.map((step) => (
            <div key={step.id} style={{ textAlign: "center" }}>
              <div
                style={{
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {step.icon}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "300",
                  color: "#141413",
                  marginBottom: "16px",
                  fontFamily: "Montserrat, Arial, sans-serif",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#74726e",
                  lineHeight: "1.6",
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontWeight: "200",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            borderTop: "1px solid #e3dfd7",
            paddingTop: "40px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#74726e",
              marginBottom: "32px",
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: "200",
            }}
          >
            Start earning cash back today with your Mastercard
          </p>

          {/* Alternative arrow-style CTA */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              color: "#141413",
              fontSize: "16px",
              fontWeight: "300",
              fontFamily: "Montserrat, Arial, sans-serif",
              marginBottom: "24px",
            }}
          >
            <span>Learn about enrollment</span>
            <div
              style={{
                width: "32px",
                height: "1px",
                backgroundColor: "#ff671b",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "-3px",
                  width: "0",
                  height: "0",
                  borderLeft: "6px solid #ff671b",
                  borderTop: "3px solid transparent",
                  borderBottom: "3px solid transparent",
                }}
              ></div>
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <button
              style={{
                backgroundColor: "#ff671b",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "24px",
                border: "none",
                fontSize: "16px",
                fontWeight: "300",
                cursor: "pointer",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
