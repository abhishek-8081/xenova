"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { usePathname } from "next/navigation";

const Header = () => {
  const { isAuthenticated, logoutMutation } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full z-50 bg-transparent px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight text-black font-dm-sans">
        xenova
      </Link>

      <nav className="hidden md:flex items-center gap-10">
        {[
          { label: "Home", href: "/" },
          { label: "Trade", href: "/marketplace" },
          { label: "Docs", href: "/docs" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-sm font-dm-sans transition-colors ${
              pathname === href ? "text-black font-semibold" : "text-gray-500 hover:text-black"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link href="/marketplace" className="text-sm font-dm-sans text-gray-600 hover:text-black transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm font-dm-sans border-2 border-black bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-dm-sans border-2 border-black bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-dm-sans bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border border-gray-200 px-6 py-5 flex flex-col gap-4 shadow-sm z-50">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-dm-sans text-gray-700">Home</Link>
          <Link href="/marketplace" onClick={() => setMenuOpen(false)} className="text-sm font-dm-sans text-gray-700">Trade</Link>
          <Link href="/docs" onClick={() => setMenuOpen(false)} className="text-sm font-dm-sans text-gray-700">Docs</Link>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-dm-sans border-2 border-black px-5 py-2 rounded-xl font-semibold">Login</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-dm-sans bg-black text-white px-5 py-2 rounded-xl font-semibold">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
