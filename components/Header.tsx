"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Package, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-900">
              Lost & Found
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive("/browse")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Search size={20} />
              Browse
            </Link>

            <Link
              href="/report"
              className={`px-4 py-2 rounded-lg transition ${
                isActive("/report")
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Report Item
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/my-items"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive("/my-items")
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Package size={20} />
                  My Items
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    <span className="font-medium">{userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link
                href="/browse"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search size={20} />
                Browse
              </Link>

              <Link
                href="/report"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Report Item
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/my-items"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package size={20} />
                    My Items
                  </Link>

                  <div className="px-3 py-2 text-gray-700 font-medium">
                    {userName}
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-600"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
