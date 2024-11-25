import { Link } from "react-router-dom";

export default function OnboardingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-emerald-100 rounded-full opacity-20" />
            </div>
            <div className="relative flex items-center justify-center">
              <svg
                className="w-32 h-32 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Secure Transactions &
            <br />
            Reliable Anytime
          </h1>
          <p className="text-gray-500 text-sm">
            You can get 100% security through our secure transaction. So, you can rely on us.
          </p>
        </div>

        {/* Navigation Dots */}
        <div className="flex pb-5 justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>

        {/* Continue Button */}
        <Link
         to={'/login'} >
        <button
          className="w-full bg-emerald-600 text-white rounded-lg py-3 px-4 hover:bg-emerald-700 transition-colors duration-200"
        >
          Continue
        </button>
         </Link>
      </div>
    </div>
  )
}

