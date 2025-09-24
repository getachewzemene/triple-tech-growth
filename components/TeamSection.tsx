'use client';

import { User, Mail, Phone, Linkedin, Github, Globe, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
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

  const teamMembers = [
    {
      title: 'CEO',
      name: 'Tsegaselassie Kindye',
      description: 'Visionary leader with a passion for technology and innovation.',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      expertise: ['Strategic Leadership', 'Business Development', 'Innovation Management'],
      experience: '10+ Years',
      socialLinks: [
        { icon: Mail, href: 'mailto:ceo@tripletech.com', label: 'Email' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Globe, href: '#', label: 'Website' }
      ]
    },
    {
      title: 'CTO',
      name: 'Getachew Zemene',
      description: 'Tech visionary with a focus on product development and innovation.',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      expertise: ['Full-Stack Development', 'System Architecture', 'Team Leadership'],
      experience: '8+ Years',
      socialLinks: [
        { icon: Mail, href: 'mailto:cto@tripletech.com', label: 'Email' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' }
      ]
    },
    {
      title: 'CMO',
      name: 'Dagim Wondale',
      description: 'Marketing guru with a knack for driving brand growth and engagement.',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      expertise: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking'],
      experience: '6+ Years',
      socialLinks: [
        { icon: Mail, href: 'mailto:cmo@tripletech.com', label: 'Email' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Globe, href: '#', label: 'Portfolio' }
      ]
    }
  ];

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-background from-white via-gray-50 to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-light-blue/15 to-yellow/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-yellow/15 to-light-blue/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 text-light-blue" />
            <span className="text-sm font-medium text-gray-600">Meet Our Expert Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the passionate professionals behind Triple Technologies' success
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.title}
              className={`group relative overflow-hidden rounded-3xl bg-card shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer border border-border ${
                isVisible ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Background gradient overlay (behind content) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${member.bgGradient} opacity-0 group-hover:opacity-60 transition-all duration-500 pointer-events-none z-0`}></div>
              
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${member.gradient}`}></div>
              
              {/* Content */}
              <div className="relative z-20 p-8">
                {/* Experience badge */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${member.gradient} text-white text-xs font-semibold`}>
                    {member.experience}
                  </div>
                </div>
                
                {/* Avatar + Member Info (centered) */}
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div className={`p-6 rounded-full bg-gradient-to-br ${member.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg card-icon`}>
                    <User className="w-12 h-12 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 transition-all duration-300 group-hover:text-black dark:group-hover:text-white">
                      {member.name}
                    </h3>
                    <h4 className={`text-lg font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`}>
                      {member.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {member.description}
                    </p>
                  </div>
                </div>
                {/* Status indicator (absolute) */}
                <div className="absolute bottom-2 right-6 w-4 h-4 bg-green-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                
                {/* Expertise */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-800 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300">Expertise:</h5>
                  <div className="space-y-2">
                    {member.expertise.map((skill, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}
                        style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${member.gradient}`}></div>
                        <span className="text-xs text-gray-600">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Social links */}
                <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {member.socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className={`p-2 rounded-full bg-gradient-to-r ${member.gradient} text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      style={{ transitionDelay: `${idx * 100 + 300}ms` }}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${member.gradient} opacity-20 blur-xl transform scale-110`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;