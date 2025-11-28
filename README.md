# Luxe Perfumes - E-Commerce Website

A modern, fast, and elegant perfume e-commerce website built with Next.js, Tailwind CSS, and deployed on Vercel.

## 🌟 Features

- **Product Catalog**: Browse perfumes with grid layout and filtering
- **Advanced Search & Filter**: Search by name/brand, filter by category, sort by price
- **Shopping Cart**: Add items to cart with quantity selection (localStorage persistence)
- **Product Details**: Full product pages with descriptions and fragrance notes
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Premium dark interface with gold accents
- **WhatsApp Integration**: Direct contact for inquiries and consultations
- **Fast Performance**: Optimized images and lazy loading
- **SEO Ready**: Meta tags and structured data for search engines

## 📁 Project Structure

```
perfume/
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   ├── shop/     # Shop page (product listing)
│   │   ├── product/     # Product detail pages
│   │   ├── cart/        # Shopping cart page
│   │   ├── about/       # About page
│   │   └── contact/     # Contact page
│   ├── components/      # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PerfumeCard.tsx
│   │   ├── ProductDetail.tsx
│   │   └── CartItemsList.tsx
│   ├── data/            # Static data
│   │   └── perfumes.ts  # Product database (JSON-based)
│   ├── lib/             # Utility functions
│   │   ├── store.ts     # Zustand store for cart management
│   │   └── constants.ts # App constants
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── global.css       # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn installed

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd perfume
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Product Management

Products are managed through the JSON file at `src/data/perfumes.ts`. To add or edit perfumes:

1. Open `src/data/perfumes.ts`
2. Add/edit entries in the perfumes array with the following structure:

```typescript
{
  id: "unique-id",
  name: "Perfume Name",
  brand: "Brand Name",
  price: 89.99,
  size: "100ml",
  category: "men" | "women" | "unisex",
  image: "https://image-url.jpg",
  description: "Optional description",
  notes: "Top: X, Middle: Y, Base: Z"
}
```

3. The changes will automatically reflect on the website (in development mode, you may need to refresh)

## ⚙️ Configuration

### WhatsApp Integration

Update your WhatsApp number in `src/lib/constants.ts`:

```typescript
export const WHATSAPP_NUMBER = "1234567890"; // Your WhatsApp number with country code
export const INSTAGRAM_URL = "https://instagram.com/yourprofile";
export const STORE_NAME = "Luxe Perfumes";
export const STORE_EMAIL = "info@luxeperfumes.com";
```

### Customization

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Images**: Replace image URLs in `src/data/perfumes.ts` and components
- **Text**: Update store name and contact info in `src/lib/constants.ts`
- **Pages**: Modify content in pages under `src/app/`

## 🏗 Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📦 Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy"

Your site will be live at a Vercel URL. You can add a custom domain in the Vercel dashboard.

## 🎨 Design Features

- **Dark Theme**: Professional dark background with gold accents
- **Responsive**: Fully responsive from mobile to desktop
- **Smooth Animations**: Subtle fade-in and hover effects
- **Modern UI**: Clean, minimalistic design with premium feel
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🔄 State Management (Cart)

The shopping cart is managed using Zustand and persisted to localStorage:

```typescript
// Add to cart
useCart.getState().addToCart(perfume, quantity);

// Remove from cart
useCart.getState().removeFromCart(perfumeId);

// Update quantity
useCart.getState().updateQuantity(perfumeId, newQuantity);

// Get total price
const total = useCart.getState().getTotalPrice();

// Clear cart
useCart.getState().clearCart();
```

## 📊 SEO Optimization

- Meta tags and descriptions on all pages
- Open Graph tags for social sharing
- Dynamic page titles
- Canonical URLs
- Mobile-friendly design
- Fast loading times (critical for SEO)

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] User authentication and accounts
- [ ] Order tracking
- [ ] Product reviews and ratings
- [ ] Wishlist/Favorites
- [ ] Email notifications
- [ ] Admin dashboard for product management
- [ ] Google Sheets CMS integration
- [ ] Promo codes and discounts
- [ ] Inventory tracking
- [ ] Multiple language support

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For support, contact us via:
- WhatsApp: [Link in constants.ts]
- Email: [Link in constants.ts]
- Instagram: [Link in constants.ts]

---

Built with ❤️ for perfume enthusiasts worldwide.
