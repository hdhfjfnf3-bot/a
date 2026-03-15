# Workspace

## Overview

NOVA Store - A full-stack Arabic dropshipping e-commerce store with admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Framer Motion, Tailwind CSS, RTL Arabic

## NOVA Store Features

- **Home page**: Hero section with 3D animated elements, featured products, categories grid
- **Products page**: Filter by category, search, product cards
- **Product detail**: Product images and order link
- **Order page**: Full order form (name, phone +20, alt phone, governorate, address, quantity, Facebook page, notes)
- **Login page**: Phone + password login
- **Register page**: Full name, phone, password registration
- **Admin panel** (`/admin`): Products CRUD, orders management, categories, stats
- **Language**: Full Arabic RTL

## Admin Access

- Phone: `201000000000`
- Password: `admin123`
- Role: admin (set manually in DB)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── nova-store/         # React + Vite frontend (Arabic RTL)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## DB Schema

- `users` - id, full_name, phone, password (bcrypt), role (user/admin), created_at
- `categories` - id, name, name_ar, slug, icon, image
- `products` - id, name, name_ar, description, description_ar, price, original_price, images (json), category_id, stock, featured, badge, created_at
- `orders` - id, product_id, full_name, phone, alt_phone, governorate, address, quantity, total_price, status, facebook_page, notes, created_at

## API Routes

- `POST /api/auth/register` - Register (name, phone, password)
- `POST /api/auth/login` - Login (phone, password)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/POST /api/categories`
- `GET/POST /api/products`
- `GET/PUT/DELETE /api/products/:id`
- `GET/POST /api/orders`
- `GET/PATCH /api/orders/:id`

## Session

Cookie-based sessions stored in memory (`nova_session` cookie). Admin role checked server-side.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- `pnpm run typecheck` — canonical full check
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client/zod from OpenAPI
