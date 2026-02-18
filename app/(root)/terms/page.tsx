import React from 'react';

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Last updated: {currentDate}</p>

          <div className="space-y-4">
            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">1. Acceptance of Terms</h2>
              <p className="text-gray-700 ">
                By accessing and using GeokHub, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">2. Description of Service</h2>
              <p className="text-gray-700">
                GeokHub provides a platform for reading and sharing blog content about [describe your blog&apos;s focus]. 
                We reserve the right to modify or discontinue the service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-2">When using our Site, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate information when creating an account (if applicable)</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Not use the Site for any illegal or unauthorized purpose</li>
                <li>Not interfere with or disrupt the Site&apos;s operation</li>
                <li>Not upload or share content that violates intellectual property rights</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">4. Intellectual Property</h2>
              <p className="text-gray-700 mb-2">
                All content on the Site, including text, graphics, logos, and software, is the property of GeokHub or 
                its content suppliers and protected by intellectual property laws.
              </p>
              <p className="text-gray-700">
                You may access and use the content for personal, non-commercial purposes only. Any other use requires 
                prior written permission from GeokHub.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">5. User-Generated Content</h2>
              <p className="text-gray-700 mb-2">
                If you submit content to the Site (comments, posts, etc.), you grant GeokHub a non-exclusive, 
                royalty-free license to use, display, and distribute that content.
              </p>
              <p className="text-gray-700">
                You are solely responsible for any content you submit and agree not to post:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                <li>Content that is unlawful, harmful, or offensive</li>
                <li>Content that infringes on intellectual property rights</li>
                <li>Spam or unauthorized promotional content</li>
                <li>False or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">6. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to the Site immediately, without prior notice, for any reason, 
                including if you breach these Terms. All provisions of these Terms which should survive termination will do so.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">7. Disclaimers</h2>
              <p className="text-gray-700 mb-2">
                The Site is provided &quot;as is&quot; without warranties of any kind. GeokHub does not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The Site will be uninterrupted or error-free</li>
                <li>The content is accurate, complete, or reliable</li>
                <li>The Site is free of viruses or other harmful components</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                GeokHub shall not be liable for any indirect, incidental, special, or consequential damages resulting 
                from your use of or inability to use the Site, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by 
                posting the new Terms on this page. Your continued use of the Site after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">10. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by the laws of [Your Country/State] without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-gray-900 font-semibold mb-2">11. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">Email: legal@geokhub.com</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;