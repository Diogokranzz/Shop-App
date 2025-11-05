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
