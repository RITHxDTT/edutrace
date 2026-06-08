import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const footerLinks = {
  product: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ],
  features: [
    { label: 'Task Management', href: '#' },
    { label: 'Peer Collaboration', href: '#' },
    { label: 'Progress Tracking', href: '#' },
    { label: 'Instructor Insights', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-linear-purple text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/images/logo/edutraceLogo.png" alt="Edutrace" width={56} height={36} className="object-contain" />
              <span className="text-xl font-semibold">Edutrace</span>
            </div>
            <p className="text-sm leading-relaxed text-white/70 max-w-xs">
              A collaborative educational hub bridging the gap between classroom teaching and student understanding — with real-time tasks, notifications, and instructor support.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Edutrace · KSHRD Center. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
