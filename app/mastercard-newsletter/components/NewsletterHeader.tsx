export function NewsletterHeader() {
  return (
    <header className="px-6 py-4" style={{ backgroundColor: "#141413" }}>
      <div className="flex items-center justify-between">
        {/* Mastercard Logo - Using official logo */}
        <div className="flex items-center">
          <img
            src="/logos/ma_symbol-dark.svg"
            alt="Mastercard"
            className="h-8"
            style={{ minWidth: "120px" }}
          />
        </div>

        {/* Newsletter label */}
        <div
          className="text-sm"
          style={{
            color: "#74726e",
            fontFamily: "Montserrat, Arial, sans-serif",
          }}
        >
          Monthly Newsletter
        </div>
      </div>
    </header>
  );
}
