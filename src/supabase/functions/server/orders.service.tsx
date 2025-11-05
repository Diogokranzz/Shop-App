import * as kv from './kv_store.tsx';
import { updateStock } from './products.service.tsx';
import type { Order, CartItem, Address, ApiResponse } from './types.tsx';

export async function createOrder(
  userId: string,
  items: CartItem[],
  paymentMethod: 'pix' | 'credit_card' | 'boleto',
  shippingAddress: Address,
  billingAddress?: Address
): Promise<ApiResponse<Order>> {
  try {
    console.log('📝 Creating order for user:', userId);
    
    if (!items || items.length === 0) {
      return {
        success: false,
        error: {
          code: 'EMPTY_CART',
          message: 'Carrinho vazio',
        },
      };
    }
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 500 ? 0 : 30;
    const total = subtotal + tax + shipping;
    
    for (const item of items) {
      const stockResult = await updateStock(item.productId, item.quantity, 'subtract');
      if (!stockResult.success) {
        return {
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `Estoque insuficiente para ${item.name}`,
          },
        };
      }
    }
    
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const order: Order = {
      id: orderId,
      userId,
      items,
      total,
      subtotal,
      tax,
      shipping,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      createdAt: now,
      updatedAt: now,
    };
    
    await kv.set(`order:${orderId}`, JSON.stringify(order));
    await kv.set(`user:${userId}:order:${orderId}`, orderId);
    
    const orderIndex = await kv.get('orders:index') || '[]';
    const orders = JSON.parse(orderIndex);
    orders.push(orderId);
    await kv.set('orders:index', JSON.stringify(orders));
    
    console.log('✅ Order created:', orderId);
    
    return {
      success: true,
      data: order,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Create order error:', error);
    
    for (const item of items) {
      await updateStock(item.productId, item.quantity, 'add');
    }
    
    return {
      success: false,
      error: {
        code: 'ORDER_ERROR',
        message: 'Erro ao criar pedido',
        details: error.message,
      },
    };
  }
}

export async function getOrderById(orderId: string, userId?: string): Promise<ApiResponse<Order>> {
  try {
    const orderJson = await kv.get(`order:${orderId}`);
    
    if (!orderJson) {
      return {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Pedido não encontrado',
        },
      };
    }
    
    const order: Order = JSON.parse(orderJson);
    
    if (userId && order.userId !== userId) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Acesso negado',
        },
      };
    }
    
    return {
      success: true,
      data: order,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get order error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedido',
      },
    };
  }
}

export async function getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
  try {
    const orderKeys = await kv.getByPrefix(`user:${userId}:order:`);
    
    if (!orderKeys || orderKeys.length === 0) {
      return {
        success: true,
        data: [],
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    const orders: Order[] = [];
    
    for (const key of orderKeys) {
      const orderId = JSON.parse(key);
      const orderJson = await kv.get(`order:${orderId}`);
      if (orderJson) {
        orders.push(JSON.parse(orderJson));
      }
    }
    
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: orders,
      meta: {
        total: orders.length,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get user orders error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedidos',
      },
    };
  }
}

export async function getAllOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const orderIndexJson = await kv.get('orders:index');
    
    if (!orderIndexJson) {
      return {
        success: true,
        data: [],
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    const orderIds: string[] = JSON.parse(orderIndexJson);
    const orders: Order[] = [];
    
    for (const orderId of orderIds) {
      const orderJson = await kv.get(`order:${orderId}`);
      if (orderJson) {
        orders.push(JSON.parse(orderJson));
      }
    }
    
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: orders,
      meta: {
        total: orders.length,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get all orders error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedidos',
      },
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  trackingCode?: string
): Promise<ApiResponse<Order>> {
  try {
    const orderJson = await kv.get(`order:${orderId}`);
    
    if (!orderJson) {
      return {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Pedido não encontrado',
        },
      };
    }
    
    const order: Order = JSON.parse(orderJson);
    const now = new Date().toISOString();
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: now,
      trackingCode: trackingCode || order.trackingCode,
      cancelledAt: status === 'cancelled' ? now : order.cancelledAt,
    };
    
    await kv.set(`order:${orderId}`, JSON.stringify(updatedOrder));
    
    console.log('✅ Order status updated:', orderId, status);
    
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await updateStock(item.productId, item.quantity, 'add');
      }
    }
    
    return {
      success: true,
      data: updatedOrder,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Update order status error:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar status do pedido',
      },
    };
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order['paymentStatus']
): Promise<ApiResponse<Order>> {
  try {
    const orderJson = await kv.get(`order:${orderId}`);
    
    if (!orderJson) {
      return {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Pedido não encontrado',
        },
      };
    }
    
    const order: Order = JSON.parse(orderJson);
    const now = new Date().toISOString();
    
    const updatedOrder: Order = {
      ...order,
      paymentStatus,
      updatedAt: now,
      paidAt: paymentStatus === 'paid' ? now : order.paidAt,
      status: paymentStatus === 'paid' ? 'processing' : order.status,
    };
    
    await kv.set(`order:${orderId}`, JSON.stringify(updatedOrder));
    
    console.log('✅ Payment status updated:', orderId, paymentStatus);
    
    return {
      success: true,
      data: updatedOrder,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Update payment status error:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar status de pagamento',
      },
    };
  }
}

export async function cancelOrder(orderId: string, userId: string): Promise<ApiResponse<Order>> {
  try {
    const orderResult = await getOrderById(orderId, userId);
    
    if (!orderResult.success) {
      return orderResult;
    }
    
    const order = orderResult.data!;
    
    if (order.status === 'delivered') {
      return {
        success: false,
        error: {
          code: 'CANNOT_CANCEL',
          message: 'Pedidos entregues não podem ser cancelados',
        },
      };
    }
    
    if (order.status === 'cancelled') {
      return {
        success: false,
        error: {
          code: 'ALREADY_CANCELLED',
          message: 'Pedido já foi cancelado',
        },
      };
    }
    
    return await updateOrderStatus(orderId, 'cancelled');
  } catch (error) {
    console.error('Cancel order error:', error);
    return {
      success: false,
      error: {
        code: 'CANCEL_ERROR',
        message: 'Erro ao cancelar pedido',
      },
    };
  }
}

export async function getOrderStatistics(): Promise<ApiResponse<any>> {
  try {
    const allOrdersResult = await getAllOrders();
    
    if (!allOrdersResult.success) {
      return allOrdersResult;
    }
    
    const orders = allOrdersResult.data!;
    
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
        : 0,
      ordersByStatus: {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      },
      ordersByPaymentMethod: {
        pix: orders.filter(o => o.paymentMethod === 'pix').length,
        credit_card: orders.filter(o => o.paymentMethod === 'credit_card').length,
        boleto: orders.filter(o => o.paymentMethod === 'boleto').length,
      },
      revenueByPaymentStatus: {
        paid: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
        pending: orders.filter(o => o.paymentStatus === 'pending').reduce((sum, o) => sum + o.total, 0),
      },
    };
    
    return {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get order statistics error:', error);
    return {
      success: false,
      error: {
        code: 'STATS_ERROR',
        message: 'Erro ao buscar estatísticas',
      },
    };
  }
}
