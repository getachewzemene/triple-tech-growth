'use client';

import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Phone, MapPin, Mail } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Contact form state moved here from ContactSection
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire real submission endpoint
    console.log('Contact form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <footer className="bg-gradient-to-br from-light-blue via-light-blue/95 to-light-blue/90 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow/30 to-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-white/30 to-yellow/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow/20 to-white/30 rounded-full animate-pulse animation-delay-600"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="Triple Technologies Logo" 
                  width={40} 
                  height={40} 
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
                <div className="absolute inset-0 bg-yellow/20 rounded-full scale-0 group-hover:scale-110 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-yellow bg-clip-text text-transparent">
                Triple Technologies
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm">
              Accelerating business growth with smart technologies and impactful innovation.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-yellow hover:to-yellow/80 hover:text-light-blue rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow flex items-center gap-2">
              Quick Links
              <div className="h-[2px] bg-gradient-to-r from-yellow to-transparent flex-1"></div>
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'Services', id: 'services' },
                { name: 'Projects', id: 'projects' },
                { name: 'Why Choose Us', id: 'why-choose-us' },
                { name: 'Team', id: 'team' },
                { name: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-200 hover:text-yellow transition-all duration-300 text-left text-sm hover:translate-x-1 transform block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-yellow">Our Services</h3>
            <ul className="space-y-1">
              {[
                'Web Development',
                'Mobile App Development',
                'Digital Marketing',
                'IT Training',
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-200 hover:text-yellow transition-colors duration-300 cursor-pointer text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3" id='contact'>
            <h3 className="text-lg font-semibold text-yellow">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="text-yellow mt-1" size={16} />
                <div>
                  <p className="text-gray-200 text-sm">
                    Megenagna, Shola Traffic Light,<br />
                    Fenasi Bldg 4<sup>th</sup> floor<br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-yellow" size={16} />
                <a href="tel:+251997466952" className="text-gray-200 hover:text-yellow transition-colors duration-300 text-sm">
                  +251 997 466 952
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-yellow" size={16} />
                <a href="mailto:info@tripletech.com" className="text-gray-200 hover:text-yellow transition-colors duration-300 text-sm">
                  info@tripletech.com
                </a>
              </div>
            </div>
          </div>
            <div className="space-y-3">
                <h4 className="text-xl font-semibold mb-4">Get in touch</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    rows={4}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-yellow text-yellow-foreground hover:bg-yellow/90"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-200 text-center md:text-left text-sm">
              &copy; {currentYear} Triple Technologies. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs">
                Terms of Service
              </a>
              <a href="#" className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;