import { Context, Next } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import type { User } from './types.tsx';

export async function corsMiddleware(c: Context, next: Next) {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  
  console.log(`➡️  [${new Date().toISOString()}] ${method} ${path}`);
  
  await next();
  
  const duration = Date.now() - start;
  const status = c.res.status;
  const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
  
  console.log(`${statusEmoji} [${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)`);
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error('❌ ERROR:', error);
    
    const isDev = Deno.env.get('DENO_ENV') !== 'production';
    
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
        details: isDev ? error.message : undefined,
        stack: isDev ? error.stack : undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }, 500);
  }
}

export function rateLimiter(config: { maxRequests: number; windowMs: number }) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const key = `ratelimit:${ip}`;
    
    try {
      const data = await kv.get(key);
      const now = Date.now();
      
      if (data) {
        const { count, resetAt } = JSON.parse(data);
        
        if (now < resetAt) {
          if (count >= config.maxRequests) {
            return c.json({
              success: false,
              error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Muitas requisições. Tente novamente mais tarde.',
                details: {
                  retryAfter: Math.ceil((resetAt - now) / 1000),
                },
              },
            }, 429);
          }
          
          await kv.set(key, JSON.stringify({
            count: count + 1,
            resetAt,
          }));
        } else {
          await kv.set(key, JSON.stringify({
            count: 1,
            resetAt: now + config.windowMs,
          }));
        }
      } else {
        await kv.set(key, JSON.stringify({
          count: 1,
          resetAt: now + config.windowMs,
        }));
      }
      
      await next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      await next();
    }
  };
}

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token de autenticação não fornecido',
      },
    }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido ou expirado',
        },
      }, 401);
    }
    
    c.set('user', user);
    c.set('userId', user.id);
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Erro ao validar autenticação',
      },
    }, 401);
  }
}

export async function requireAdmin(c: Context, next: Next) {
  const user = c.get('user');
  
  if (!user) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Autenticação necessária',
      },
    }, 401);
  }
  
  const userRole = user.user_metadata?.role || 'customer';
  
  if (userRole !== 'admin') {
    return c.json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Acesso negado. Permissão de administrador necessária.',
      },
    }, 403);
  }
  
  await next();
}

export async function auditLog(action: string, resource: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip');
    const userAgent = c.req.header('user-agent');
    
    await next();
    
    try {
      const logId = crypto.randomUUID();
      const log = {
        id: logId,
        userId,
        action,
        resource,
        resourceId: c.get('resourceId'),
        details: c.get('auditDetails'),
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      };
      
      await kv.set(`audit:${logId}`, JSON.stringify(log));
      console.log('📋 Audit Log:', log);
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  };
}

export function validateRequest(schema: any) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedData', validated);
      await next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const messages = error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return c.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dados inválidos',
            details: messages,
          },
        }, 400);
      }
      
      return c.json({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'JSON inválido',
        },
      }, 400);
    }
  };
}

export function cacheResponse(ttlSeconds: number) {
  return async (c: Context, next: Next) => {
    const cacheKey = `cache:${c.req.method}:${c.req.path}`;
    
    try {
      const cached = await kv.get(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        console.log('💾 Cache HIT:', cacheKey);
        return c.json(data);
      }
      
      console.log('🔍 Cache MISS:', cacheKey);
      await next();
      
      const response = await c.res.clone().json();
      await kv.set(cacheKey, JSON.stringify(response));
      
      setTimeout(async () => {
        await kv.del(cacheKey);
      }, ttlSeconds * 1000);
      
    } catch (error) {
      console.error('Cache middleware error:', error);
      await next();
    }
  };
}
