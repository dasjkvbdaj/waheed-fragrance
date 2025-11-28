# Environment Configuration Guide

## 🔧 Available Configuration Options

### 1. **Store Information** (`src/lib/constants.ts`)

Update these values to match your business:

```typescript
// Your WhatsApp number (include country code, no + or spaces)
// Example: For +1 (555) 123-4567 → "15551234567"
export const WHATSAPP_NUMBER = "1234567890";

// Your Instagram profile URL
export const INSTAGRAM_URL = "https://instagram.com/yourprofile";

// Store branding
export const STORE_NAME = "Luxe Perfumes";
export const STORE_EMAIL = "info@luxeperfumes.com";
```

### 2. **Product Data** (`src/data/perfumes.ts`)

Add your perfumes with this structure:

```typescript
{
  id: "unique-id",                    // Unique identifier (string)
  name: "Fragrance Name",             // Product name
  brand: "Brand Name",                // Brand/manufacturer
  price: 89.99,                       // Price in USD (number)
  size: "100ml",                      // Bottle size
  category: "men",                    // Category: "men" | "women" | "unisex"
  image: "https://image-url.jpg",     // Product image URL (HTTPS only)
  description: "Description text",    // Optional: Product description
  notes: "Top: X, Middle: Y, Base: Z" // Optional: Fragrance notes
}
```

### 3. **Brand Colors** (`tailwind.config.js`)

Customize the entire color scheme:

```javascript
colors: {
  primary: {
    dark: "#0f0f0f",        // Main background
    darker: "#1a1a1a",      // Sidebar/overlay background
    light: "#2a2a2a",       // Cards/components background
  },
  accent: {
    gold: "#d4af37",        // Primary accent color
    silver: "#e8e8e8",      // Secondary accent color
  },
}
```

**Color Palettes to Try:**

**Modern Gold** (Default)
- Dark: #0f0f0f
- Accent: #d4af37

**Silver Luxury**
- Dark: #0a0a0a
- Accent: #e8e8e8

**Rose Gold**
- Dark: #1a0f0f
- Accent: #e75480

**Emerald Green**
- Dark: #0f1a0f
- Accent: #2ecc71

### 4. **Images & Media**

All images should be:
- ✅ HTTPS URLs (secure)
- ✅ JPG or WebP format (optimized)
- ✅ Recommended size: 500x600px minimum
- ✅ Good quality photos recommended

Image hosts:
- Unsplash (used in demo)
- Pexels
- Pixabay
- Your own CDN

### 5. **Typography** (`tailwind.config.js`)

Current font: Inter (system-ui fallback)

To change:
```javascript
fontFamily: {
  sans: ["Your Font", "system-ui", "sans-serif"],
}
```

### 6. **SEO & Meta Tags** (`src/app/layout.tsx`)

Update metadata:

```typescript
export const metadata: Metadata = {
  title: "Your Store Name - Premium Fragrances",
  description: "Your store description for search engines",
  keywords: ["perfume", "fragrance", "luxury"],
  // ... other meta tags
};
```

## 🚀 Deployment Configuration

### Vercel Environment Variables

If you need environment variables (for future payment processing, etc.):

1. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_STORE_ID=your_store_id
```

2. In Vercel Dashboard:
   - Go to Project Settings
   - Navigate to Environment Variables
   - Add your variables

### Domain Setup (Vercel)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Follow DNS setup instructions

## 📊 Analytics (Optional)

To add Google Analytics:

1. Create `.env.local`:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

2. Add to `src/app/layout.tsx`:
```typescript
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `,
    }} />
  </>
)}
```

## 🔒 Security Best Practices

### Secrets to Keep Private
Never commit these to GitHub:
- WhatsApp private credentials
- API keys
- Database passwords
- Sensitive business data

Use `.env.local` for local development:
```
SENSITIVE_DATA_HERE=value
```

And Vercel Environment Variables for production.

### HTTPS Enforcement
- All external images must be HTTPS
- Vercel provides free SSL certificates
- Never use HTTP in production

## 🎯 Performance Optimization

### Image Optimization
- Use Next.js Image component (already done)
- Images are automatically optimized for different sizes
- Lazy loading is automatic

### Code Splitting
- Next.js automatically code-splits
- Pages load only what they need
- Reduces initial bundle size

### Caching
- Static pages are cached by Vercel
- Cache headers are automatically optimized
- CDN distribution is global

## 🌍 Multi-Language Support (Future)

To add translations:

1. Install i18n library:
```bash
npm install next-i18n-router i18next
```

2. Create language files in `public/locales/`
3. Configure in `next.config.js`

## 🎨 Custom Font Setup (Future)

To use a custom font:

1. Add to `src/app/layout.tsx`:
```typescript
import { Inter, Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
```

2. Use in components:
```typescript
<h1 className={playfair.className}>Title</h1>
```

## 🔄 Regular Maintenance

### Weekly
- Monitor analytics
- Check for broken links
- Review new orders

### Monthly
- Update product prices
- Add seasonal fragrances
- Review customer feedback

### Quarterly
- Update dependencies: `npm outdated`
- Review and update SEO
- Analyze traffic patterns

## 📝 Backup & Version Control

### Git Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/perfume.git
git push -u origin main
```

### Backup Checklist
- ✅ GitHub repository (automatic with Vercel)
- ✅ Product database (perfumes.ts)
- ✅ Configuration files
- ✅ Custom images

## ⚡ Quick Reference

### Common Commands
```bash
npm run dev      # Start development
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Check code quality
```

### File Locations
- Products: `src/data/perfumes.ts`
- Config: `src/lib/constants.ts`
- Colors: `tailwind.config.js`
- SEO: `src/app/layout.tsx`

---

For more help, see README.md and SETUP.md
