import Link from "next/link"
import { Search, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-8 w-8 text-green-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-900 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-green-400">Crop Care</span>
            </div>
            <p className="text-sm text-gray-300 max-w-xs">
              Predicting Crop Diseases and providing recommendation, on which crop to harvest
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/disease-prediction" className="text-gray-300 hover:text-green-400 transition-colors">
                  Disease Prediction
                </Link>
              </li>
              <li>
                <Link href="/recommendation" className="text-gray-300 hover:text-green-400 transition-colors">
                  Recommendation
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-gray-300 hover:text-green-400 transition-colors">
                  Weather
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-green-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Developer Team & Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center space-y-2">
          <div>
            <h4 className="font-semibold mb-2">Developer Team</h4>
            <p className="text-gray-300 text-sm">Debangshu Roy • Prasenjit Datta • Subhrajit Ghosh</p>
          </div>
          <p className="text-gray-400 text-sm">© 2025 Crop Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
