import { z } from 'npm:zod';

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

export const ProductIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

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
  productId: z.string().uuid(),
  quantity: z.number().int().positive('Quantidade deve ser positiva'),
  price: z.number().positive(),
  name: z.string(),
  image: z.string(),
});

export const CreateOrderSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Carrinho vazio'),
  paymentMethod: z.enum(['pix', 'credit_card', 'boleto'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' }),
  }),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export const ProcessPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['pix', 'credit_card', 'boleto']),
  cardData: z.object({
    number: z.string().regex(/^\d{16}$/).optional(),
    holderName: z.string().optional(),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/).optional(),
    expiryYear: z.string().regex(/^\d{2}$/).optional(),
    cvv: z.string().regex(/^\d{3,4}$/).optional(),
  }).optional(),
});

export const CreateReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5, 'Avaliação deve ser entre 1 e 5'),
  title: z.string().min(3, 'Título muito curto'),
  comment: z.string().min(10, 'Comentário muito curto'),
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(3, 'Código inválido'),
  orderTotal: z.number().positive(),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(3, 'Código muito curto').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
});

export const UpdateStockSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.enum(['in', 'out', 'adjustment']),
  reason: z.string().min(3),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
});

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: messages };
    }
    return { success: false, error: 'Erro de validação' };
  }
}
