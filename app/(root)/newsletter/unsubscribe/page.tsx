"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeftIcon, MailIcon } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("You've been unsubscribed from our newsletter.");
      setEmail('');
    } catch (error) {
      toast.error("Failed to unsubscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MailIcon className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unsubscribe from Newsletter
          </h1>
          
          <p className="text-gray-600 mb-6">
            We're sorry to see you go! Enter your email address to unsubscribe from our newsletter.
          </p>

          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !email}
              variant="destructive"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Unsubscribing...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Unsubscribe
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Changed your mind?
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}