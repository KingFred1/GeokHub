import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - GeokHub AI & Cybersecurity",
  description: "Legal disclaimer for AI and cybersecurity content on GeokHub",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        
        <section>
          <h2 className="text-xl font-semibold mb-3">AI Content Disclaimer</h2>
          <p>
            The information provided on GeokHub regarding Artificial Intelligence 
            is for informational and educational purposes only. AI technologies 
            are rapidly evolving, and while we strive for accuracy, we cannot 
            guarantee that all information is current or error-free.
          </p>
          <p className="mt-2">
            Any decisions you make based on our AI-related content are your sole 
            responsibility. We recommend consulting with qualified AI professionals 
            before implementing any AI solutions in production environments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Cybersecurity Disclaimer</h2>
          <p>
            The cybersecurity information, tools, and best practices discussed on 
            GeokHub are provided for educational purposes only. Security threats 
            evolve constantly, and no security measure is 100% effective.
          </p>
          <p className="mt-2">
            We strongly recommend consulting with certified security professionals 
            for your specific security needs. GeokHub is not liable for any damages 
            or losses resulting from the implementation or lack thereof of any 
            security recommendations found on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">External Links</h2>
          <p>
            Our website may contain links to external websites. We are not 
            responsible for the content, accuracy, or practices of these third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">No Professional Advice</h2>
          <p>
            The content on GeokHub is not intended to substitute for professional 
            advice. Always seek the advice of qualified professionals regarding 
            any AI implementation or cybersecurity concerns.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Affiliate Disclosure</h2>
          <p>
            Some links on GeokHub may be affiliate links. This means we may earn 
            a commission if you purchase through those links, at no additional 
            cost to you. We only recommend products and services we genuinely 
            believe provide value.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have questions about this disclaimer, please contact us at:
            <br />
            <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8 pt-4 border-t">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}