# Responsive Design QA Checklist

## Overview
This checklist ensures comprehensive testing of responsive design implementations across devices, browsers, and accessibility requirements.

## Testing Viewport Widths

### Critical Breakpoints to Test

| Device Category | Width (px) | Height (px) | Notes |
|----------------|------------|-------------|-------|
| **Mobile Portrait** | 320 | 568 | iPhone SE (smallest modern) |
| **Mobile Portrait** | 375 | 667 | iPhone 8, iPhone SE 2022 |
| **Mobile Portrait** | 390 | 844 | iPhone 12, 13, 14 |
| **Mobile Portrait** | 414 | 896 | iPhone 11 Pro Max |
| **Mobile Landscape** | 667 | 375 | iPhone 8 landscape |
| **Mobile Landscape** | 844 | 390 | iPhone 12 landscape |
| **Tablet Portrait** | 768 | 1024 | iPad, iPad Air |
| **Tablet Portrait** | 820 | 1180 | iPad Air |
| **Tablet Landscape** | 1024 | 768 | iPad landscape |
| **Small Desktop** | 1280 | 720 | Small laptop |
| **Desktop** | 1440 | 900 | Common desktop |
| **Large Desktop** | 1920 | 1080 | Full HD |
| **Ultra-wide** | 2560 | 1440 | 4K/Ultra-wide |

### Additional Test Widths
- **320px** - Absolute minimum
- **360px** - Android small
- **480px** - Large mobile
- **768px** - Tablet breakpoint
- **1024px** - Desktop breakpoint
- **1440px** - Large desktop

## Pre-Development Checklist

### ✅ Setup Verification
- [ ] Viewport meta tag is properly configured
- [ ] Mobile-first CSS architecture is in place
- [ ] Breakpoints follow mobile-first approach (`min-width`)
- [ ] Base styles are optimized for mobile (320px+)
- [ ] Touch targets meet minimum 44px requirement

### ✅ Design System Check
- [ ] Typography scales appropriately across breakpoints
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Spacing system is consistent and scalable
- [ ] Interactive elements have proper focus states

## Layout & Visual Testing

### ✅ Mobile (320px - 767px)
- [ ] **Content flows properly** in single column
- [ ] **Navigation is accessible** and touch-friendly
- [ ] **Images scale correctly** without breaking layout
- [ ] **Text remains readable** at all mobile sizes
- [ ] **Forms are easy to complete** on small screens
- [ ] **Touch targets are minimum 44px** with adequate spacing
- [ ] **Content doesn't overflow** horizontally
- [ ] **Buttons are thumb-friendly** and properly sized

### ✅ Tablet (768px - 1023px)
- [ ] **Layout transitions smoothly** from mobile
- [ ] **Multi-column layouts work** without crowding
- [ ] **Navigation adapts appropriately** for tablet use
- [ ] **Touch and mouse interactions** both function
- [ ] **Content density is optimized** for medium screens
- [ ] **Images and media scale** without pixelation

### ✅ Desktop (1024px+)
- [ ] **Full feature set is available** and accessible
- [ ] **Multi-column layouts** maximize screen real estate
- [ ] **Hover states work properly** for mouse users
- [ ] **Keyboard navigation** is fully functional
- [ ] **Content doesn't stretch** excessively on wide screens
- [ ] **Focus indicators** are clearly visible

## Functional Testing

### ✅ Navigation
- [ ] **Mobile menu** opens/closes correctly
- [ ] **All menu items** are accessible and functional
- [ ] **Touch targets** are large enough (44px minimum)
- [ ] **Keyboard navigation** works through all menu items
- [ ] **Focus states** are clearly visible
- [ ] **Menu doesn't interfere** with content scrolling

### ✅ Forms
- [ ] **Form fields** are properly sized for touch input
- [ ] **Labels are clearly associated** with inputs
- [ ] **Error messages** display appropriately
- [ ] **Submit buttons** are easily accessible
- [ ] **Input types** trigger correct mobile keyboards
- [ ] **Form validation** works across all devices

### ✅ Images and Media
- [ ] **Images load at appropriate sizes** for each breakpoint
- [ ] **Alt text is provided** for all images
- [ ] **Videos are responsive** and don't break layout
- [ ] **Lazy loading** works correctly
- [ ] **Images don't pixelate** when scaled
- [ ] **Media controls** are accessible on touch devices

### ✅ Interactive Elements
- [ ] **Buttons respond to touch** and mouse input
- [ ] **Links have clear focus states** for keyboard users
- [ ] **Dropdowns and modals** work on all devices
- [ ] **Drag and drop** degrades gracefully on mobile
- [ ] **Tooltips adapt** for touch interfaces
- [ ] **Animations respect** reduced motion preferences

## Performance Testing

### ✅ Loading Performance
- [ ] **Initial page load** is under 3 seconds on 3G
- [ ] **Images are optimized** and served at correct sizes
- [ ] **CSS and JS are minified** and compressed
- [ ] **Critical CSS** is inlined for above-fold content
- [ ] **Web fonts load** without causing layout shift
- [ ] **Progressive enhancement** works when JS fails

