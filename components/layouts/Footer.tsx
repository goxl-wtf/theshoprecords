import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 py-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Over TheShopRecords</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              Dé platenzaak voor vinyl liefhebbers. Bekijk ons uitgebreide assortiment van zowel nieuw als tweedehands vinyl.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  Genres
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Klantenservice</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  Verzending
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  Retourneren
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Contact</h3>
            <address className="not-italic text-sm">
              <p className="mb-2">Vinylstraat 123</p>
              <p className="mb-2">1234 AB Amsterdam</p>
              <p className="mb-2">
                <a href="tel:+31201234567" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  +31 20 123 4567
                </a>
              </p>
              <p>
                <a href="mailto:info@theshoprecords.com" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300">
                  info@theshoprecords.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-sm text-center transition-colors duration-300">
          <p>&copy; {new Date().getFullYear()} TheShopRecords. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 