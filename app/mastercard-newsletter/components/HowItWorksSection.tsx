export function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Find offers",
      description: "Browse and search offers within the offers experience.",
      icon: (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      title: "Show and Save Offers",
      description:
        "These are high-value, local deals you can redeem at the point of sales for instant savings.",
      icon: (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 3,
      title: "Cash Back Offers",
      description:
        "Enroll your eligible Mastercard and swipe to earn cash back at participating businesses.",
      icon: (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section className="px-6 py-12 bg-white">
      <div className="mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          How it works
        </h2>
        <div className="w-16 h-1 bg-orange-400 mx-auto"></div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
        {steps.map((step) => (
          <div key={step.id} className="text-center">
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Start earning cash back today with your Mastercard
        </p>
        <button className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
}
