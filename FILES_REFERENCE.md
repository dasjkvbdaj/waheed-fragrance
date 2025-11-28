# 📚 Luxe Perfumes - Complete File Reference

## 📑 Documentation Files (Start Here!)

| File | Purpose | Read Time |
|------|---------|-----------|
| **QUICKSTART.md** | 5-minute setup guide | 5 min |
| **PROJECT_SUMMARY.md** | Project overview & checklist | 10 min |
| **README.md** | Complete documentation | 15 min |
| **SETUP.md** | Detailed setup & deployment | 10 min |
| **CONFIGURATION.md** | All configuration options | 10 min |
| **This file** | File reference guide | 5 min |

## 🚀 Quick Command Reference

```bash
# Development
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Check code quality

# Setup
npm install      # Install dependencies
npm cache clean  # Clear npm cache

# Deployment
git push origin main  # Deploy to Vercel (if connected)
vercel                # Deploy with Vercel CLI
```

## 📂 Project Structure

### Configuration Files
```
perfume/
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── tsconfig.node.json     # TypeScript node config
├── tailwind.config.js     # Tailwind CSS customization
├── postcss.config.js      # PostCSS config
├── next.config.js         # Next.js configuration
├── .eslintrc.json         # ESLint rules
└── .gitignore             # Git ignore rules
```

### Source Code

#### Pages (`src/app/`)
```
src/app/
├── layout.tsx              # Root layout, metadata, imports global CSS
├── page.tsx                # Home page (hero + featured products)
├── not-found.tsx           # 404 page
├── about/
│   └── page.tsx           # About page (brand story)
├── catalog/
│   └── page.tsx           # Product listing (search, filter, sort)
├── cart/
│   └── page.tsx           # Shopping cart page
├── contact/
│   └── page.tsx           # Contact page (WhatsApp, email, FAQ)
└── product/
    └── [id]/
        └── page.tsx       # Dynamic product detail page
```

#### Components (`src/components/`)
```
src/components/
├── Header.tsx             # Navigation bar with cart icon
├── Footer.tsx             # Footer with links & social
├── PerfumeCard.tsx        # Product card component
├── ProductDetail.tsx      # Product detail view
└── CartItemsList.tsx      # Cart items display
```

#### Data (`src/data/`)
```
src/data/
└── perfumes.ts            # Product database (JSON array)
```

#### Utilities (`src/lib/`)
```
src/lib/
├── store.ts               # Zustand cart management store
└── constants.ts           # App constants (WhatsApp, Instagram, email)
```

#### Types (`src/types/`)
```
src/types/
└── index.ts               # TypeScript interfaces
```

#### Styles
```
src/
└── global.css             # Global styles, Tailwind directives
```

## 🎯 How to Modify Each File

### 1. Update Store Information
**File**: `src/lib/constants.ts`

```typescript
export const WHATSAPP_NUMBER = "YOUR_NUMBER";      // Change this
export const INSTAGRAM_URL = "YOUR_URL";           // Change this
export const STORE_NAME = "YOUR_STORE";            // Change this
export const STORE_EMAIL = "YOUR_EMAIL";           // Change this
```

### 2. Add/Edit Products
**File**: `src/data/perfumes.ts`

```typescript
export const perfumes: Perfume[] = [
  {
    id: "1",
    name: "Your Perfume",
    brand: "Your Brand",
    price: 99.99,
    // ... more fields
  },
  // Add more perfumes here
];
```

### 3. Change Colors
**File**: `tailwind.config.js`

```javascript
colors: {
  primary: {
    dark: "#0f0f0f",      // Change background
    darker: "#1a1a1a",
    light: "#2a2a2a",
  },
  accent: {
    gold: "#d4af37",      // Change accent
    silver: "#e8e8e8",
  },
}
```

### 4. Modify Pages
**File**: `src/app/[page]/page.tsx`

Each page is a React component. Edit the JSX/content as needed.

### 5. Edit Components
**File**: `src/components/[Component].tsx`

Each component can be customized independently.

### 6. Global Styles
**File**: `src/global.css`

Add/modify CSS for site-wide styling.

## 📝 File Descriptions

### Configuration Files

**package.json**
- Lists all dependencies
- Defines npm scripts
- Project metadata

