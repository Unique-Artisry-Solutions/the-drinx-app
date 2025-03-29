
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Bold color palette from image
				spiritless: {
					pink: '#D94E8F',      // Pink - #D94E8F (217, 78, 143)
					'pink-light': '#FF6EAF', // Lighter pink for hover states
					'pink-dark': '#B43973', // Darker pink for active states
					green: '#84BF04',     // Green - #84BF04 (132, 191, 4)
					'green-light': '#A4DF24', // Lighter green for hover states
					'green-dark': '#648F03', // Darker green for active states
					orange: '#F29F05',    // Orange - #F29F05 (242, 159, 5)
					'orange-light': '#FFBF25', // Lighter orange for hover states
					'orange-dark': '#D28704', // Darker orange for active states
					'bright-orange': '#F28705', // Bright Orange - #F28705 (242, 135, 5)
					'bright-orange-light': '#FFA725', // Lighter bright orange for hover
					'bright-orange-dark': '#D27504', // Darker bright orange for active
					burgundy: '#590202',  // Burgundy - #590202 (89, 2, 2)
					'burgundy-light': '#791919', // Lighter burgundy for hover states
					'burgundy-dark': '#3A0101', // Darker burgundy for active states
				},
				material: {
					'primary': '#D94E8F',      // Pink as primary
					'on-primary': '#FFFFFF',
					'primary-container': '#FFECF4',
					'on-primary-container': '#3E1428',
					'secondary': '#84BF04',    // Green as secondary
					'on-secondary': '#FFFFFF',
					'secondary-container': '#F0FFE0',
					'on-secondary-container': '#253601',
					'tertiary': '#F29F05',     // Orange as tertiary
					'on-tertiary': '#FFFFFF',
					'tertiary-container': '#FFF0DC',
					'on-tertiary-container': '#462E01',
					'surface': '#FEF7FF',
					'on-surface': '#1C1B1F',
					'surface-variant': '#E7E0EB',
					'on-surface-variant': '#49454E',
					'outline': '#79747E',
					'background': '#FEF7FF',
					'on-background': '#1C1B1F',
					'error': '#590202',        // Burgundy as error
					'on-error': '#FFFFFF',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'bold': '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
				'bold-pink': '0 10px 25px -5px rgba(217, 78, 143, 0.3)',
				'bold-green': '0 10px 25px -5px rgba(132, 191, 4, 0.3)',
				'bold-orange': '0 10px 25px -5px rgba(242, 159, 5, 0.3)',
				'bold-burgundy': '0 10px 25px -5px rgba(89, 2, 2, 0.3)',
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
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'fade-out': 'fade-out 0.3s ease-in-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			fontFamily: {
				'roboto': ['Roboto', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-pink': 'linear-gradient(135deg, #D94E8F 0%, #FF6EAF 100%)',
				'gradient-green': 'linear-gradient(135deg, #84BF04 0%, #A4DF24 100%)',
				'gradient-orange': 'linear-gradient(135deg, #F29F05 0%, #FFBF25 100%)',
				'gradient-burgundy': 'linear-gradient(135deg, #590202 0%, #791919 100%)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
