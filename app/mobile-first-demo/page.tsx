'use client';

import React from 'react';
import Link from 'next/link';

export default function MobileFirstDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Include the mobile-first CSS */}
      <style jsx global>{`
        @import url('/styles/mobile-first.css');
      `}</style>

      {/* Mobile-First Navigation */}
      <nav className="mobile-nav">
        <div className="container-fluid">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Mobile-First Demo
            </Link>
            <Link 
              href="/" 
              className="mobile-button mobile-button--secondary text-sm"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Mobile-First Design */}
      <section className="section-mobile pt-24">
        <div className="container-fluid text-center">
          <h1 className="heading-mobile-xl mb-6">
            Mobile-First Responsive Design
          </h1>
          <p className="text-mobile text-lg mb-8 max-w-3xl mx-auto">
            This page demonstrates the mobile-first CSS system implemented for Triple Technologies.
            Resize your browser or view on different devices to see the responsive behavior.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="mobile-button mobile-button--primary">
              Primary Action
            </button>
            <button className="mobile-button mobile-button--secondary">
              Secondary Action
            </button>
          </div>
        </div>
      </section>

      {/* Responsive Grid Demo */}
      <section className="section-mobile bg-muted/50">
        <div className="container-fluid">
          <h2 className="heading-mobile text-center mb-8">
            Responsive Grid System
          </h2>
          <p className="text-mobile text-center mb-12 max-w-2xl mx-auto">
            This grid automatically adapts: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens.
          </p>
          
          <div className="mobile-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="mobile-card text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{item}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Card {item}</h3>
                <p className="text-mobile">
                  This card demonstrates responsive behavior with proper touch targets and spacing.
                </p>
                <button className="mobile-button mobile-button--primary mt-4">
                  Touch-Friendly Button
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Demo */}
      <section className="section-mobile">
        <div className="container-fluid max-w-2xl">
          <div className="mobile-card">
            <h2 className="heading-mobile text-center mb-6">
              Mobile-Optimized Form
            </h2>
            <p className="text-mobile text-center mb-8">
              All form elements are optimized for touch with minimum 44px touch targets.
            </p>
            
            <form className="space-mobile">
              <div className="mb-mobile">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="mobile-input" 
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-mobile">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="mobile-input" 
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="mb-mobile">
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="mobile-input" 
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="mb-mobile">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <select id="subject" className="mobile-input">
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
              
              <div className="mb-mobile">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="mobile-input resize-none" 
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <div className="mb-mobile">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-sm">
                    I agree to the terms and conditions and privacy policy.
                  </span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="mobile-button mobile-button--primary w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Responsive Images Demo */}
      <section className="section-mobile bg-muted/30">
        <div className="container-fluid">
          <h2 className="heading-mobile text-center mb-8">
            Responsive Images & Media
          </h2>
          
          <div className="mobile-grid mb-12">
            <div className="mobile-card">
              <h3 className="text-xl font-semibold mb-4">Square Aspect Ratio</h3>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-primary font-semibold">1:1 Aspect</span>
              </div>
              <p className="text-mobile">
                Perfect for profile pictures, logos, and square content.
              </p>
            </div>
            
            <div className="mobile-card">
              <h3 className="text-xl font-semibold mb-4">Video Aspect Ratio</h3>
              <div className="aspect-video bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">16:9 Video</span>
              </div>
              <p className="text-mobile">
                Standard video aspect ratio, responsive across all devices.
              </p>
            </div>
            
            <div className="mobile-card">
              <h3 className="text-xl font-semibold mb-4">Portrait Aspect Ratio</h3>
              <div className="aspect-portrait bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-accent-foreground font-semibold">3:4 Portrait</span>
              </div>
              <p className="text-mobile">
                Great for mobile-first portrait images and content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-mobile bg-primary text-primary-foreground">
        <div className="container-fluid text-center">
          <p className="text-mobile">
            Mobile-First CSS System Demo - Triple Technologies
          </p>
          <p className="text-sm mt-2 opacity-80">
            Resize your browser or test on different devices to see responsive behavior
          </p>
        </div>
      </footer>
    </div>
  );
}