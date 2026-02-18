import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Check, FileText, Home, Mail } from 'lucide-react';

export default function NewsletterWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome Aboard!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to the GeokHub newsletter. We're excited to have you in our community!
          </p>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-green-800 space-y-1 text-left">
              <li>• Check your inbox for a welcome email</li>
              <li>• Look out for our next newsletter</li>
              <li>• Get exclusive content and updates</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Explore GeokHub
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/technology/gadgets">
                <FileText className="h-4 w-4 mr-2" />
                Read Latest Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}