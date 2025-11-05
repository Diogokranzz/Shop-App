import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';

import {
  corsMiddleware,
  requestLogger,
  errorHandler,
  rateLimiter,
  requireAuth,
  requireAdmin,
  validateRequest,
  cacheResponse,
} from './middleware.tsx';

import * as authService from './auth.service.tsx';
import * as productsService from './products.service.tsx';
import * as ordersService from './orders.service.tsx';
import * as paymentService from './payment.service.tsx';

import {
  SignUpSchema,
  SignInSchema,
  CreateProductSchema,
  UpdateProductSchema,
  CreateOrderSchema,
  ProcessPaymentSchema,
  PaginationSchema,
  ProductFilterSchema,
} from './validation.schemas.tsx';

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 600,
}));
app.use('*', requestLogger);
app.use('*', errorHandler);

app.use('*', rateLimiter({ maxRequests: 100, windowMs: 60000 }));

app.get('/make-server-3ee85c18/health', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'VORTEX-TECH-API',
    },
  });
});

import { seedDatabase } from './seed.tsx';

app.post('/make-server-3ee85c18/admin/seed', async (c) => {
  try {
    console.log('🌱 Seed request received');
    const result = await seedDatabase();
    
    return c.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return c.json({
      success: false,
      error: {
        code: 'SEED_ERROR',
        message: 'Erro ao popular banco de dados',
        details: error.message,
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const validation = SignUpSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors.map(e => e.message).join(', '),
        },
      }, 400);
    }
    
    const { email, password, name } = validation.data;
    const result = await authService.signUp(email, password, name);
    
    return c.json(result, result.success ? 201 : 400);
  } catch (error) {
    console.error('Signup route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'SIGNUP_ERROR',
        message: 'Erro ao criar conta',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/auth/signin', async (c) => {
  try {
    const body = await c.req.json();
    const validation = SignInSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors.map(e => e.message).join(', '),
        },
      }, 400);
    }
    
    const { email, password } = validation.data;
    const result = await authService.signIn(email, password);
    
    return c.json(result, result.success ? 200 : 401);
  } catch (error) {
    console.error('Signin route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'SIGNIN_ERROR',
        message: 'Erro ao fazer login',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/auth/signout', requireAuth, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1] || '';
    const result = await authService.signOut(token);
    
    return c.json(result);
  } catch (error) {
    console.error('Signout route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'SIGNOUT_ERROR',
        message: 'Erro ao fazer logout',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/auth/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const result = await authService.getUserProfile(userId);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Get profile route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'PROFILE_ERROR',
        message: 'Erro ao buscar perfil',
      },
    }, 500);
  }
});

app.put('/make-server-3ee85c18/auth/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const result = await authService.updateUserProfile(userId, body);
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error('Update profile route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar perfil',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/products', async (c) => {
  try {
    const query = c.req.query();
    
    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: (query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    };
    
    const filters = {
      category: query.category,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      search: query.search,
      tags: query.tags ? query.tags.split(',') : undefined,
      inStock: query.inStock === 'true',
    };
    
    const result = await productsService.getProducts(pagination, filters);
    
    if (result.success && result.meta) {
      c.header('X-Total-Count', result.meta.total?.toString() || '0');
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Get products route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar produtos',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await productsService.getProductById(id);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Get product route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar produto',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/products', requireAuth, requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const validation = CreateProductSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors.map(e => e.message).join(', '),
        },
      }, 400);
    }
    
    const result = await productsService.createProduct(validation.data);
    
    return c.json(result, result.success ? 201 : 400);
  } catch (error) {
    console.error('Create product route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Erro ao criar produto',
      },
    }, 500);
  }
});

app.put('/make-server-3ee85c18/products/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validation = UpdateProductSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors.map(e => e.message).join(', '),
        },
      }, 400);
    }
    
    const result = await productsService.updateProduct(id, validation.data);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Update product route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar produto',
      },
    }, 500);
  }
});

