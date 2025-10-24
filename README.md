# Plant CRM - Customer Relations Management

A comprehensive customer tracking system designed specifically for plant sellers on PalmStreet and Etsy. Track customer purchases, manage order history, monitor customer satisfaction, and identify opportunities for future deals.

## Features

- **Multi-Platform Tracking**: Track customers across PalmStreet, Etsy, or both platforms
- **Seller Identification**: Flag customers who are also sellers for special treatment
- **Order History**: Complete purchase history with dates, items, and amounts
- **Customer Satisfaction**: Add notes about customer satisfaction and feedback
- **Deal Management**: Track special deals and promotions for repeat customers
- **Advanced Filtering**: Filter by platform, seller status, order count, tags, and search
- **Tags System**: Organize customers with custom tags
- **Statistics**: Automatic calculation of total orders, spending, and purchase dates

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd plant-crm
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run db:migrate
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to: `http://localhost:3000`

## Usage

### Adding Customers

1. Click the "Add Customer" button
2. Fill in customer details:
   - Name (required)
   - Email (optional)
   - Phone (optional)
   - Platform: PalmStreet, Etsy, or Both
   - Check "Is this customer also a seller?" if applicable
3. Click "Save Customer"

### Recording Orders

1. Click the "Add Order" button
2. Select the customer from the dropdown
3. Fill in order details:
   - Order number (optional)
   - Platform (PalmStreet or Etsy)
   - Order date
   - Items purchased
   - Total amount
   - Additional notes (optional)
4. Click "Save Order"

The customer's statistics will automatically update!

### Tracking Customer Satisfaction

1. Click "View Details" on any customer
2. Use the "Add Satisfaction Note" button to record feedback
3. Use "Add Deal/Promotion" to plan future offers
4. Add tags like "VIP", "Repeat Customer", "High Value" for organization

### Filtering Customers

Use the filters section to find specific customers:
- **Search**: Search by name, email, or phone
- **Platform**: Filter by PalmStreet, Etsy, or Both
- **Sellers Only**: Show only customers who are sellers
- **Min Orders**: Show customers with minimum order count
- **Tag**: Filter by specific tags

## Project Structure

```
plant-crm/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   │   ├── customers/  # Customer endpoints
│   │   │   ├── orders/     # Order endpoints
│   │   │   ├── tags/       # Tags endpoints
│   │   │   └── health/     # Health check
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── CustomerList.tsx
│   │   ├── CustomerFilters.tsx
│   │   ├── CustomerModal.tsx
│   │   ├── OrderModal.tsx
│   │   └── CustomerDetailsModal.tsx
│   ├── database/
│   │   ├── schema.sql      # Database schema
│   │   ├── db.ts           # Database connection
│   │   └── migrate.ts      # Migration runner
│   ├── models/
│   │   ├── Customer.ts     # Customer data model
│   │   ├── Order.ts        # Order data model
│   │   ├── CustomerNote.ts # Notes model
│   │   └── CustomerTag.ts  # Tags model
│   ├── lib/
│   │   └── db-init.ts      # Database initialization
│   └── types.ts            # TypeScript types
├── data/
│   └── plant-crm.db        # SQLite database (created on first run)
├── next.config.js          # Next.js configuration
└── package.json
```

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers (supports filtering)
  - Query params: `platform`, `is_seller`, `min_orders`, `tag`, `search`
- `GET /api/customers/:id` - Get customer with full details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `POST /api/customers/:id/tags` - Add tag to customer
- `DELETE /api/customers/:id/tags/:tag` - Remove tag
- `POST /api/customers/:id/notes` - Add note to customer

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Tags

- `GET /api/tags` - Get all unique tags

## Database Schema

### Customers Table
- Customer information, platform, seller status
- Auto-calculated: total orders, total spent, first/last purchase dates

### Orders Table
- Individual purchase records
- Links to customers
- Includes date, items, amount, notes

### Customer Notes Table
- Satisfaction notes, deals, feedback
- Categorized by type

### Customer Tags Table
- Custom tags for organization
- Unique per customer

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Initialize/reset database

## Tips for Plant Sellers

### Organizing Customers

1. **Tag VIP Customers**: Add "VIP" tag to high-value customers
2. **Track Sellers**: Use the seller checkbox to identify fellow sellers
3. **Monitor Platforms**: See which platform brings more sales
4. **Identify Opportunities**: Filter by order count to find customers for deals

### Maximizing Customer Satisfaction

1. **Record Feedback**: Add satisfaction notes after each sale
2. **Plan Promotions**: Use deal notes to plan future offers
3. **Track Preferences**: Use order notes to remember plant preferences
4. **Build Relationships**: Review customer history before reaching out

### Growing Your Business

- **Repeat Customers**: Filter by `min_orders >= 2` to find loyal customers
- **Platform Analysis**: Compare PalmStreet vs Etsy customer behavior
- **Seller Network**: Connect with customers who are also sellers
- **Seasonal Tracking**: Use order dates to identify seasonal patterns

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite (better-sqlite3)
- **Styling**: CSS Modules with modern gradients and responsive design

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
