import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import type { User, ApiResponse } from './types.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<ApiResponse<{ user: User; accessToken: string }>> {
  try {
    console.log('🔐 Creating new user:', email);
    
    const existingUser = await kv.get(`user:email:${email}`);
    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'Email já cadastrado',
        },
      };
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'customer',
      },
    });
    
    if (error) {
      console.error('Supabase auth error:', error);
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error.message,
        },
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        error: {
          code: 'USER_CREATION_FAILED',
          message: 'Falha ao criar usuário',
        },
      };
    }
    
    const user: User = {
      id: data.user.id,
      email,
      name,
      role: 'customer',
      createdAt: new Date().toISOString(),
      metadata: {},
    };
    
    await kv.set(`user:${user.id}`, JSON.stringify(user));
    await kv.set(`user:email:${email}`, user.id);
    
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError || !sessionData.session) {
      console.error('Sign in after signup failed:', signInError);
      return {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: 'Usuário criado mas falha ao gerar sessão',
        },
      };
    }
    
    console.log('✅ User created successfully:', user.id);
    
    return {
      success: true,
      data: {
        user,
        accessToken: sessionData.session.access_token,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: {
        code: 'SIGNUP_ERROR',
        message: 'Erro ao criar conta',
        details: error.message,
      },
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<{ user: User; accessToken: string }>> {
  try {
    console.log('🔐 User signing in:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email ou senha incorretos',
        },
      };
    }
    
    if (!data.session || !data.user) {
      return {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: 'Falha ao criar sessão',
        },
      };
    }
    
    const userJson = await kv.get(`user:${data.user.id}`);
    let user: User;
    
    if (userJson) {
      user = JSON.parse(userJson);
    } else {
      user = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'customer',
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${user.id}`, JSON.stringify(user));
    }
    
    console.log('✅ User signed in:', user.id);
    
    return {
      success: true,
      data: {
        user,
        accessToken: data.session.access_token,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: {
        code: 'SIGNIN_ERROR',
        message: 'Erro ao fazer login',
        details: error.message,
      },
    };
  }
}

export async function signOut(accessToken: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.admin.signOut(accessToken);
    
    if (error) {
      console.error('Sign out error:', error);
    }
    
    console.log('✅ User signed out');
    
    return {
      success: true,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: {
        code: 'SIGNOUT_ERROR',
        message: 'Erro ao fazer logout',
      },
    };
  }
}

export async function getUserProfile(userId: string): Promise<ApiResponse<User>> {
  try {
    const userJson = await kv.get(`user:${userId}`);
    
    if (!userJson) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        },
      };
    }
    
    const user: User = JSON.parse(userJson);
    
    return {
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      error: {
        code: 'PROFILE_ERROR',
        message: 'Erro ao buscar perfil',
      },
    };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> {
  try {
    const userJson = await kv.get(`user:${userId}`);
    
    if (!userJson) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        },
      };
    }
    
    const user: User = JSON.parse(userJson);
    const updatedUser = {
      ...user,
      ...updates,
      id: user.id,
      email: user.email,
    };
    
    await kv.set(`user:${userId}`, JSON.stringify(updatedUser));
    
    console.log('✅ User profile updated:', userId);
    
    return {
      success: true,
      data: updatedUser,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar perfil',
      },
    };
  }
}

export async function verifyToken(token: string): Promise<ApiResponse<User>> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido ou expirado',
        },
      };
    }
    
    const userJson = await kv.get(`user:${user.id}`);
    
    if (!userJson) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        },
      };
    }
    
    return {
      success: true,
      data: JSON.parse(userJson),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Verify token error:', error);
    return {
      success: false,
      error: {
        code: 'VERIFICATION_ERROR',
        message: 'Erro ao verificar token',
      },
    };
  }
}
