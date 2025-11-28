# ⚡ Quick Start Guide - 5 Minutes

## 1️⃣ First Time Setup (1 min)

```bash
# Already done! Just verify:
cd c:\Users\Ali\Desktop\perfume

# Check if dependencies are installed
npm list next react react-dom zustand
```

If you see version numbers → you're good!
If not → run: `npm install`

## 2️⃣ Start the Website (1 min)

```bash
npm run dev
```

Open browser: **http://localhost:3000**

You should see the website live! 🎉

## 3️⃣ Update Your Information (2 mins)

Edit this file: `src/lib/constants.ts`

```typescript
// Line 1-5: Update these values
export const WHATSAPP_NUMBER = "YOUR_WHATSAPP";     // e.g., "15551234567"
export const INSTAGRAM_URL = "https://instagram.com/your_account";
export const STORE_NAME = "Your Store Name";
export const STORE_EMAIL = "your@email.com";
```

Save → Website updates automatically!

## 4️⃣ Add Your Perfumes (1 min)

Edit: `src/data/perfumes.ts`

Replace existing perfumes or add new ones:

```typescript
{
  id: "your-id",
  name: "Your Perfume Name",
  brand: "Your Brand",
  price: 99.99,
  size: "100ml",
  category: "men",  // or "women" or "unisex"
  image: "https://image-url.jpg",
  description: "Amazing fragrance",
  notes: "Top: Bergamot, Middle: Rose, Base: Musk"
}
```

Save → Perfumes appear on website!

## ✅ Done! You Now Have:

- ✨ Beautiful homepage with hero section
- 🛍️ Product catalog with search & filter
- 📦 Shopping cart with persistence
- 📄 About & Contact pages
- 📱 Mobile responsive design
- 🎨 Dark theme with gold accents
- 💬 WhatsApp integration

## 🚀 Deploy to Live Internet (5-10 minutes)

### Option A: Vercel (Easiest - Recommended)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Luxe Perfumes"
   git remote add origin https://github.com/yourusername/perfume.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import GitHub repo
4. Click "Deploy"
5. Get your live URL in ~1 minute ✅

### Option B: Netlify (Alternative)

1. Same GitHub push as above
2. Go to [netlify.com](https://netlify.com)
3. Connect GitHub → Authorize → Deploy
4. Live in ~2 minutes ✅

## 📱 Test Your Site

### Desktop
- Open http://localhost:3000
- Click through pages
- Add items to cart
- Test search/filter

### Mobile
- Open DevTools: F12
- Click device icon (mobile view)
- Test all features

## 🎨 Customize Colors (Optional)

Edit: `tailwind.config.js`

```javascript
// Line 8-19: Change these colors
colors: {
  primary: {
    dark: "#0f0f0f",     // Main background
    darker: "#1a1a1a",   // Dark background
    light: "#2a2a2a",    // Light background
  },
  accent: {
    gold: "#d4af37",     // Main accent
    silver: "#e8e8e8",   // Secondary accent
  },
}
```

Popular color schemes:
- **Gold**: `#d4af37` ← Current
- **Rose Gold**: `#e75480`
- **Silver**: `#c0c0c0`
- **Green**: `#2ecc71`

## 📚 Need Help?

**See These Files:**
- 📖 README.md - Full documentation
- ⚙️ CONFIGURATION.md - All settings
- 📝 SETUP.md - Detailed setup

**Stuck? Try:**
1. Stop dev server: Ctrl+C
2. Clear cache: `rm -r .next`
3. Restart: `npm run dev`

## 🎯 What's Next?

**Immediate:**
- ✅ Update store info
- ✅ Add your perfumes
- ✅ Deploy to Vercel

**Soon:**
- Add payment system (Stripe)
- Track orders
- Email notifications
- Product reviews

**Future:**
- Admin dashboard
- Inventory tracking
- Promotions/discounts
- User accounts

## 💡 Pro Tips

1. **Images**: Use HTTPS URLs (not HTTP)
2. **Prices**: Keep prices consistent
3. **WhatsApp**: Include country code (e.g., +1 for USA)
4. **Testing**: Always test cart functionality
5. **Backups**: Commit to GitHub frequently

## 📞 Support Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel Deploy: https://vercel.com/docs

---

**You're all set! Start your dev server and see your website come to life!** 🚀

Run: `npm run dev` → Open: http://localhost:3000
