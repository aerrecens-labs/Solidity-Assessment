/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        // 1. Mobile & Small Tablet (600 - 743)
        'nexus-7': '600px',       // Nexus 7
        'small-tab': '600px',     // Generic Small Tablet

        // 2. Tablets (744 - 1023)
        'ipad-mini': '744px',     // iPad Mini 6
        'ipad-std': '768px',      // Standard iPad Portrait
        'fire-hd': '800px',       // Fire HD 8
        'ipad-10': '810px',       // iPad 10.2"
        'ipad-air': '820px',      // iPad Air 4/5
        'ipad-pro-11': '834px',   // iPad Pro 11"

        // 3. Large Tablet & Content Assets (1024 - 1279)
        'xga': '1024px',          // Old XGA Monitor
        'ipad-pro-12': '1024px',  // iPad Pro 12.9" Portrait
        'social-sq': '1080px',    // Instagram Square
        'social-port': '1080px',  // Instagram Portrait
        'android-res': '1080px',  // Modern Android
        'fb-link': '1200px',      // Facebook Link

        // 4. Laptop & Desktop Standard (1280 - 1600)
        'hd-720': '1280px',       // 720p Screen
        'steam-deck': '1280px',   // Steam Deck
        'laptop-budget': '1366px',// Budget Laptop (1366x768)
        'mac-air-13': '1440px',   // MacBook Air 13"
        'qhd-vert': '1440px',     // QHD Vertical
        'surface-go': '1536px',   // Surface Laptop Go
        'hd-plus': '1600px',      // HD+ Monitor

        // 5. Full HD & High Res (1920 - 2400)
        'fhd': '1920px',          // Full HD 1080p
        'wuxga': '1920px',        // WUXGA (1920x1200) - utilizing width
        'ipad-retina': '2048px',  // iPad Retina
        'surface-pro-3': '2160px',// Surface Pro 3
        'surface-studio': '2256px',// Surface Laptop Studio
        'mac-12': '2304px',       // MacBook 12"

        // 6. 2K, Ultrawide & 4K (2560+)
        'qhd': '2560px',          // QHD 2K
        'mac-pro-13': '2560px',   // MacBook Pro 13"
        'ipad-pro-phys': '2732px',// iPad Pro 12.9" Physical
        'mac-pro-15': '2880px',   // MacBook Pro 15"
        'mac-pro-14': '3024px',   // MacBook Pro 14"
        'ultrawide': '3440px',    // Ultrawide 21:9
        'mac-pro-16': '3456px',   // MacBook Pro 16"
        '4k': '3840px',           // 4K UHD
      },
      colors: {
        midnight: '#0f172a',
        coolgray: '#1e293b',
        electric: '#a855f7',
        royal: '#F5BD02',
      },
      boxShadow: {
        card: '0 10px 20px rgba(15, 23, 42, 0.08)',
        hover: '0 14px 28px rgba(15, 23, 42, 0.12)'
      },
      borderRadius: {
        xl: '0.75rem'
      }
    }
  },
  plugins: []
}


