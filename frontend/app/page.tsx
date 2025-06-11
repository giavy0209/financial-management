/** @format */

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Financial Command Center
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Take control of your financial future with our comprehensive
          management solution. Track, analyze, and optimize your money flow all
          in one place.
        </p>
      </section>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">
            Expense Tracking
          </h3>
          <p className="text-gray-600">
            Easily monitor your spending patterns with detailed categorization
            and real-time updates. Never miss a transaction or lose track of
            your expenses again.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">
            Budget Management
          </h3>
          <p className="text-gray-600">
            Create and manage custom budgets for different categories. Set
            goals, track progress, and receive alerts when you&apos;re
            approaching limits.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">
            Financial Insights
          </h3>
          <p className="text-gray-600">
            Get powerful insights into your financial health with interactive
            charts and reports. Make informed decisions based on your spending
            and saving patterns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">
            Secure & Private
          </h3>
          <p className="text-gray-600">
            Your financial data is protected with industry-standard encryption.
            We prioritize your privacy and security at every step.
          </p>
        </div>
      </div>

      {/* Getting Started Section */}
      <section className="bg-indigo-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Getting Started is Easy
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-medium">
              1
            </div>
            <p className="ml-4 text-gray-600">
              Create your account and set up your profile
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-medium">
              2
            </div>
            <p className="ml-4 text-gray-600">
              Connect your accounts or start adding transactions manually
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-medium">
              3
            </div>
            <p className="ml-4 text-gray-600">
              Set up your budget categories and financial goals
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of users who are already managing their finances
          smarter.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
          Start Managing Your Money
        </button>
      </section>
    </div>
  )
}
