## Goal
Build a simple shopping bag website with a responsive frontend and backend API where users can browse products, view product details, add items to a bag, manage bag contents through both a drawer and dedicated bag page, and where the site owner can manage products through a simple admin UI backed by protected API endpoints.

## Context
This is a greenfield e-commerce-style project focused on a minimal shopping bag experience rather than full commerce. The clarified scope now includes:
- a backend API for product retrieval and admin product management
- a product listing page and product detail page
- browser-only bag persistence
- both a bag drawer/modal and a dedicated bag page
- a simple admin UI for the site owner, using protected API-only access for product create/update/delete actions

No existing codebase or workspace files were provided, so this plan assumes a fresh implementation.

The product catalog is server-managed, while the shopping bag remains client-side and is persisted in browser storage. The app should emphasize a clean, user-friendly browsing and bag flow without checkout, payments, or customer accounts.

## Acceptance Criteria
- AC-1: Users can view a product listing page showing at least each product’s name, image, price, and add-to-bag action.
- AC-2: Users can open a product detail page from the listing and view at least the product name, image, description, price, and add-to-bag action.
- AC-3: Users can add a product to the shopping bag from both the product listing page and the product detail page.
- AC-4: Users can open a bag drawer/modal from anywhere in the site and see current bag contents, including product name, unit price, quantity, and line total.
- AC-5: Users can navigate to a dedicated bag page showing all current bag contents, including product name, unit price, quantity, and line total.
- AC-6: Users can increase, decrease, or remove item quantities from the bag in at least one bag management surface, and changes are reflected consistently across the drawer, bag page, and header bag indicator.
- AC-7: The shopping bag displays an automatically updated subtotal based on current contents.
- AC-8: Bag contents persist across page refreshes in the same browser using browser storage such as `localStorage`.
- AC-9: The frontend fetches product data from a backend API for both product listing and product detail views.
- AC-10: A simple admin UI allows the site owner to create, edit, and delete products through protected backend API endpoints.
- AC-11: Protected admin product-management endpoints are not publicly writable and require an access control mechanism appropriate for a single-owner first version.
- AC-12: The site works on both desktop and mobile screen sizes with a usable responsive layout, including accessible behavior for the bag drawer/modal.
- AC-13: The application handles an empty bag state with clear messaging and a path back to shopping.
- AC-14: The frontend handles loading and error states gracefully for product and admin API interactions.
- AC-15: If bag data in browser storage references products that no longer exist or are no longer valid, the app ignores or removes those entries safely without breaking the UI.

## Implementation Notes
- Use a frontend plus backend architecture:
  - frontend for browsing, bag state, admin UI, and responsive interactions
  - backend API for product retrieval and protected admin product management
- Keep bag state fully client-side:
  - store bag contents in browser storage
  - do not require customer authentication
  - rehydrate bag state on app load
  - resolve bag item IDs against live product data when rendering totals and details
- Provide both bag interaction surfaces:
  - bag drawer/modal for quick review
  - dedicated bag page for fuller management
- Use a minimal product schema for the first version, such as:
  - `id`
  - `name`
  - `description`
  - `price`
  - `imageUrl`
  - optional `active`
- Keep pricing logic intentionally simple:
  - subtotal only
  - no tax
  - no shipping
  - no discounting
- Implement bag rules consistently:
  - quantity must be at least 1 for an existing line item
  - decreasing below 1 removes the item
  - duplicate adds increment quantity rather than creating inconsistent duplicate lines
  - invalid or missing product IDs from storage are handled safely
- Suggested backend API surface:
  - `GET /products`
  - `GET /products/:id`
  - protected `POST /admin/products`
  - protected `PUT` or `PATCH /admin/products/:id`
  - protected `DELETE /admin/products/:id`
- Admin management approach for v1:
  - build a simple admin UI for product CRUD
  - wire it to protected API-only access
  - keep auth/access control lightweight and maintainable for a single owner rather than designing a full role system
- UI/component areas to include:
  - header with bag count indicator
  - product listing page
  - product detail page
  - bag drawer/modal
  - dedicated bag page
  - admin product list/form views
- Accessibility and responsiveness should be treated as first-class requirements:
  - keyboard-accessible drawer/modal behavior
  - visible focus states
  - clear open/close controls
  - mobile-friendly bag/product layouts
- Since no specific stack was requested, choose a simple stack that supports:
  - REST API development
  - client-side state management for bag persistence
  - straightforward admin form handling
  - basic protected route or token-based admin access

## Out of Scope
- Payment processing
- Checkout or order placement
- Customer accounts or shopper authentication
- Server-side bag persistence
- Taxes, shipping, discounts, or coupons
- Advanced inventory workflows
- Multi-admin roles and permissions
- Product search, filtering, or sorting
- Multi-currency or localization
- Reviews, wishlists, or recommendations
- Full CMS features beyond basic product CRUD