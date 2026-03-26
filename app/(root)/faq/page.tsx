"use client";
import React, { useState } from "react";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is GeokHub?",
      answer:
        "GeokHub is a digital publishing platform that delivers high-quality content across world news, business, technology, and lifestyle. Our goal is to provide accurate, timely, and insightful information to help readers stay informed and make better decisions.",
    },
    {
      question: "Is GeokHub free to use?",
      answer:
        "Yes, GeokHub is completely free to access. All articles and resources are available at no cost. We may introduce optional premium features in the future, but our core content will remain free.",
    },
    {
      question: "How often do you publish new content?",
      answer:
        "We publish new content daily across multiple categories, including news, technology, and lifestyle topics. Stay updated by subscribing to our newsletter.",
    },
    {
      question: "How can I subscribe to your newsletter?",
      answer:
        "You can subscribe by entering your email address in the newsletter form available on our website. Subscribers receive updates on new articles and important content.",
    },
    {
      question: "Can I contribute to GeokHub?",
      answer:
        "Yes, we welcome contributions from qualified writers and industry experts. If you're interested, please contact us at contribute@geokhub.com with your ideas and writing samples.",
    },
    {
      question: "How do you ensure content accuracy?",
      answer:
        "We strive to provide accurate and reliable information by reviewing sources and maintaining editorial standards. However, we recommend verifying critical information independently when necessary.",
    },
    {
      question: "Do you display advertisements?",
      answer:
        "Yes, we may display advertisements, including those served by third-party providers such as Google AdSense. These ads help us keep the platform free for users.",
    },
    {
      question: "Can I republish content from GeokHub?",
      answer:
        "All content on GeokHub is protected by copyright. You may share excerpts with proper attribution and a link back to the original article. For full republication requests, contact permissions@geokhub.com.",
    },
    {
      question: "How can I report a problem or technical issue?",
      answer:
        "If you experience any issues, please contact support@geokhub.com with details about the problem, including your device and browser information.",
    },
    {
      question: "Where can I find your Privacy Policy and Terms?",
      answer:
        "You can view our Privacy Policy and Terms of Service directly on our website. These pages explain how we handle your data and the rules for using our platform.",
    },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about GeokHub
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                className={`w-full flex justify-between items-center p-4 md:p-6 text-left transition ${
                  activeIndex === index
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                  {faq.question}
                </h2>

                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-300 transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? "pb-4 md:pb-6 max-h-screen"
                    : "max-h-0"
                }`}
              >
                <p className="text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-700 dark:text-gray-400 mb-6">
            We&apos;re here to help. Reach out to our support team and we&apos;ll get back
            to you as soon as possible.
          </p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>

      </div>
    </main>
  );
};

export default FAQPage;