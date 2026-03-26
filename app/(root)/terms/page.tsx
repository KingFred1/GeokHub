import React from "react";

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {currentDate}
          </p>

          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using GeokHub, you agree to be bound by these
                Terms of Service. If you do not agree, you must not use this
                website.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                2. Description of Service
              </h2>
              <p>
                GeokHub is a digital publishing platform that provides content
                related to world news, business, technology, and lifestyle.
                Content is for informational and educational purposes only.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                3. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>Use the website only for lawful purposes</li>
                <li>Do not attempt to hack, disrupt, or damage the platform</li>
                <li>Do not post false, misleading, or harmful content</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                4. Intellectual Property
              </h2>
              <p>
                All content on GeokHub, including text, images, logos, and design,
                is owned by or licensed to us and is protected by copyright and
                intellectual property laws.
              </p>
              <p className="mt-3">
                You may not reproduce, distribute, or exploit any content without
                prior written permission.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                5. User-Generated Content
              </h2>
              <p className="mb-3">
                By submitting content (comments or other materials), you grant us
                a non-exclusive, royalty-free license to use and display such
                content.
              </p>
              <p>
                You are responsible for your content and must not post anything
                unlawful, abusive, or misleading.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                6. Advertising and Monetization
              </h2>
              <p>
                We may display advertisements, including through third-party
                providers such as Google AdSense. These ads help support the
                operation of the website.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                7. Content Disclaimer
              </h2>
              <p>
                The information provided on GeokHub is for general informational
                purposes only. We do not guarantee the accuracy, completeness, or
                reliability of any content.
              </p>
              <p className="mt-3">
                You use the information at your own risk.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                8. External Links Disclaimer
              </h2>
              <p>
                Our website may contain links to third-party websites. We do not
                control or endorse their content and are not responsible for
                their practices.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                9. Limitation of Liability
              </h2>
              <p>
                We are not liable for any indirect, incidental, or consequential
                damages arising from your use of the website.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                10. Termination
              </h2>
              <p>
                We may suspend or terminate access to the website at any time
                without notice if you violate these Terms.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                11. Changes to Terms
              </h2>
              <p>
                We reserve the right to update these Terms at any time. Continued
                use of the site means you accept the updated Terms.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                12. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and interpreted in accordance
                with the laws of Nigeria.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                13. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <p className="mt-2">Email: legal@geokhub.com</p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;