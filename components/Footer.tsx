// components/Footer.tsx
import Link from 'next/link'
import { Package, Mail, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-blue-400" size={32} />
              <span className="text-xl font-bold">Lost & Found</span>
            </div>
            <p className="text-gray-400 text-sm">
              Helping reunite people with their belongings. Report lost or found items and connect with others in your community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-gray-400 hover:text-white transition">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-400 hover:text-white transition">
                  Report Item
                </Link>
              </li>
              <li>
                <Link href="/my-items" className="text-gray-400 hover:text-white transition">
                  My Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Electronics</li>
              <li>Clothing & Accessories</li>
              <li>Documents & IDs</li>
              <li>Keys & Wallets</li>
              <li>Bags & Luggage</li>
              <li>Pets</li>
              <li>Other Items</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span className="text-sm">support@lostandfound.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Github size={18} />
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Lost & Found. All rights reserved.</p>
          <p className="mt-2">Built with Next.js, Prisma & MongoDB</p>
        </div>
      </div>
    </footer>
  )
}