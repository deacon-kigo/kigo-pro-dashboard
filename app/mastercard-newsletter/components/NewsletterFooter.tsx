export function NewsletterFooter() {
  return (
    <footer className="bg-black text-white px-6 py-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Are you a merchant with questions about Mastercard Local?
        </h3>
        <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
          Contact us
        </button>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <div className="text-xs text-gray-400 leading-relaxed mb-4">
          <p className="mb-2">
            This site is for informational purposes only. The offers described
            on the site are provided to eligible Mastercard cardholders only by
            the local financial institution that issued their eligible
            Mastercard. For questions about the offer that apply to your card,
            please refer to the Terms and Conditions below. Issuers may apply
            additional terms for their cards, therefore please reach out to the
            local financial institution that issued your Mastercard for full
            terms and conditions that may apply to your card. If you wish to
            find out more about how Mastercard respects your privacy when you
            visit any of our websites or pages, the Mastercard Global Privacy
            Notice may be reviewed below.
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <img
              src="/logos/ma_symbol-dark.svg"
              alt="Mastercard"
              className="h-6"
              style={{ minWidth: "86px" }}
            />
          </div>

          <div className="flex space-x-4 text-xs">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              FAQS
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Mastercard.us
            </a>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          © 2021-2025 Mastercard.
        </div>
      </div>

      {/* Email-specific footer */}
      <div className="mt-6 pt-6 border-t border-gray-700 text-xs text-gray-500">
        <p className="mb-2">
          You received this email because you are subscribed to Mastercard Local
          monthly newsletter.
        </p>
        <p className="mb-2">
          <a href="#" className="text-orange-400 hover:text-orange-300">
            Unsubscribe
          </a>{" "}
          |
          <a href="#" className="text-orange-400 hover:text-orange-300 ml-1">
            Update preferences
          </a>{" "}
          |
          <a href="#" className="text-orange-400 hover:text-orange-300 ml-1">
            View in browser
          </a>
        </p>
        <p>
          Mastercard International • 2000 Purchase Street, Purchase, NY 10577
        </p>
      </div>
    </footer>
  );
}
