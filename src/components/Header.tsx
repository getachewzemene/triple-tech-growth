import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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
      navigate('/training');
      setIsMobileMenuOpen(false);
      return;
    }
    
    if (location.pathname !== '/') {
      navigate('/');
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
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || location.pathname === '/training' ? 'bg-light-blue shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className={`flex items-center space-x-3 text-2xl font-bold transition-colors duration-300 ${
          isScrolled ? 'text-white' : 'text-white'
        }`}>
          <img src={logo} alt="Triple Technologies Logo" className="h-8 w-8" />
          <span>Triple Technologies</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-8">
            {[
              { name: 'Home', id: 'hero' },
              { name: 'Services', id: 'services' },
              { name: 'Projects', id: 'projects' },
              { name: 'Why Choose Us', id: 'why-choose-us' },
              { name: 'Training', id: 'training' },
              { name: 'Team', id: 'team' },
              { name: 'Contact Us', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative transition-all duration-300 font-medium ${
                  (activeSection === item.id && location.pathname === '/') || (item.id === 'training' && location.pathname === '/training')
                    ? 'text-yellow after:w-full'
                    : isScrolled 
                      ? 'text-white hover:text-yellow' 
                      : 'text-white hover:text-yellow'
                } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-yellow after:transition-all after:duration-300 hover:after:w-full ${
                  (activeSection === item.id && location.pathname === '/') || (item.id === 'training' && location.pathname === '/training') ? 'after:w-full' : 'after:w-0'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          {/* Profile/Login Button */}
          {user ? (
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              Login
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
                { name: 'Team', id: 'team' },
                { name: 'Contact Us', id: 'contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors duration-300 font-medium text-left py-2 ${
                    (activeSection === item.id && location.pathname === '/') || (item.id === 'training' && location.pathname === '/training')
                      ? 'text-yellow border-l-2 border-yellow pl-4'
                      : 'text-white hover:text-yellow'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Profile/Login Button */}
              <div className="pt-4 border-t border-white/20">
                {user ? (
                  <Button
                    onClick={() => {
                      navigate('/profile');
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
                      navigate('/login');
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
    </header>
  );
};

export default Header;