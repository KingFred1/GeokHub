"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { CheckIcon, FileTextIcon, HomeIcon, MailIcon, Star, Users } from "lucide-react";
import { FaSpinner } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function NewsletterLandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Welcome to our newsletter! Check your email for confirmation.");
      form.reset();
      
      // Optional: Redirect after success
      setTimeout(() => {
        window.location.href = '/newsletter/welcome';
      }, 2000);
      
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30">
              <MailIcon className="h-3 w-3 mr-2 text-blue-300" />
              <span className="text-sm font-medium text-blue-200">Join Our Community</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Don't Miss Out on
              <span className="text-blue-300 block">The Latest Insights</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed">
              You were invited to join exclusive updates from GeokHub. Get curated content on technology, lifestyle, and innovation delivered directly to your inbox.
            </p>

            {/* Benefits List */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <CheckIcon className="h-5 w-5 mr-3 text-green-400" />
                <span>Weekly tech news & gadget reviews</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckIcon className="h-5 w-5 mr-3 text-green-400" />
                <span>Lifestyle tips & wellness guides</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FileTextIcon className="h-5 w-5 mr-3 text-green-400" />
                <span>Exclusive content & early access</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckIcon className="h-5 w-5 mr-3 text-green-400" />
                <span>No spam - Unsubscribe anytime</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-300" />
                <span className="text-sm text-gray-400">Join 10,000+ readers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">4.8/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join Now
              </h2>
              <p className="text-blue-200">
                Enter your email to get started
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-300 text-sm mt-2">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <MailIcon className="mr-2 h-5 w-5" />
                    Subscribe to Newsletter
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Assurance */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Alternative Actions */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-gray-400 text-sm mb-4">
                Not ready to subscribe?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <a href="/">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Browse Site
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <a href="/technology/gadgets">
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Read Posts
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">Trusted by readers from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-semibold">Tech Companies</div>
            <div className="text-white font-semibold">Startups</div>
            <div className="text-white font-semibold">Developers</div>
            <div className="text-white font-semibold">Designers</div>
          </div>
        </div>
      </div>
    </div>
  );
}