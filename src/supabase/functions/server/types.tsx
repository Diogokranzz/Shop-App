export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  discount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  specs?: Record<string, string>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress?: Address;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  cancelledAt?: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'pix' | 'credit_card' | 'boleto';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  pixQrCode?: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  cardLast4?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Session {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

export interface RateLimitEntry {
  key: string;
  count: number;
  resetAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  inStock?: boolean;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface StockMovement {
  productId: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason: string;
  userId?: string;
  timestamp: string;
}

export interface Inventory {
  productId: string;
  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_confirmed' | 'order_shipped' | 'payment_received' | 'low_stock';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
