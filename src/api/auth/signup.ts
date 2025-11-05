import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SignUpSchema } from '../lib/validation';
import * as authService from '../services/auth.service';
export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: {
                code: 'METHOD_NOT_ALLOWED',
                message: 'Método não permitido',
            },
        });
    }
    try {
        const validation = SignUpSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: validation.error.errors.map(e => e.message).join(', '),
                },
            });
        }
        const { email, password, name } = validation.data;
        const result = await authService.signUp(email, password, name);
        return res.status(result.success ? 201 : 400).json(result);
    }
    catch (error: any) {
        console.error('Signup endpoint error:', error);
        return res.status(500).json({
            success: false,
            error: {
                code: 'SIGNUP_ERROR',
                message: 'Erro ao criar conta',
                details: error.message,
            },
        });
    }
}
