// app/newsletter/confirmed/page.tsx
import Link from 'next/link';

// Simple button component to avoid shadcn issues
const SimpleButton = ({ 
  children, 
  href, 
  variant = 'default',
  ...props 
}: { 
  children: React.ReactNode;
  href: string;
  variant?: 'default' | 'outline';
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const baseClasses = "w-full inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default function NewsletterConfirmed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Simple Checkmark */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg 
                  className="h-6 w-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Subscribed!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for joining the GeokHub newsletter!
          </p>
          
          <p className="text-gray-500 text-sm mb-6">
            We've sent a confirmation email to your inbox. 
            You'll receive our latest tech insights, lifestyle tips, and exclusive content.
          </p>

          {/* What to Expect */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              What to expect:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Weekly tech news roundups
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Lifestyle & wellness tips
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Exclusive articles and insights
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                No spam - unsubscribe anytime
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <SimpleButton href="/" variant="default">
              <svg 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              Back to Home
            </SimpleButton>
            
            <SimpleButton href="/blogs" variant="outline">
              <svg 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Read Latest Posts
            </SimpleButton>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-400 mt-6">
            Didn't mean to subscribe?{' '}
            <Link href="/newsletter/unsubscribe" className="text-blue-500 hover:underline">
              Unsubscribe here
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center">
              <svg 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
              Secure
            </div>
            <div className="flex items-center">
              <svg 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Instant
            </div>
            <div className="flex items-center">
              <svg 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              No Spam
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}