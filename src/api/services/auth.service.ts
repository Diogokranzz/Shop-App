import { createClient } from '@supabase/supabase-js';
import * as kv from '../config/vercel-kv';
import type { User, ApiResponse } from '../lib/types';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function signUp(email: string, password: string, name: string): Promise<ApiResponse<{
    user: User;
    accessToken: string;
}>> {
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
        if (error || !data.user) {
            return {
                success: false,
                error: {
                    code: 'AUTH_ERROR',
                    message: error?.message || 'Falha ao criar usuário',
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
    }
    catch (error: any) {
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
export async function signIn(email: string, password: string): Promise<ApiResponse<{
    user: User;
    accessToken: string;
}>> {
    try {
        console.log('🔐 User signing in:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.session || !data.user) {
            return {
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email ou senha incorretos',
                },
            };
        }
        const userJson = await kv.get(`user:${data.user.id}`);
        let user: User;
        if (userJson) {
            user = JSON.parse(userJson);
        }
        else {
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
    }
    catch (error: any) {
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
    }
    catch (error: any) {
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
    }
    catch (error: any) {
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
