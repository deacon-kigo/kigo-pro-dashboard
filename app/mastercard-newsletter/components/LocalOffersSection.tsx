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
                borderRadius: "8px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Montserrat, Arial, sans-serif",
                transition: "box-shadow 0.3s ease",
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
                        borderRadius: "16px",
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
                      backgroundColor: "#ff671b",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "300",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {offer.cashBackRate} cash back
                  </div>
                </div>
              </div>

              <div
                style={{ borderTop: "0.5px solid #f0f0f0", paddingTop: "24px" }}
              >
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
                      backgroundColor: "#141413",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "4px",
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

        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <button
            style={{
              backgroundColor: "#ff671b",
              color: "white",
              padding: "16px 32px",
              borderRadius: "4px",
              border: "none",
              fontSize: "16px",
              fontWeight: "300",
              cursor: "pointer",
              fontFamily: "Montserrat, Arial, sans-serif",
            }}
          >
            Find More Local Offers in {userLocation.city}
          </button>
        </div>
      </div>
    </section>
  );
}
