"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Icons } from "@/components/Icons";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ContactData {
  introText: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  metaDescription: string;
}

interface SocialLink {
  url: string;
  platform: string;
  icon?: string;
}

interface ContactClientPageProps {
  serverData: {
    contactData: ContactData | null;
    socialLinks: SocialLink[];
  };
}

// Fallback data
const fallbackContactData: ContactData = {
  introText: "Have a question or want to work together? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  email: "contact@geokhub.com",
  phone: "+234 802 114 9420",
  address: "Lagos, Nigeria",
  mapEmbedUrl: "",
  metaDescription: "Contact GeoKhub for inquiries, collaborations, and support"
};

const fallbackSocialLinks: SocialLink[] = [
  { platform: "Twitter", url: "https://twitter.com/geokhub" },
  { platform: "LinkedIn", url: "https://linkedin.com/company/geokhub" },
  { platform: "GitHub", url: "https://github.com/kingFred1" },
  { platform: "Facebook", url: "https://facebook.com/geokhub" },
];

export default function ContactClientPage({ serverData }: ContactClientPageProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add safety checks here
  const displayData = serverData?.contactData || fallbackContactData;
  const displaySocialLinks = serverData?.socialLinks?.length > 0 ? serverData.socialLinks : fallbackSocialLinks;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("🎉 Message sent successfully! We'll get back to you within 24 hours.");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-purple-50/10 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container relative max-w-7xl py-8 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 lg:mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Icons.mail className="h-4 w-4" />
            Let&apos;s Connect
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight ">
            Get in Touch
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {displayData.introText}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Contact Information - Left Sidebar */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Contact Info Card */}
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-primary dark:from-white dark:to-primary bg-clip-text text-transparent">
                  Contact Information
                </CardTitle>
                <p className="text-muted-foreground dark:text-gray-300">Reach out through any channel</p>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 dark:to-primary/10 hover:to-primary/10 dark:hover:to-primary/20 transition-all duration-300 group/item">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl group-hover/item:scale-110 transition-transform duration-300">
                    <Icons.mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <a
                      href={`mailto:${displayData.email}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors break-all"
                    >
                      {displayData.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 dark:to-primary/10 hover:to-primary/10 dark:hover:to-primary/20 transition-all duration-300 group/item">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl group-hover/item:scale-110 transition-transform duration-300">
                    <Icons.phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                    <a
                      href={`tel:${displayData.phone.replace(/\D/g, "")}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {displayData.phone}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 dark:to-primary/10 hover:to-primary/10 dark:hover:to-primary/20 transition-all duration-300 group/item">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl group-hover/item:scale-110 transition-transform duration-300">
                    <Icons.mapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
                    <p className="text-gray-600 dark:text-gray-300">{displayData.address}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 dark:to-primary/10 hover:to-primary/10 dark:hover:to-primary/20 transition-all duration-300">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                    <Icons.share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h3>
                    <div className="flex gap-3 flex-wrap">
                      {displaySocialLinks.map((social, index) => (
                        <a
                          key={social.url || index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-300 transform hover:scale-110 group/social"
                          title={social.platform}
                        >
                          {social.platform === "Twitter" && (
                            <Icons.twitter className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/social:text-[#1DA1F2]" />
                          )}
                          {social.platform === "GitHub" && (
                            <Icons.gitHub className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/social:text-gray-900 dark:group-hover/social:text-white" />
                          )}
                          {social.platform === "LinkedIn" && (
                            <Icons.linkedIn className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/social:text-[#0077B5]" />
                          )}
                          {social.platform === "Facebook" && (
                            <Icons.share2 className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/social:text-[#4267B2]" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Card */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icons.phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Quick Response</h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We typically respond to messages within 24 hours. For urgent matters, please include &ldquo;URGENT&rdquo; in your subject line.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-primary/5 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-primary dark:from-white dark:to-primary bg-clip-text text-transparent">
                  Send a Message
                </CardTitle>
                <p className="text-muted-foreground dark:text-gray-300 text-lg">
                  Ready to start a conversation? Fill out the form below and we&apos;ll get back to you promptly.
                </p>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        {...form.register("name")}
                        className="h-12 border-gray-300 dark:border-slate-600 focus:border-primary dark:bg-slate-700/50 dark:text-white transition-all duration-300"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500 dark:text-red-400">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...form.register("email")}
                        className="h-12 border-gray-300 dark:border-slate-600 focus:border-primary dark:bg-slate-700/50 dark:text-white transition-all duration-300"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 dark:text-red-400">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      {...form.register("subject")}
                      className="h-12 border-gray-300 dark:border-slate-600 focus:border-primary dark:bg-slate-700/50 dark:text-white transition-all duration-300"
                    />
                    {form.formState.errors.subject && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry in detail. The more information you provide, the better we can assist you..."
                      className="min-h-[150px] border-gray-300 dark:border-slate-600 focus:border-primary dark:bg-slate-700/50 dark:text-white resize-vertical transition-all duration-300"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden "
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Icons.mail className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
            <Icons.mail className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24h</div>
            <div className="text-sm text-muted-foreground dark:text-gray-300">Avg. Response Time</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
            <Icons.phone className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-sm text-muted-foreground dark:text-gray-300">Response Rate</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
            <Icons.share2 className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
            <div className="text-sm text-muted-foreground dark:text-gray-300">Happy Collaborations</div>
          </div>
        </div>
      </div>
    </div>
  );
}