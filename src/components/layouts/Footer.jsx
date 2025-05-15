import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // You'll need to install react-icons

// Install react-icons: npm install react-icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul>
              <li className="mb-2"><Link to="/features" className="hover:text-white">Features</Link></li>
              <li className="mb-2"><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              {/* Add more product links */}
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul>
              <li className="mb-2"><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li className="mb-2"><Link to="/team" className="hover:text-white">Our Team</Link></li>
              <li className="mb-2"><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li className="mb-2"><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul>
              <li className="mb-2"><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li className="mb-2"><Link to="/help" className="hover:text-white">Help Center</Link></li>
              {/* Add more support links */}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          © 2023 Profile Explorer. All rights reserved.
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;