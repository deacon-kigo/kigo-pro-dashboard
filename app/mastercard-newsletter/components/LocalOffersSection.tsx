interface UserLocation {
  city: string;
  state: string;
  country: string;
}

interface LocalOffersSectionProps {
  userLocation: UserLocation;
}

interface LocalOffer {
  id: string;
  businessName: string;
  category: string;
  offer: string;
  description: string;
  validUntil: string;
  cashBackRate: string;
}

export function LocalOffersSection({ userLocation }: LocalOffersSectionProps) {
  // Mock data for local offers - in real implementation, this would be fetched based on location
  const localOffers: LocalOffer[] = [
    {
      id: "1",
      businessName: "Bloom & Brew Cafe",
      category: "Coffee & Dining",
      offer: "15% off your order",
      description:
        "Artisan coffee and fresh pastries in downtown " + userLocation.city,
      validUntil: "End of month",
      cashBackRate: "5%",
    },
    {
      id: "2",
      businessName: "Verde Garden Center",
      category: "Home & Garden",
      offer: "$10 off orders over $50",
      description: "Local plants and gardening supplies",
      validUntil: "This week only",
      cashBackRate: "5%",
    },
    {
      id: "3",
      businessName: "Main Street Books",
      category: "Books & Culture",
      offer: "Buy 2, Get 1 Free",
      description: "Independent bookstore supporting local authors",
      validUntil: "Next 2 weeks",
      cashBackRate: "5%",
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
            Exclusive offers in {userLocation.city}
          </h2>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "200",
              color: "#74726e",
              fontFamily: "Montserrat, Arial, sans-serif",
              lineHeight: "1.6",
            }}
          >
            Discover local businesses in your area and earn cash back with every
            purchase
          </p>
        </div>

        <div
          style={{ display: "grid", gap: "32px", gridTemplateColumns: "1fr" }}
        >
          {localOffers.map((offer) => (
            <div
              key={offer.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "6px",
                padding: "32px",
                border: "1px solid #f0f0f0",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                }}
              >
                <div style={{ flex: "1" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "300",
                        color: "#141413",
                        margin: "0",
                      }}
                    >
                      {offer.businessName}
                    </h3>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#f7f7f7",
                        color: "#74726e",
                        fontWeight: "400",
                      }}
                    >
                      {offer.category}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#74726e",
                      lineHeight: "1.5",
                      margin: "0",
                    }}
                  >
                    {offer.description}
                  </p>
                </div>
                <div style={{ marginLeft: "24px" }}>
                  <div
                    style={{
                      backgroundColor: "#f7f7f7",
                      color: "#ff671b",
                      fontSize: "14px",
                      fontWeight: "400",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                      border: "1px solid #ff671b",
                    }}
                  >
                    {offer.cashBackRate} cash back
                  </div>
                </div>
              </div>

              <div
                style={{ borderTop: "0.5px solid #f0f0f0", paddingTop: "24px" }}
              >
                {/* Orange accent line for offer visibility */}
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    backgroundColor: "#ff671b",
                    marginBottom: "16px",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "300",
                        color: "#141413",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {offer.offer}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#74726e",
                        margin: "0",
                      }}
                    >
                      Valid until {offer.validUntil}
                    </p>
                  </div>
                  <button
                    style={{
                      backgroundColor: "#ff671b",
                      color: "#ffffff",
                      padding: "12px 24px",
                      borderRadius: "20px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "300",
                      cursor: "pointer",
                      fontFamily: "Montserrat, Arial, sans-serif",
                    }}
                  >
                    View Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow-style CTA for variation */}
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "40px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              color: "#141413",
              fontSize: "16px",
              fontWeight: "300",
              fontFamily: "Montserrat, Arial, sans-serif",
            }}
          >
            <span>Find more local offers in {userLocation.city}</span>
            <div
              style={{
                width: "24px",
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
        </div>
      </div>
    </section>
  );
}
