-- Plant CRM Database Schema

-- Customers table: Track customers across platforms
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    platform TEXT NOT NULL CHECK(platform IN ('PalmStreet', 'Etsy', 'Both')),
    is_seller INTEGER DEFAULT 0 CHECK(is_seller IN (0, 1)),
    total_orders INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0.0,
    first_purchase_date TEXT,
    last_purchase_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Orders table: Track individual purchases with dates
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_number TEXT,
    platform TEXT NOT NULL CHECK(platform IN ('PalmStreet', 'Etsy')),
    order_date TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount REAL NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

-- Customer notes and deals: Track satisfaction and future opportunities
CREATE TABLE IF NOT EXISTS customer_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    note_type TEXT NOT NULL CHECK(note_type IN ('satisfaction', 'deal', 'feedback', 'general')),
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

-- Tags for deals and promotions
CREATE TABLE IF NOT EXISTS customer_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    UNIQUE(customer_id, tag)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_platform ON customers(platform);
CREATE INDEX IF NOT EXISTS idx_customers_is_seller ON customers(is_seller);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_tags_customer_id ON customer_tags(customer_id);
