"use client"
import React, { useState } from 'react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is GeokHub?",
      answer: "GeokHub is a blog platform dedicated to update on news, techology, health, sport and lot more... We provide insightful articles, resources, and community discussions about health, technology, politics, sport and lot more..."
    },
    {
      question: "How can I subscribe to your newsletter?",
      answer: "You can subscribe to our newsletter by entering your email in the subscription form at the bottom of our website. We will send you updates about new posts and special content."
    },
    {
      question: "Is GeokHub free to use?",
      answer: "Yes, GeokHub is completely free to access and read. All our content is available without charge. In the future, we may offer premium features, but core content will remain free."
    },
    {
      question: "How often do you publish new content?",
      answer: "We aim to publish new articles Very day. You can subscribe to our newsletter to get notified when new content is available."
    },
    {
      question: "Can I contribute to GeokHub?",
      answer: "We are always open to collaborations with qualified writers. If you are interested in contributing, please contact us at contribute@geokhub.com with your ideas and writing samples."
    },
    {
      question: "How can I report an issue with the website?",
      answer: "If you encounter any technical issues, please email us at support@geokhub.com with details about the problem you are experiencing, including which browser and device you are using."
    },
    {
      question: "Do you have a comment policy?",
      answer: "Yes, we encourage thoughtful discussion but require all comments to be respectful and on-topic. We reserve the right to remove comments that contain spam, hate speech, or personal attacks."
    },
    {
      question: "Can I republish your content on my site?",
      answer: "Our content is protected by copyright. For republishing requests, please contact us at permissions@geokhub.com. We typically allow excerpts with proper attribution and links back to the original post."
    },
    {
      question: "How can I advertise on GeokHub?",
      answer: "We offer limited advertising opportunities. Please contact ads@geokhub.com for our media kit and advertising rates."
    },
    {
      question: "Where can I find your privacy policy?",
      answer: "Our privacy policy is available at privacy@geokhub.com. It explains how we collect, use, and protect your personal information."
    }
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 dark:text-gray-100">Find answers to common questions about GeokHub</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className={`w-full flex justify-between items-center p-4 md:p-6 text-left focus:outline-none ${activeIndex === index ? 'bg-gray-50 dark:bg-card' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-${index}`}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{faq.question}</h2>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-100 transition-transform ${activeIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-${index}`}
                className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'pb-4 md:pb-6 max-h-screen' : 'max-h-0'}`}
                aria-hidden={activeIndex !== index}
              >
                <p className="text-gray-700 dark:text-gray-100">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-6 md:p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-700 mb-6">We are here to help! Contact us at support@geokhub.com and we will get back to you as soon as possible.</p>
          <a
            href="/contact"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
};

export default FAQPage;