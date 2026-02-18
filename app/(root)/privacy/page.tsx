import React from 'react';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: {currentDate}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">Welcome to GeokHub (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
              <p className="text-gray-700">By using our website, you agree to the collection and use of information in accordance with this policy.</p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Personal Data:</strong> Name, email address, etc., when you voluntarily provide it (e.g., when subscribing to our newsletter or leaving comments).</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</li>
                <li><strong>Cookies:</strong> We use cookies to enhance your experience. You can set your browser to refuse all or some cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide and maintain our website</li>
                <li>To notify you about changes to our website</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our website</li>
                <li>To monitor the usage of our website</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                <li><strong>Business Transfers:</strong> In connection with any merger or sale of company assets.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">5. Data Security</h2>
              <p className="text-gray-700">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">6. Third-Party Links</h2>
              <p className="text-gray-700">Our website may contain links to other sites. We are not responsible for the content or privacy practices of those sites.</p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-gray-700">Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">9. Contact Us</h2>
              <p className="text-gray-700">If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="text-gray-700 mt-2">Email: privacy@geokhub.com</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;