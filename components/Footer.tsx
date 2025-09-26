"use client";

import { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Contact form state moved here from ContactSection
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire real submission endpoint
    console.log("Contact form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
  <footer className="bg-gradient-to-br from-light-blue via-light-blue/95 to-light-blue/90 text-white relative overflow-hidden border-t border-border/20 dark:border-white/10">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow/10 to-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-white/5 to-yellow/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-10 relative z-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6 items-start">
          {/* Enhanced Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Triple Technologies Logo"
                  width={32}
                  height={32}
                  className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                Triple Technologies
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm">
              Accelerating business growth with smart technologies and impactful
              innovation.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-yellow hover:to-yellow/80 hover:text-light-blue rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:rotate-12 backdrop-blur-sm border border-white/20 hover:shadow-lg"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow to-yellow/80 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", id: "hero" },
                { name: "Services", id: "services" },
                { name: "Projects", id: "projects" },
                { name: "Why Choose Us", id: "why-choose-us" },
                { name: "Team", id: "team" },
                { name: "Contact", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-200 hover:text-yellow transition-all duration-300 text-left text-sm group relative overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:text-black dark:group-hover:text-white">
                      {link.name}
                    </span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow to-yellow/80 group-hover:w-full transition-all duration-300"></div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow to-yellow/80 bg-clip-text text-transparent">
              Our Services
            </h3>
            <ul className="space-y-2">
              {[
                "Web Development",
                "Mobile App Development",
                "Digital Marketing",
                "IT Training",
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-200 hover:text-yellow transition-all duration-300 cursor-pointer text-sm group relative overflow-hidden">
                    <span className="relative z-10">{service}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow to-yellow/80 group-hover:w-full transition-all duration-300"></div>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-4" id="contact">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow to-yellow/80 bg-clip-text text-transparent">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 group">
                <MapPin
                  className="text-yellow mt-1 group-hover:scale-110 transition-transform duration-300"
                  size={16}
                />
                <div>
                  <p className="text-gray-200 text-sm group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    Megenagna, Shola Traffic Light,
                    <br />
                    Fenasi Bldg 4<sup>th</sup> floor
                    <br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone
                  className="text-yellow group-hover:scale-110 transition-transform duration-300"
                  size={16}
                />
                <a
                  href="tel:+251997466952"
                  className="text-gray-200 hover:text-yellow transition-colors duration-300 text-sm"
                >
                  +251 997 466 952
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-yellow" size={16} />
                <a
                  href="mailto:info@tripletech.com"
                  className="text-gray-200 hover:text-yellow transition-colors duration-300 text-sm"
                >
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
      <div className="border-t border-border/20 dark:border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-200 text-center md:text-left text-sm">
              &copy; {currentYear} Triple Technologies. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-yellow transition-colors duration-300 text-xs"
              >
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
