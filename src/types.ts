export type Platform = 'PalmStreet' | 'Etsy' | 'Both';

export type NoteType = 'satisfaction' | 'deal' | 'feedback' | 'general';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  platform: Platform;
  is_seller: boolean;
  total_orders: number;
  total_spent: number;
  first_purchase_date?: string;
  last_purchase_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id?: number;
  customer_id: number;
  order_number?: string;
  platform: 'PalmStreet' | 'Etsy';
  order_date: string;
  items: string;
  total_amount: number;
  notes?: string;
  created_at?: string;
}

export interface CustomerNote {
  id?: number;
  customer_id: number;
  note_type: NoteType;
  content: string;
  created_at?: string;
}

export interface CustomerTag {
  id?: number;
  customer_id: number;
  tag: string;
  created_at?: string;
}

export interface CustomerWithDetails extends Customer {
  orders?: Order[];
  notes?: CustomerNote[];
  tags?: string[];
}

export interface CustomerFilter {
  platform?: Platform;
  is_seller?: boolean;
  min_orders?: number;
  tag?: string;
  search?: string;
}
