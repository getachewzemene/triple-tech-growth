'use client';

import { useState, useEffect } from 'react';
import { Menu, X, User, Sun, Moon, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useThemeToggle } from '@/hooks/use-theme-toggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserAuthModal from '@/components/UserAuthModal';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { language, setLanguage, getLanguageDisplayName } = useLanguage();
  const { toggleTheme, isDark } = useThemeToggle();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = ['hero', 'services', 'projects', 'why-choose-us', 'training', 'team', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'training') {
      router.push('/training');
      setIsMobileMenuOpen(false);
      return;
    }
    
    if (id === 'courses') {
      router.push('/courses');
      setIsMobileMenuOpen(false);
      return;
    }
    
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <TooltipProvider>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || pathname === '/training' || pathname === '/courses' 
          ? 'bg-light-blue/95 backdrop-blur-md shadow-2xl border-b border-white/10' 
          : 'bg-transparent'
        }`}
      >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className={`flex items-center space-x-3 text-2xl font-bold transition-all duration-500 transform hover:scale-105 ${
          isScrolled ? 'text-white' : 'text-white'
        }`}>
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="Triple Technologies Logo" 
              width={32} 
              height={32} 
              className="transition-all duration-300 hover:rotate-12 hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-light-blue/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
            Triple Technologies
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex space-x-4">
            {[
              { name: 'Home', id: 'hero' },
              { name: 'Services', id: 'services' },
              { name: 'Projects', id: 'projects' },
              { name: 'Why Choose Us', id: 'why-choose-us' },
              { name: 'Training', id: 'training' },
              ...(user ? [{ name: 'Courses', id: 'courses' }] : []),
              { name: 'Team', id: 'team' },
              { name: 'Contact Us', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative transition-all duration-500 font-medium px-2 py-2 rounded-lg group text-sm ${
                  (activeSection === item.id && pathname === '/') || 
                  (item.id === 'training' && pathname === '/training') ||
                  (item.id === 'courses' && pathname === '/courses')
                    ? 'text-yellow bg-white/10 after:w-full'
                    : isScrolled 
                      ? 'text-white hover:text-yellow hover:bg-white/10' 
                      : 'text-white hover:text-yellow hover:bg-white/10'
                } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:h-[3px] after:bg-gradient-to-r after:from-yellow after:to-yellow/70 after:transition-all after:duration-500 after:rounded-full group-hover:after:w-full ${
                  (activeSection === item.id && pathname === '/') || 
                  (item.id === 'training' && pathname === '/training') ||
                  (item.id === 'courses' && pathname === '/courses') ? 'after:w-8' : 'after:w-0'
                } transform hover:scale-105`}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-light-blue/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </nav>
          
          {/* Theme and Language Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="sm"
                  className="bg-transparent text-white hover:bg-white/10 transition-all duration-500 transform hover:scale-105 h-8 w-8"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {isDark ? 'Light' : 'Dark'} Mode</p>
              </TooltipContent>
            </Tooltip>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-transparent text-white hover:bg-white/10 transition-all duration-500 transform hover:scale-105 h-8 px-2"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">
                    {language.toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-[100]"
              >
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'en' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                >
                  <span className="font-medium">🇺🇸 English</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('am')}
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'am' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                >
                  <span className="font-medium">🇪🇹 አማርኛ</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('or')}
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'or' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                >
                  <span className="font-medium">🇪🇹 Oromiffa</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Profile/Login Button */}
          {user ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push('/profile')}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/30 text-white hover:bg-gradient-to-r hover:from-yellow hover:to-yellow/80 hover:text-light-blue hover:border-yellow transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/30 text-white hover:bg-gradient-to-r hover:from-yellow hover:to-yellow/80 hover:text-light-blue hover:border-yellow transition-all duration-500 transform hover:scale-105 backdrop-blur-sm hover:shadow-lg"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-light-blue/20 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden transition-colors duration-300 ${
            isScrolled ? 'text-white' : 'text-white'
          }`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Modal */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-light-blue shadow-lg md:hidden z-40">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'Services', id: 'services' },
                { name: 'Projects', id: 'projects' },
                { name: 'Why Choose Us', id: 'why-choose-us' },
                { name: 'Training', id: 'training' },
                ...(user ? [{ name: 'Courses', id: 'courses' }] : []),
                { name: 'Team', id: 'team' },
                { name: 'Contact Us', id: 'contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors duration-300 font-medium text-left py-2 ${
                    (activeSection === item.id && pathname === '/') || 
                    (item.id === 'training' && pathname === '/training') ||
                    (item.id === 'courses' && pathname === '/courses')
                      ? 'text-yellow border-l-2 border-yellow pl-4'
                      : 'text-white hover:text-yellow'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Theme and Language Controls */}
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="text-white text-sm font-medium">Settings</div>
                
                {/* Theme Toggle */}
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary justify-start"
                >
                  {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </Button>
                
                {/* Language Selection */}
                <div className="space-y-2">
                  <div className="text-white text-xs">Language:</div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setLanguage('en')}
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${language === 'en' 
                        ? 'bg-yellow text-light-blue hover:bg-yellow/90' 
                        : 'bg-transparent border-white text-white hover:bg-white hover:text-primary'
                      }`}
                    >
                      EN
                    </Button>
                    <Button
                      onClick={() => setLanguage('am')}
                      variant={language === 'am' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${language === 'am' 
                        ? 'bg-yellow text-light-blue hover:bg-yellow/90' 
                        : 'bg-transparent border-white text-white hover:bg-white hover:text-primary'
                      }`}
                    >
                      አማ
                    </Button>
                    <Button
                      onClick={() => setLanguage('or')}
                      variant={language === 'or' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${language === 'or' 
                        ? 'bg-yellow text-light-blue hover:bg-yellow/90' 
                        : 'bg-transparent border-white text-white hover:bg-white hover:text-primary'
                      }`}
                    >
                      OR
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Profile/Login Button */}
              <div className="pt-4 border-t border-white/20">
                {user ? (
                  <Button
                    onClick={() => {
                      router.push('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* User Authentication Modal */}
      <UserAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      </header>
    </TooltipProvider>
  );
};

export default Header;