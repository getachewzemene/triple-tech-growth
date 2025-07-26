import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-light-blue shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className={`text-2xl font-bold transition-colors duration-300 ${
          isScrolled ? 'text-foreground' : 'text-white'
        }`}>
          Triple Technologies
        </div>
        
        <nav className="hidden md:flex space-x-8">
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
              className={`transition-colors duration-300 font-medium ${
                isScrolled 
                  ? 'text-foreground hover:text-yellow' 
                  : 'text-white hover:text-yellow'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;