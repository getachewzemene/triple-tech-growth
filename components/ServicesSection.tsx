'use client';

import { Code, Smartphone, TrendingUp, GraduationCap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    <section id="services" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Services</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-12">
          We provide comprehensive technology solutions to accelerate your business growth
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              <service.icon className="card-icon w-12 h-12 mb-4 transition-colors duration-300 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="card-description mb-4">{service.description}</p>
              
              {/* Features */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full transition-colors duration-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;