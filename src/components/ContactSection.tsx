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
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
      <div className="h-64 bg-gray-300">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2175051722905!2d-73.98656368459394!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959883234!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Company Location"
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