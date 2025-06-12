export function RewardsSection() {
  const rewards = [
    {
      id: "1",
      title: "Grocery Stores",
      description: "Weekly grocery shopping at participating stores",
      cashback: "5%",
    },
    {
      id: "2",
      title: "Gas Stations",
      description: "Fill up at local gas stations nationwide",
      cashback: "5%",
    },
    {
      id: "3",
      title: "Restaurants",
      description: "Dine at local restaurants and cafes",
      cashback: "5%",
    },
  ];

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "80px 40px" }}>
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
            Maximize Your Rewards This Month
          </h2>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "200",
              color: "#74726e",
              fontFamily: "Montserrat, Arial, sans-serif",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Earn up to 5% cash back on everyday purchases with your eligible
            Mastercard. Support local businesses while earning rewards.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "32px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {rewards.map((reward) => (
            <div
              key={reward.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "6px",
                padding: "40px 32px",
                border: "1px solid #f0f0f0",
                fontFamily: "Montserrat, Arial, sans-serif",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "300",
                    color: "#ff671b",
                    marginBottom: "8px",
                    lineHeight: "1",
                  }}
                >
                  {reward.cashback}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "300",
                    color: "#74726e",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  cash back
                </div>
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "300",
                  color: "#141413",
                  marginBottom: "12px",
                  margin: "0 0 12px 0",
                }}
              >
                {reward.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#74726e",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                {reward.description}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "60px",
            backgroundColor: "#f7f7f7",
            borderRadius: "6px",
            padding: "40px",
            textAlign: "center",
            border: "1px solid #e3dfd7",
          }}
        >
          {/* Subtle line accent */}
          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "#ff671b",
              margin: "0 auto 24px auto",
            }}
          ></div>

          <h3
            style={{
              fontSize: "24px",
              fontWeight: "300",
              color: "#141413",
              marginBottom: "12px",
              fontFamily: "Montserrat, Arial, sans-serif",
            }}
          >
            Ready to start earning?
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#74726e",
              marginBottom: "32px",
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: "200",
            }}
          >
            Make sure your Mastercard is enrolled in cash back rewards program
          </p>

          {/* Primary button */}
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
              marginBottom: "16px",
            }}
          >
            Enroll Now
          </button>

          {/* Alternative text link */}
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                color: "#74726e",
                fontSize: "14px",
                fontWeight: "300",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              <span>View terms and conditions</span>
              <div
                style={{
                  width: "16px",
                  height: "1px",
                  backgroundColor: "#74726e",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "-2px",
                    width: "0",
                    height: "0",
                    borderLeft: "4px solid #74726e",
                    borderTop: "2px solid transparent",
                    borderBottom: "2px solid transparent",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