**tsconfig.json**
- TypeScript compiler options
- Path aliases (@/*)

**tailwind.config.js**
- Tailwind CSS customization
- Color palette
- Theme configuration

**next.config.js**
- Next.js configuration
- Image optimization
- Build settings

**.eslintrc.json**
- Code quality rules
- Linting configuration

### Page Files

**layout.tsx**
- Root layout component
- HTML head (metadata, SEO)
- Imports global CSS
- Wraps all pages

**page.tsx (Home)**
- Hero section
- Featured products
- Call-to-action buttons
- Category showcase

**catalog/page.tsx**
- Product listing grid
- Search functionality
- Category filter
- Sorting options

**product/[id]/page.tsx**
- Product details
- Large image
- Description and notes
- Add to cart button
- Related products

**cart/page.tsx**
- Cart items list
- Quantity management
- Order summary
- Checkout CTA

**about/page.tsx**
- Store story
- Company values
- Customer benefits
- Shop CTA

**contact/page.tsx**
- Contact methods
- WhatsApp link
- Email form
- Instagram link
- FAQ section

### Component Files

**Header.tsx**
- Logo
- Navigation links
- Cart icon with badge
- Mobile menu

**Footer.tsx**
- Quick links
- Company info
- Social links
- Copyright

**PerfumeCard.tsx**
- Product image
- Product name
- Price
- Category badge
- Add to cart button

**ProductDetail.tsx**
- Full product image
- Product information
- Price display
- Quantity selector
- Add to cart button
- WhatsApp contact button

**CartItemsList.tsx**
- Cart items
- Quantity controls
- Remove buttons
- Item totals
- Cart summary

## 🔄 Data Flow

```
User visits page
    ↓
Layout.tsx renders (header, footer, pages)
    ↓
Page component loads data from perfumes.ts
    ↓
Components render with data
    ↓
User interacts (search, filter, add to cart)
    ↓
Zustand store updates (store.ts)
    ↓
localStorage updated (persistent cart)
    ↓
UI re-renders with new state
```

## 🎨 Styling System

**Global CSS** (`global.css`)
- Tailwind directives
- Global styles
- Animations

**Tailwind Config** (`tailwind.config.js`)
- Custom colors
- Extended theme
- Custom animations

**Component Styles**
- Inline Tailwind classes
- Responsive breakpoints
- Hover/active states

## 🛠️ Key Technologies

| Technology | Purpose | File |
|------------|---------|------|
| Next.js | Framework | package.json |
| React | UI library | package.json |
| TypeScript | Type safety | tsconfig.json |
| Tailwind CSS | Styling | tailwind.config.js |
| Zustand | State management | src/lib/store.ts |

## 📊 State Management Flow

```
Component
    ↓
useCart hook (Zustand)
    ↓
store.ts (cart state)
    ↓
localStorage (persistence)
    ↓
Component updates
```

## 🔐 Data Structure

### Perfume Object
```typescript
{
  id: string;           // Unique identifier
  name: string;         // Product name
  brand: string;        // Brand name
  price: number;        // Price in USD
  size: string;         // Bottle size
  category: string;     // men | women | unisex
  image: string;        // Image URL (HTTPS)
  description?: string; // Optional
  notes?: string;       // Optional fragrance notes
}
```

### Cart Item Object
```typescript
{
  perfume: Perfume;     // Product object
  quantity: number;     // Quantity in cart
}
```

## 🚀 Deployment Files

**For Vercel Deployment:**
- No special files needed
- Vercel auto-detects Next.js
- Just push to GitHub
- Vercel auto-deploys

**Environment Variables (Optional):**
- Create `.env.local` for local development
- Set environment variables in Vercel dashboard

## 🔍 File Sizes

| File | Size |
|------|------|
| layout.tsx | ~1.5 KB |
| page.tsx (home) | ~9 KB |
| components/* | ~20 KB total |
| perfumes.ts | ~3 KB |
| store.ts | ~2 KB |
| All src files | ~57 KB |

## 📝 Important Notes

### Do Not Modify
- `next.config.js` - Unless you know what you're doing
- `tsconfig.json` - TypeScript configuration
- Package structure - Component organization

### Safe to Modify
- Content in pages
- Component styling
- Product data
- Colors and theme
- Store information

### Never Commit to Git
- `node_modules/`
- `.env.local` (local secrets)
- `.next/` (build output)
- `dist/` (if it exists)

## 🎯 Common Tasks

### Add New Perfume
1. Edit `src/data/perfumes.ts`
2. Add object to perfumes array

### Change Colors
1. Edit `tailwind.config.js`
2. Update color values

### Update Contact Info
1. Edit `src/lib/constants.ts`
2. Update WHATSAPP_NUMBER, INSTAGRAM_URL, etc.

### Add New Page
1. Create folder in `src/app/`
2. Create `page.tsx` in folder
3. Add route to Header navigation

### Modify Component
1. Edit file in `src/components/`
2. Changes reflect everywhere it's used

## 🆘 If Something Breaks

1. Check browser console (F12)
2. Stop dev server (Ctrl+C)
3. Clear cache: `rm -r .next`
4. Restart: `npm run dev`

---

**All files documented. Ready to deploy! 🚀**

For more help, see QUICKSTART.md or README.md
