# Luxe Perfumes - Setup & Deployment Guide

## 📦 Installation Complete ✓

Your complete perfume e-commerce website has been created! All files are in place.

## 🚀 Quick Start

### 1. Complete Dependencies Installation
If npm install is still running, wait for it to complete. You should see `added X packages`.

### 2. Start Development Server
```bash
npm run dev
```

Then open: http://localhost:3000

### 3. Build for Production
```bash
npm run build
npm start
```

## 📋 What's Included

### ✨ Core Features
- ✅ Responsive homepage with hero section
- ✅ Product catalog with filtering and search
- ✅ Individual product pages
- ✅ Shopping cart with localStorage persistence
- ✅ About page with brand story
- ✅ Contact page with WhatsApp integration
- ✅ Dark theme with gold accents

### 🎨 Design & UX
- Dark, premium design (black, charcoal, dark gray)
- Gold and silver accents
- Smooth animations and transitions
- Mobile-responsive on all devices
- SEO-optimized with meta tags

### 🔧 Technical Stack
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Image Optimization** - Fast loading

## 📝 Quick Configuration

### 1. Update Contact Information
Edit `src/lib/constants.ts`:

```typescript
export const WHATSAPP_NUMBER = "YOUR_WHATSAPP_NUMBER"; // e.g., "1234567890" with country code
export const INSTAGRAM_URL = "https://instagram.com/yourprofile";
export const STORE_NAME = "Luxe Perfumes";
export const STORE_EMAIL = "info@luxeperfumes.com";
```

### 2. Add Your Perfumes
Edit `src/data/perfumes.ts`:

Add perfume entries like:
```typescript
{
  id: "9",
  name: "Your Perfume Name",
  brand: "Brand Name",
  price: 99.99,
  size: "100ml",
  category: "men" | "women" | "unisex",
  image: "https://your-image-url.jpg",
  description: "Description here",
  notes: "Top: X, Middle: Y, Base: Z"
}
```

### 3. Customize Colors (Optional)
Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: {
    dark: "#0f0f0f",      // Main background
    darker: "#1a1a1a",    // Secondary background
    light: "#2a2a2a",     // Light background
  },
  accent: {
    gold: "#d4af37",      // Primary accent
    silver: "#e8e8e8",    // Secondary accent
  },
}
```

## 🌐 Deployment to Vercel

### Method 1: Automatic (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/perfume.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project" and import your GitHub repository

4. Vercel will automatically detect Next.js and deploy

5. Your site will be live in minutes!

### Method 2: Manual Deployment

1. Build locally:
   ```bash
   npm run build
   ```

2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

3. Deploy:
   ```bash
   vercel
   ```

Follow the prompts and your site will be deployed!

## 📊 File Structure Recap

```
perfume/
├── src/app/               # Pages
│   ├── page.tsx          # Home page
│   ├── catalog/          # Product listing
│   ├── product/[id]/     # Product details
│   ├── cart/             # Shopping cart
│   ├── about/            # About page
│   └── contact/          # Contact page
├── src/components/        # Reusable components
├── src/data/             # Product database (perfumes.ts)
├── src/lib/              # Utilities & store
├── tailwind.config.js    # Tailwind config
├── next.config.js        # Next.js config
└── package.json          # Dependencies
```

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. ⭕ Update `src/lib/constants.ts` with your info
4. ⭕ Add your perfumes to `src/data/perfumes.ts`
5. ⭕ Customize colors in `tailwind.config.js`
6. ⭕ Deploy to Vercel

## 💡 Features to Explore

### Cart System
- Add items to cart (persist to localStorage)
- Update quantities
- Remove items
- Cart updates automatically in header

### Search & Filter
- Search by perfume name or brand
- Filter by category (Men, Women, Unisex)
- Sort by price (low to high, high to low) or name

### WhatsApp Integration
- Auto-generated WhatsApp links
- Product-specific messages
- General inquiry support

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issue
```bash
# Clear cache and reinstall
del package-lock.json
npm cache clean --force
npm install
```

### Build Errors
```bash
# Clear build cache
rm -r .next
npm run build
```

## 📱 Mobile Optimization

The site is fully responsive:
- Mobile: 320px and up
- Tablet: 768px and up
- Desktop: 1024px and up

Test with different screen sizes using browser DevTools.

## 🔐 Security Notes

- All images use HTTPS
- No sensitive data in code
- Cart data stored locally (client-side only)
- Safe for Vercel deployment

## 📞 Support

For issues:
1. Check console for errors: F12 → Console
2. Review Next.js docs: https://nextjs.org/docs
3. Check Tailwind docs: https://tailwindcss.com/docs

## 🎉 You're All Set!

Your perfume e-commerce website is ready. Start with:
```bash
npm run dev
```

Then visit http://localhost:3000 to see your site live!

---

**Built with Next.js • Tailwind CSS • TypeScript**
