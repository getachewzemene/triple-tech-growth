import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Phone, MapPin, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

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

  return (
    <footer className="bg-gradient-to-br from-light-blue via-light-blue/95 to-light-blue/90 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Triple Technologies Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">Triple Technologies</span>
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
                  className="w-8 h-8 bg-white/10 hover:bg-yellow hover:text-light-blue rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-yellow">Quick Links</h3>
            <ul className="space-y-1">
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
                    className="text-gray-200 hover:text-yellow transition-colors duration-300 text-left text-sm"
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
          <div className="space-y-3">
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-200 text-center md:text-left text-sm">
              © {currentYear} Triple Technologies. All rights reserved.
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