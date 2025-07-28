import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="bg-light-blue text-light-blue-foreground">
      {/* Contact Footer */}
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Triple Technologies</h3>
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="w-5 h-5" />
                <span>+251 997 466 952</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="w-5 h-5" />
                <span>Megenagna, Shola Trafic Light, Fenasi Bldg 4<sup>th</sup> floor</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-5 h-5" />
                <span>
                  <a href="mailto:info@tripletech.com">info@tripletech.com</a>
                </span>
                </div>
          
              </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <FaFacebookF className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />
                <FaTwitter className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />
                <FaLinkedinIn className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />
                <FaInstagram className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />
                <FaTelegramPlane className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />
                <FaEnvelope className="w-6 h-6 hover:text-yellow transition-colors cursor-pointer" />

              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Get In Touch</h4>
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
      </div>

      {/* Google Map */}
      <div className="h-64 md:h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d213.25016210377703!2d38.794672956140744!3d9.02006823267653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85005f5bf7d9%3A0xdb4918396ab3f0d5!2sTriple%20Technologies!5e1!3m2!1sen!2set!4v1752069101685!5m2!1sen!2set"
          width="80%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Triple Technologies Location"
        />
      </div>

      {/* Copyright */}
      <div className="py-6 text-center border-t border-white/20">
        <p>&copy; 2025 Triple Technologies. All rights reserved.</p>
      </div>
    </section>
  );
};

export default ContactSection;