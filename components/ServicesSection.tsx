'use client';

import { Code, Smartphone, TrendingUp, GraduationCap, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices for optimal performance.',
      features: ['React/Next.js', 'Node.js', 'Cloud Deployment'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile apps that provide exceptional user experiences across all devices.',
      features: ['React Native', 'Flutter', 'iOS/Android'],
      color: 'from-green-500 to-green-700'
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies to boost your online presence and drive business growth.',
      features: ['SEO', 'Social Media', 'Content Marketing'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      icon: GraduationCap,
      title: 'IT Training and Consultancy',
      description: 'Expert training and consultancy services to upskill your team and optimize your technology stack.',
      features: ['Technical Training', 'Code Review', 'Architecture Design'],
      color: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-yellow">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive technology solutions to accelerate your business growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-light-blue transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full group-hover:bg-yellow/20 group-hover:text-yellow-foreground transition-colors duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* CTA Button */}
                <Button 
                  variant="outline" 
                  className="group-hover:bg-light-blue group-hover:text-white group-hover:border-light-blue transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;