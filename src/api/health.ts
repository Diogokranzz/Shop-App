import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: {
                code: 'METHOD_NOT_ALLOWED',
                message: 'Método não permitido',
            },
        });
    }
    return res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            service: 'VORTEX-TECH-API',
            platform: 'Vercel',
        },
    });
}
