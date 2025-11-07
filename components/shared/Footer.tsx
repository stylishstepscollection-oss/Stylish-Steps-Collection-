'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Logo from '@/public/SSC.png';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulate newsletter subscription
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const footerLinks = {
    shop: [
      { label: "Men's Collection", href: '/products?category=men' },
      { label: "Women's Collection", href: '/products?category=women' },
      { label: 'Accessories', href: '/products?category=accessories' },
      { label: 'Customization', href: '/products?category=custom' },
      { label: 'Featured Products', href: '/products?featured=true' },
    ],
    customer: [
      { label: 'My Account', href: '/profile' },
      { label: 'My Orders', href: '/order' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Measurements', href: '/measurement' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/help#shipping' },
      { label: 'Returns', href: '/help#returns' },
      { label: 'Size Guide', href: '/measurement' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about#story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: Phone,
      href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}`,
      color: 'hover:text-green-500',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`,
      color: 'hover:text-pink-500',
    },
    {
      name: 'Snapchat',
      icon: Send,
      href: `https://snapchat.com/add/${process.env.NEXT_PUBLIC_SNAPCHAT_USERNAME}`,
      color: 'hover:text-yellow-400',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/stylishstyle',
      color: 'hover:text-blue-500',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/stylishstyle',
      color: 'hover:text-sky-500',
    },
  ];

  return (
    <footer className="bg-card border-t mt-auto pb-7">
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-accent-gold rounded-xl overflow-hidden">
                <Image
                  src={Logo}
                  alt="Stylish Steps Collection"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Stylish Steps Collection</h3>
                <p className="text-xs text-muted-foreground">Step into Style</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your destination for premium clothing and accessories. We bring style, quality,
              and affordability together.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-muted transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Phone</p>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+233 XX XXX XXXX'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Email</p>
              <p className="text-sm text-muted-foreground">stylishstepscollection@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Location</p>
              <p className="text-sm text-muted-foreground">Kumasi, Ghana</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Stylish Steps Collection. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-muted rounded text-xs font-medium">Cash</div>
              <div className="px-3 py-1 bg-muted rounded text-xs font-medium">Mobile Money</div>
              <div className="px-3 py-1 bg-muted rounded text-xs font-medium">Bank Transfer</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}