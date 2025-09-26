# Mobile-First CSS Examples

## Using the Mobile-First System

### 1. Including the Stylesheets

#### Option A: Standard CSS (mobile-first.css)
```html
<!-- In your HTML head or Next.js layout -->
<link rel="stylesheet" href="/styles/mobile-first.css">
```

#### Option B: Tailwind Enhanced (tailwind-mobile-first.css)
```css
/* In your main CSS file (e.g., globals.css) */
@import 'tailwindcss/base';
@import '../styles/tailwind-mobile-first.css';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

### 2. Basic Component Examples

#### Responsive Card Component
```html
<!-- Using standard mobile-first classes -->
<div class="mobile-card">
  <h3>Card Title</h3>
  <p class="text-mobile">This card adapts from mobile to desktop seamlessly.</p>
  <button class="mobile-button mobile-button--primary">
    Learn More
  </button>
</div>

<!-- Using Tailwind enhanced classes -->
<div class="card-mobile">
  <h3 class="heading-mobile">Card Title</h3>
  <p class="text-mobile">This card uses Tailwind's enhanced mobile-first system.</p>
  <button class="btn-primary-mobile">
    Learn More
  </button>
</div>
```

#### Responsive Navigation
```html
<!-- Mobile-first navigation -->
<nav class="mobile-nav">
  <div class="container-fluid">
    <div class="flex justify-between items-center">
      <div class="logo">
        <img src="/logo.svg" alt="Company Logo" class="h-8 w-auto">
      </div>
      
      <!-- Mobile menu button -->
      <button class="mobile-button md:hidden" id="mobile-menu-btn">
        <span class="sr-only">Open menu</span>
        <!-- Hamburger icon -->
      </button>
      
      <!-- Desktop navigation -->
      <div class="hidden md:flex space-x-4">
        <a href="#" class="nav-item-mobile">Home</a>
        <a href="#" class="nav-item-mobile">About</a>
        <a href="#" class="nav-item-mobile">Services</a>
        <a href="#" class="nav-item-mobile">Contact</a>
      </div>
    </div>
  </div>
</nav>
```

#### Responsive Grid Layout
```html
<!-- Standard mobile-first grid -->
<div class="mobile-grid">
  <div class="mobile-card">
    <h3>Service 1</h3>
    <p>Description of service 1</p>
  </div>
  <div class="mobile-card">
    <h3>Service 2</h3>
    <p>Description of service 2</p>
  </div>
  <div class="mobile-card">
    <h3>Service 3</h3>
    <p>Description of service 3</p>
  </div>
</div>

<!-- Tailwind enhanced grid -->
<div class="grid-mobile">
  <div class="card-mobile">
    <h3 class="heading-mobile">Service 1</h3>
    <p class="text-mobile">Description of service 1</p>
  </div>
  <div class="card-mobile">
    <h3 class="heading-mobile">Service 2</h3>
    <p class="text-mobile">Description of service 2</p>
  </div>
  <div class="card-mobile">
    <h3 class="heading-mobile">Service 3</h3>
    <p class="text-mobile">Description of service 3</p>
  </div>
</div>
```

### 3. Form Examples

#### Mobile-Optimized Contact Form
```html
<form class="space-mobile">
  <div class="mb-mobile">
    <label for="name" class="block text-sm font-medium mb-2">
      Full Name *
    </label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      class="mobile-input" 
      required
      placeholder="Enter your full name"
    >
  </div>
  
  <div class="mb-mobile">
    <label for="email" class="block text-sm font-medium mb-2">
      Email Address *
    </label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      class="mobile-input" 
      required
      placeholder="you@example.com"
    >
  </div>
  
  <div class="mb-mobile">
    <label for="message" class="block text-sm font-medium mb-2">
      Message *
    </label>
    <textarea 
      id="message" 
      name="message" 
      rows="4" 
      class="mobile-input resize-none" 
      required
      placeholder="Tell us about your project..."
    ></textarea>
  </div>
  
  <button 
    type="submit" 
    class="mobile-button mobile-button--primary w-full"
  >
    Send Message
  </button>
</form>
```

### 4. Responsive Images with Srcset

#### Basic Responsive Image
```html
<!-- Standard responsive image -->
<img 
  src="/images/hero-mobile.jpg"
  srcset="
    /images/hero-mobile.jpg 480w,
    /images/hero-tablet.jpg 768w,
    /images/hero-desktop.jpg 1200w,
    /images/hero-large.jpg 1920w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  "
  alt="Hero image description"
  class="responsive-image"
>

<!-- With aspect ratio container -->
<div class="aspect-video">
  <img 
    src="/images/banner-mobile.jpg"
    srcset="
      /images/banner-mobile.jpg 480w,
      /images/banner-tablet.jpg 768w,
      /images/banner-desktop.jpg 1200w
    "
    sizes="100vw"
    alt="Banner description"
    class="responsive-image object-cover"
  >
</div>
```

### 5. Advanced Layout Examples

#### Hero Section
```html
<section class="section-mobile bg-primary text-primary-foreground">
  <div class="container-fluid text-center-mobile md:text-left-tablet">
    <h1 class="heading-mobile-xl mb-6">
      Welcome to Our Service
    </h1>
    <p class="text-mobile text-lg mb-8 max-w-2xl mx-auto md:mx-0">
      We provide excellent solutions for your business needs with 
      a mobile-first approach that works everywhere.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
      <button class="btn-primary-mobile">
        Get Started
      </button>
      <button class="btn-secondary-mobile">
        Learn More
      </button>
    </div>
  </div>