### ✅ Runtime Performance
- [ ] **Scrolling is smooth** on mobile devices
- [ ] **Animations don't cause** frame drops
- [ ] **Memory usage** remains reasonable
- [ ] **Touch interactions** have minimal delay
- [ ] **App remains responsive** during loading states

## Accessibility Testing

### ✅ Screen Reader Compatibility
- [ ] **Page structure** is logical with proper headings
- [ ] **Alt text describes** images meaningfully
- [ ] **Form labels** are properly associated
- [ ] **Error messages** are announced clearly
- [ ] **Focus management** works correctly in modals
- [ ] **Dynamic content changes** are announced

### ✅ Keyboard Navigation
- [ ] **All interactive elements** are keyboard accessible
- [ ] **Focus order** is logical and predictable
- [ ] **Focus indicators** are clearly visible
- [ ] **Skip links** allow bypassing navigation
- [ ] **Custom controls** have proper ARIA labels
- [ ] **Tab traps** work correctly in modals

### ✅ Touch and Motor Accessibility
- [ ] **Touch targets** meet 44px minimum size
- [ ] **Spacing between targets** prevents accidental taps
- [ ] **Drag operations** have keyboard alternatives
- [ ] **Time limits** can be extended or disabled
- [ ] **Motion animations** can be disabled

## Browser and Device Testing

### ✅ Mobile Browsers
- [ ] **Safari iOS** (current and previous versions)
- [ ] **Chrome Android** (current version)
- [ ] **Samsung Internet** (Android)
- [ ] **Firefox Mobile** (Android)
- [ ] **Edge Mobile** (Android)

### ✅ Desktop Browsers
- [ ] **Chrome** (current and previous versions)
- [ ] **Safari** (current and previous versions)
- [ ] **Firefox** (current and previous versions)
- [ ] **Edge** (current version)

### ✅ Device Testing
- [ ] **iPhone** (multiple sizes and orientations)
- [ ] **Android phones** (various screen sizes)
- [ ] **iPad** (portrait and landscape)
- [ ] **Android tablets** (various sizes)
- [ ] **Desktop** (multiple resolutions)

## Edge Cases and Stress Testing

### ✅ Content Stress Tests
- [ ] **Very long text** doesn't break layout
- [ ] **Short content** still looks good
- [ ] **Missing images** don't break design
- [ ] **JavaScript disabled** still provides core functionality
- [ ] **Slow network conditions** show appropriate loading states
- [ ] **High contrast mode** maintains usability

### ✅ User Preference Testing
- [ ] **Dark mode** works correctly if supported
- [ ] **Reduced motion** preferences are respected
- [ ] **High contrast** preferences work
- [ ] **Large text** settings don't break layout
- [ ] **Right-to-left** languages display correctly

## Tools for Testing

### Browser DevTools
- **Chrome DevTools** - Device simulation and performance
- **Firefox DevTools** - Grid/Flexbox debugging
- **Safari DevTools** - iOS-specific testing

### Testing Tools
- **Lighthouse** - Performance and accessibility auditing
- **axe DevTools** - Accessibility testing
- **WAVE** - Web accessibility evaluation
- **Responsively** - Multi-viewport testing

### Real Device Testing
- **BrowserStack** - Cross-browser cloud testing
- **Sauce Labs** - Automated mobile testing
- **Physical devices** - Nothing replaces real device testing

## Sign-off Criteria

### ✅ Development Team Sign-off
- [ ] All breakpoints tested and working
- [ ] Performance benchmarks met
- [ ] Code review completed
- [ ] Accessibility standards met

### ✅ QA Team Sign-off
- [ ] All checklist items verified
- [ ] Cross-browser testing completed
- [ ] Real device testing performed
- [ ] Edge cases documented and handled

### ✅ Product Team Sign-off
- [ ] User experience meets requirements
- [ ] Design implementation matches specifications
- [ ] Business requirements fulfilled
- [ ] Stakeholder approval obtained

## Post-Launch Monitoring

### ✅ Analytics Setup
- [ ] **Mobile vs desktop usage** tracking
- [ ] **Bounce rate by device** monitoring
- [ ] **Performance metrics** collection
- [ ] **Error tracking** for responsive issues

### ✅ User Feedback
- [ ] **Usability testing** on actual devices
- [ ] **User feedback collection** system
- [ ] **Bug reporting** process established
- [ ] **Continuous improvement** plan in place

---

## Quick Reference: Testing Commands

### Browser DevTools Shortcuts
- **Chrome**: F12, then Ctrl+Shift+M (responsive mode)
- **Firefox**: F12, then Ctrl+Shift+M (responsive mode)
- **Safari**: Cmd+Option+I, then Cmd+Shift+M (responsive mode)

### Lighthouse CLI
```bash
npx lighthouse --view --preset=desktop https://your-site.com
npx lighthouse --view --preset=mobile https://your-site.com
```

### Accessibility Testing
```bash
# Install axe-cli
npm install -g @axe-core/cli

# Run accessibility test
axe https://your-site.com
```

---

**Remember**: This checklist should be used iteratively throughout development, not just at the end. Early and frequent testing prevents major responsive design issues.