app.delete('/make-server-3ee85c18/products/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const result = await productsService.deleteProduct(id);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Delete product route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Erro ao deletar produto',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/categories', cacheResponse(300), async (c) => {
  try {
    const result = await productsService.getCategories();
    return c.json(result);
  } catch (error) {
    console.error('Get categories route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar categorias',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/orders', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    
    const validation = CreateOrderSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors.map(e => e.message).join(', '),
        },
      }, 400);
    }
    
    const { items, paymentMethod, shippingAddress, billingAddress } = validation.data;
    
    const result = await ordersService.createOrder(
      userId,
      items,
      paymentMethod,
      shippingAddress,
      billingAddress
    );
    
    return c.json(result, result.success ? 201 : 400);
  } catch (error) {
    console.error('Create order route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'ORDER_ERROR',
        message: 'Erro ao criar pedido',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/orders', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const result = await ordersService.getUserOrders(userId);
    
    return c.json(result);
  } catch (error) {
    console.error('Get user orders route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedidos',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/orders/:id', requireAuth, async (c) => {
  try {
    const orderId = c.req.param('id');
    const userId = c.get('userId');
    const result = await ordersService.getOrderById(orderId, userId);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Get order route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedido',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/orders/:id/cancel', requireAuth, async (c) => {
  try {
    const orderId = c.req.param('id');
    const userId = c.get('userId');
    const result = await ordersService.cancelOrder(orderId, userId);
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error('Cancel order route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CANCEL_ERROR',
        message: 'Erro ao cancelar pedido',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/admin/orders', requireAuth, requireAdmin, async (c) => {
  try {
    const result = await ordersService.getAllOrders();
    return c.json(result);
  } catch (error) {
    console.error('Get all orders route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pedidos',
      },
    }, 500);
  }
});

app.patch('/make-server-3ee85c18/admin/orders/:id/status', requireAuth, requireAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const { status, trackingCode } = body;
    
    const result = await ordersService.updateOrderStatus(orderId, status, trackingCode);
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error('Update order status route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar status',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/admin/statistics', requireAuth, requireAdmin, async (c) => {
  try {
    const result = await ordersService.getOrderStatistics();
    return c.json(result);
  } catch (error) {
    console.error('Get statistics route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'STATS_ERROR',
        message: 'Erro ao buscar estatísticas',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/payments/process', requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, method, cardData } = body;
    
    const orderResult = await ordersService.getOrderById(orderId);
    
    if (!orderResult.success || !orderResult.data) {
      return c.json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Pedido não encontrado',
        },
      }, 404);
    }
    
    const amount = orderResult.data.total;
    let result;
    
    switch (method) {
      case 'pix':
        result = await paymentService.generatePixPayment(orderId, amount);
        break;
      case 'credit_card':
        if (!cardData) {
          return c.json({
            success: false,
            error: {
              code: 'CARD_DATA_REQUIRED',
              message: 'Dados do cartão obrigatórios',
            },
          }, 400);
        }
        result = await paymentService.processCreditCardPayment(orderId, amount, cardData);
        break;
      case 'boleto':
        result = await paymentService.generateBoletoPayment(orderId, amount);
        break;
      default:
        return c.json({
          success: false,
          error: {
            code: 'INVALID_METHOD',
            message: 'Método de pagamento inválido',
          },
        }, 400);
    }
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error('Process payment route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'PAYMENT_ERROR',
        message: 'Erro ao processar pagamento',
      },
    }, 500);
  }
});

app.get('/make-server-3ee85c18/payments/order/:orderId', requireAuth, async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const result = await paymentService.getPaymentByOrderId(orderId);
    
    return c.json(result, result.success ? 200 : 404);
  } catch (error) {
    console.error('Get payment route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pagamento',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/payments/pix/:paymentId/confirm', async (c) => {
  try {
    const paymentId = c.req.param('paymentId');
    const result = await paymentService.confirmPixPayment(paymentId);
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error('Confirm PIX payment route error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CONFIRMATION_ERROR',
        message: 'Erro ao confirmar pagamento',
      },
    }, 500);
  }
});

app.post('/make-server-3ee85c18/send-email', async (c) => {
  try {
    const { to, orderId, customerName, totalAmount } = await c.req.json();

    console.log('📧 Sending email to:', to);

    return c.json({
      success: true,
      message: 'Email enviado com sucesso (simulado)',
      data: { to, orderId, customerName, totalAmount },
    });
  } catch (error) {
    console.error('Send email error:', error);
    return c.json({
      success: false,
      error: {
        code: 'EMAIL_ERROR',
        message: 'Erro ao enviar email',
      },
    }, 500);
  }
});


app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Rota não encontrada',
      path: c.req.path,
    },
  }, 404);
});


console.log('🚀 VORTEX TECH API - Enterprise Backend');
console.log('📡 Server starting...');
console.log('🔒 Authentication enabled');
console.log('🛡️  Rate limiting enabled');
console.log('📊 Logging enabled');
console.log('✅ Ready to serve requests');

Deno.serve(app.fetch);
