import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./styles/**/*.css",
	],
	prefix: "",
	theme: {
		// Mobile-first breakpoints (Tailwind default is already mobile-first)
		screens: {
			'xs': '480px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1920px',
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				xs: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '3rem',
				xl: '4rem',
				'2xl': '5rem',
			},
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'light-blue': {
					DEFAULT: 'hsl(var(--light-blue))',
					foreground: 'hsl(var(--light-blue-foreground))'
				},
				'yellow': {
					DEFAULT: 'hsl(var(--yellow))',
					foreground: 'hsl(var(--yellow-foreground))'
				},
				'light-gray': {
					DEFAULT: 'hsl(var(--light-gray))',
					foreground: 'hsl(var(--light-gray-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			// Enhanced spacing scale for mobile-first design
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			// Mobile-optimized font sizes
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'fluid-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
				'fluid-base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
				'fluid-lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.5' }],
				'fluid-xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.4' }],
				'fluid-2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3' }],
				'fluid-3xl': ['clamp(1.875rem, 5vw, 3rem)', { lineHeight: '1.2' }],
				'fluid-4xl': ['clamp(2.25rem, 6vw, 4rem)', { lineHeight: '1.1' }],
			},
			// Touch-friendly minimum sizes
			minHeight: {
				'touch': '44px',
				'touch-lg': '48px',
			},
			minWidth: {
				'touch': '44px',
				'touch-lg': '48px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
