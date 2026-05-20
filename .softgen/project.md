# ALZA - Grijanje i Hlađenje E-Commerce Platform

## Vision
Full-stack HVAC e-commerce platform for ALZA - Bosnia's heating and cooling equipment supplier. Built with Next.js 15 (Page Router), Supabase, and modern tech aesthetics. Features complete storefront, admin dashboard, and integrated Pik.ba marketplace cross-posting.

**Target Users:** 
- B2C customers purchasing HVAC equipment (air conditioners, boilers, radiators, heaters)
- Admin staff managing inventory, orders, and marketplace listings

## Design
**Style Direction:** Cyberpunk-tech meets premium HVAC showroom - futuristic interface with industrial functionality.

**Color System:**
- `--background: 240 4% 4%` (obsidian black #09090b)
- `--foreground: 0 0% 100%` (pure white)
- `--primary: 240 100% 50%` (electric blue #0000FF - cooling products)
- `--secondary: 0 100% 50%` (signal red #FF0000 - heating products)
- `--accent: 240 100% 50%` (blue accent)
- `--muted: 240 4% 15%` (dark grey)

Custom colors:
- `--cyan-glow: 180 100% 50%` (cool glow effects)
- `--orange-glow: 30 100% 50%` (warm glow effects)

**Typography:**
- Headings: JetBrains Mono (cyberpunk monospace)
- Body: Inter (modern sans-serif)
- Numbers/Prices: JetBrains Mono with tabular-nums

**Visual Effects:**
- Glassmorphism cards (backdrop-blur-xl)
- Neon glow effects on hover (blue for cooling, red for heating)
- Animated gradients
- Sharp borders with neon accents
- Category-based color coding (snowflake icon + blue for cooling, flame icon + red for heating)

## Features

### Public Storefront
1. **Homepage** (`/`)
   - Hero section with animated gradients and CTAs
   - Featured products grid with glassmorphism cards
   - Category highlights (Klima Uređaji, Bojleri, Radijatori, Grijalice)

2. **Product Catalog** (`/proizvodi`)
   - Grid layout with filtering by category
   - Real-time stock indicators
   - Product cards with hover glow effects
   - Category icons and color-coded accents

3. **Product Detail** (`/proizvodi/[slug]`)
   - Large image display with fallback icons
   - Quantity controls
   - Add to cart functionality
   - Product features (delivery, warranty, installation)
   - Stock status

4. **Shopping Cart**
   - Slide-out drawer (CartDrawer component)
   - Real-time cart updates via CartContext
   - LocalStorage persistence
   - Quantity adjustment
   - Total calculation
   - Checkout form (name, email, phone, address, notes)

### Admin Dashboard (`/admin/*`)
1. **Authentication** (`/admin/login`)
   - Email/password login via Supabase Auth
   - Admin role verification (profiles.role = 'admin')
   - Route protection with useAdminAuth hook

2. **Overview Dashboard** (`/admin`)
   - Key metrics cards:
     * Total products
     * Total orders
     * Total revenue (calculated from orders.total)
     * Low stock alerts (stock <= 5)
   - Quick action buttons
   - Recent activity feed

3. **Product Management** (`/admin/products`)
   - List view with search
   - Create/Edit/Delete operations
   - Image upload to Supabase Storage (`products` bucket)
   - **Pik.ba Cross-Posting Toggle** - Special feature for automatic listing on Pik.ba marketplace
   - Form fields: name, slug (auto-generated), description, price, stock, category, image, featured flag
   - Pik.ba sync triggered via `productAdminService.syncToPikBa()` when toggle active

4. **Order Management** (`/admin/orders`)
   - Table view of all orders
   - Status management (pending → processing → shipped → delivered / cancelled)
   - Order details modal showing:
     * Customer information
     * Order items with quantities and prices
     * Shipping address
     * Order notes
   - Quick stats (total orders, pending orders)

### Database Schema
**Tables:**
- `categories` - HVAC product categories (Klima Uređaji, Bojleri, etc.)
- `products` - Product catalog with stock, pricing, images
- `orders` - Customer orders with status tracking
- `order_items` - Individual items in orders (junction table)
- `profiles` - User profiles with admin role flag

**RLS Policies:**
- Products: Public read, admin write (T2)
- Categories: Public read, admin write (T2)
- Orders: Anon insert, admin read/update (T3 + admin policies)
- Order items: Linked to order policies
- Profiles: Auto-created on auth signup

**Storage:**
- `products` bucket - Public product images

### Tech Stack Details
- **Framework:** Next.js 15.2 (Page Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth with email/password
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS with custom utilities
- **UI Components:** shadcn/ui (pre-installed)
- **Icons:** lucide-react
- **State:** React Context API (CartContext)
- **Fonts:** JetBrains Mono, Inter (Google Fonts)

### Key Components
- `Navigation` - Header with logo, cart badge, mobile menu
- `Hero` - Landing page hero with animated backgrounds
- `ProductCard` - Reusable product card with category-based styling
- `ProductGrid` - Product listing layout
- `CartDrawer` - Slide-out shopping cart
- `GlassCard` - Glassmorphism card with optional glow
- `NeonButton` - Button with neon glow effects (blue/red variants)

### Services
- `productService` - Public product queries
- `productAdminService` - Admin CRUD operations + Pik.ba sync
- `authService` - Supabase auth helpers

### Special Features
1. **Pik.ba Marketplace Integration**
   - Toggle switch in product create/edit forms
   - "Objavi automatski i na OLX (Pik.ba)" label
   - Triggers `syncToPikBa()` after successful product save
   - Mock implementation logs to console (production would call Pik.ba API)
   - Visual feedback on form submission

2. **Category-Based Design**
   - Blue glow + Snowflake icon for cooling products
   - Red glow + Flame icon for heating products
   - Automatic color coding based on category slug

3. **Responsive Mobile Experience**
   - Mobile-first design
   - Sticky navigation
   - Mobile cart drawer
   - Collapsible mobile menu
   - Touch-friendly buttons

4. **Performance Optimizations**
   - Next.js Image optimization
   - Glassmorphism with backdrop-blur
   - Supabase RLS for security
   - LocalStorage cart persistence