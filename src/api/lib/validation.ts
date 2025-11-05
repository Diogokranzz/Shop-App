import { z } from 'zod';
export const SignUpSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});
export const SignInSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha obrigatória'),
});
export const CreateProductSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
    price: z.number().positive('Preço deve ser positivo'),
    originalPrice: z.number().positive().optional(),
    category: z.string().min(1, 'Categoria obrigatória'),
    image: z.string().url('URL de imagem inválida'),
    stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
    discount: z.number().min(0).max(100).optional(),
    isNew: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    specs: z.record(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});
export const UpdateProductSchema = CreateProductSchema.partial();
export const AddressSchema = z.object({
    street: z.string().min(3, 'Rua obrigatória'),
    number: z.string().min(1, 'Número obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro obrigatório'),
    city: z.string().min(2, 'Cidade obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    country: z.string().default('Brasil'),
});
export const CartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive('Quantidade deve ser positiva'),
    price: z.number().positive(),
    name: z.string(),
    image: z.string(),
});
export const CreateOrderSchema = z.object({
    items: z.array(CartItemSchema).min(1, 'Carrinho vazio'),
    paymentMethod: z.enum(['pix', 'credit_card', 'boleto']),
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema.optional(),
});
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
} {
    try {
        const validated = schema.parse(data);
        return { success: true, data: validated };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            return { success: false, error: messages };
        }
        return { success: false, error: 'Erro de validação' };
    }
}