</section>
```

#### Feature Grid with Icons
```html
<section class="section-mobile">
  <div class="container-fluid">
    <h2 class="heading-mobile text-center mb-12">
      Our Features
    </h2>
    
    <div class="grid-mobile-auto">
      <div class="card-mobile text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <!-- Icon here -->
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <!-- SVG path -->
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Mobile First</h3>
        <p class="text-mobile">
          Designed to work perfectly on mobile devices from the ground up.
        </p>
      </div>
      
      <div class="card-mobile text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <!-- SVG path -->
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Responsive</h3>
        <p class="text-mobile">
          Automatically adapts to any screen size for the best experience.
        </p>
      </div>
      
      <div class="card-mobile text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <!-- SVG path -->
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Accessible</h3>
        <p class="text-mobile">
          Built with accessibility in mind for all users and devices.
        </p>
      </div>
    </div>
  </div>
</section>
```

### 6. Custom CSS Examples

#### Custom Mobile-First Component
```css
/* Custom pricing card component */
.pricing-card {
  /* Mobile: simple stacked layout */
  display: flex;
  flex-direction: column;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: var(--space-6);
  text-align: center;
}

.pricing-card__header {
  margin-bottom: var(--space-4);
}

.pricing-card__price {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: hsl(var(--primary));
  margin-bottom: var(--space-2);
}

.pricing-card__features {
  list-style: none;
  padding: 0;
  margin: var(--space-6) 0;
}

.pricing-card__feature {
  padding: var(--space-2) 0;
  border-bottom: 1px solid hsl(var(--border));
}

.pricing-card__cta {
  margin-top: auto;
}

/* Tablet: enhanced styling */
@media (min-width: 768px) {
  .pricing-card {
    padding: var(--space-8);
  }
  
  .pricing-card__price {
    font-size: var(--text-4xl);
  }
  
  .pricing-card__feature {
    padding: var(--space-3) 0;
  }
}

/* Desktop: premium styling */
@media (min-width: 1024px) {
  .pricing-card {
    padding: var(--space-12);
    transition: transform 0.2s ease-in-out;
  }
  
  .pricing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .pricing-card--featured {
    transform: scale(1.05);
    border-color: hsl(var(--primary));
    position: relative;
  }
  
  .pricing-card--featured::before {
    content: 'Most Popular';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius);
    font-size: var(--text-sm);
    font-weight: 500;
  }
}
```

### 7. JavaScript Integration

#### Responsive Behavior with JavaScript
```javascript
// Responsive navigation toggle
class MobileFirstNavigation {
  constructor() {
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.isOpen = false;
    
    this.bindEvents();
  }
  
  bindEvents() {
    // Mobile menu toggle
    this.mobileMenuBtn?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isOpen) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.mobileMenu?.contains(e.target) && 
          !this.mobileMenuBtn?.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.mobileMenu?.classList.add('active');
    this.mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    this.isOpen = true;
  }
  
  closeMobileMenu() {
    this.mobileMenu?.classList.remove('active');
    this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scroll
    this.isOpen = false;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MobileFirstNavigation();
});
```

### 8. Performance Optimization

#### Lazy Loading Images
```html
<!-- Modern lazy loading with intersection observer -->
<img 
  src="/images/placeholder.jpg"
  data-src="/images/hero-mobile.jpg"
  data-srcset="
    /images/hero-mobile.jpg 480w,
    /images/hero-tablet.jpg 768w,
    /images/hero-desktop.jpg 1200w
  "
  data-sizes="
    (max-width: 768px) 100vw,
    50vw
  "
  alt="Hero image"
  class="responsive-image lazy-load"
  loading="lazy"
>
```

```javascript
// Lazy loading implementation
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      
      if (img.dataset.sizes) {
        img.sizes = img.dataset.sizes;
      }
      
      img.classList.remove('lazy-load');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

### 9. Testing Your Implementation

#### Basic Responsive Test
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile-First Test Page</title>
  <link rel="stylesheet" href="/styles/mobile-first.css">
</head>
<body>
  <header class="mobile-nav">
    <div class="container-fluid">
      <h1>Mobile-First Test</h1>
    </div>
  </header>
  
  <main class="section-mobile">
    <div class="container-fluid">
      <div class="mobile-grid">
        <div class="mobile-card">
          <h2>Test Card 1</h2>
          <p class="text-mobile">This should look good on all screen sizes.</p>
          <button class="mobile-button mobile-button--primary">
            Test Button
          </button>
        </div>
        
        <div class="mobile-card">
          <h2>Test Card 2</h2>
          <p class="text-mobile">Check how this adapts across breakpoints.</p>
          <button class="mobile-button mobile-button--secondary">
            Test Button
          </button>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
```

## Usage Tips

1. **Start with Mobile**: Always design and code for mobile first
2. **Use Relative Units**: Prefer `rem`, `em`, and `%` over `px`
3. **Test Early**: Check on real devices frequently
4. **Progressive Enhancement**: Add features for larger screens
5. **Touch Targets**: Ensure minimum 44px for interactive elements
6. **Performance**: Optimize images and lazy load when possible
7. **Accessibility**: Test with screen readers and keyboard navigation