"use client";
import Link from "next/link";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { NewsletterForm } from "./global/Newsletter-form";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
          <Link href="/" className="truncate text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 bg-[length:200%_auto] animate-gradient-flow md:text-3xl text-xl font-bold [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              GeokHub
            </Link>
            <p className="mt-4 text-sm">
              Your go-to platform for insightful content, world news, technology news, and tutorials.
              Stay curious. Stay informed.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://x.com/GeokHub" aria-label="X" className="hover:text-accent transition">
                <FaXTwitter size={20} />
              </Link>
              <Link href="https://web.facebook.com/profile.php?id=61564829390122" aria-label="Facebook" className="hover:text-accent transition">
                <FaFacebookF size={20} />
              </Link>
              <Link href="https://www.linkedin.com/company/geokhub" aria-label="LinkedIn" className="hover:text-accent transition">
                <FaLinkedinIn size={20} />
              </Link>
              <Link href="https://www.youtube.com/@GeokHub" aria-label="YouTube" className="hover:text-accent transition">
                <FaYoutube size={20} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Explore</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/technology/ai" className="hover:underline">Blogs</Link></li>
              <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Services or Support */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/contact" className="hover:underline">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
          <NewsletterForm variant="minimal" />

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} GeokHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
