import React from "react";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {currentDate}
          </p>

          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                1. Introduction
              </h2>
              <p>
                Welcome to GeokHub ("we," "our," or "us"). We are committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website.
              </p>
              <p className="mt-3">
                By using our website, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We may collect the following types of information:
              </p>

              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Personal Data:</strong> Name, email address, or other
                  details you voluntarily provide (e.g., newsletter signup or
                  comments).
                </li>

                <li>
                  <strong>Usage Data:</strong> Information such as IP address,
                  browser type, pages visited, and time spent on pages.
                </li>

                <li>
                  <strong>Cookies and Tracking Technologies:</strong> We use
                  cookies and similar technologies to enhance your experience.
                  Third-party vendors, including Google, may use cookies to
                  serve ads based on your prior visits to this or other websites.
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                3. How We Use Your Information
              </h2>

              <ul className="list-disc pl-6 space-y-3">
                <li>To provide and maintain our website</li>
                <li>To improve user experience and content</li>
                <li>To communicate updates or changes</li>
                <li>To provide customer support</li>
                <li>To monitor usage and performance</li>
                <li>To detect and prevent technical issues</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                4. Data Sharing and Disclosure
              </h2>

              <p className="mb-4">
                We do not sell your personal data. We may share information in
                the following cases:
              </p>

              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors that
                  help operate our website.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or to
                  protect our rights.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of a merger,
                  acquisition, or asset sale.
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                5. Data Security
              </h2>
              <p>
                We use appropriate security measures to protect your data.
                However, no method of transmission over the Internet is 100%
                secure.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                6. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not
                responsible for their privacy practices or content.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                7. Children's Privacy
              </h2>
              <p>
                Our website is not intended for children under 13. We do not
                knowingly collect personal data from children.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will
                be posted on this page.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, contact us:
              </p>
              <p className="mt-2">Email: privacy@geokhub.com</p>
            </section>

            {/* 10 - ADSENSE */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                10. Advertising and Third-Party Services
              </h2>

              <p className="mb-4">
                We may use third-party advertising companies, including Google
                AdSense, to serve ads when you visit our website.
              </p>

              <p className="mb-4">
                Google uses cookies (such as the DoubleClick cookie) to serve
                ads to users based on their visits to this and other websites.
              </p>

              <p>
                You can opt out of personalized advertising by visiting Google
                Ads Settings.
              </p>
            </section>

            {/* 11 - ANALYTICS */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                11. Analytics
              </h2>
              <p>
                We may use third-party analytics tools to monitor and analyze
                website traffic. These tools may collect information such as IP
                address, browser type, and pages visited.
              </p>
            </section>

            {/* 12 - USER RIGHTS */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                12. Your Data Rights
              </h2>

              <p className="mb-3">
                You have the right to access, update, or delete your personal
                data.
              </p>

              <p>
                To request changes or deletion, contact us using the information
                provided above.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;