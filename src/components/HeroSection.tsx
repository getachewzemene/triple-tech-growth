import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&showinfo=0&rel=0&modestbranding=1"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Accelerating business growth with smart technologies and impactful innovation.
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-0 animation-delay-300">
          Triple Technologies fuels business growth with smart software, training, and digital marketing.
        </p>
        <Button
          onClick={scrollToContact}
          size="lg"
          className="bg-yellow text-yellow-foreground hover:bg-yellow/90 text-lg px-8 py-4 animate-slide-up opacity-0 animation-delay-600"
        >
          Contact Us
        </Button>
      </div>

      <style>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;