import * as kv from './kv_store.tsx';
import { updatePaymentStatus } from './orders.service.tsx';
import type { Payment, ApiResponse } from './types.tsx';

export async function generatePixPayment(
  orderId: string,
  amount: number
): Promise<ApiResponse<Payment>> {
  try {
    console.log('💳 Generating PIX payment for order:', orderId);
    
    const paymentId = crypto.randomUUID();
    
    const pixCode = generatePixCode(amount, orderId);
    const pixQrCode = await generatePixQRCode(pixCode);
    
    const payment: Payment = {
      id: paymentId,
      orderId,
      amount,
      method: 'pix',
      status: 'pending',
      pixCode,
      pixQrCode,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment:${paymentId}`, JSON.stringify(payment));
    await kv.set(`order:${orderId}:payment`, paymentId);
    
    console.log('✅ PIX payment generated:', paymentId);
    
    return {
      success: true,
      data: payment,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Generate PIX payment error:', error);
    return {
      success: false,
      error: {
        code: 'PIX_ERROR',
        message: 'Erro ao gerar pagamento PIX',
      },
    };
  }
}

export async function processCreditCardPayment(
  orderId: string,
  amount: number,
  cardData: {
    number: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }
): Promise<ApiResponse<Payment>> {
  try {
    console.log('💳 Processing credit card payment for order:', orderId);
    
    const cardValidation = validateCreditCard(cardData.number);
    if (!cardValidation.valid) {
      return {
        success: false,
        error: {
          code: 'INVALID_CARD',
          message: cardValidation.error || 'Cartão inválido',
        },
      };
    }
    
    const paymentId = crypto.randomUUID();
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isSuccess = Math.random() > 0.05;
    
    const payment: Payment = {
      id: paymentId,
      orderId,
      amount,
      method: 'credit_card',
      status: isSuccess ? 'completed' : 'failed',
      transactionId: isSuccess ? transactionId : undefined,
      cardLast4: cardData.number.slice(-4),
      createdAt: new Date().toISOString(),
      completedAt: isSuccess ? new Date().toISOString() : undefined,
    };
    
    await kv.set(`payment:${paymentId}`, JSON.stringify(payment));
    await kv.set(`order:${orderId}:payment`, paymentId);
    
    if (isSuccess) {
      await updatePaymentStatus(orderId, 'paid');
      console.log('✅ Credit card payment processed:', paymentId);
    } else {
      console.log('❌ Credit card payment failed:', paymentId);
    }
    
    return {
      success: true,
      data: payment,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Process credit card payment error:', error);
    return {
      success: false,
      error: {
        code: 'PAYMENT_ERROR',
        message: 'Erro ao processar pagamento',
      },
    };
  }
}

export async function generateBoletoPayment(
  orderId: string,
  amount: number
): Promise<ApiResponse<Payment>> {
  try {
    console.log('💳 Generating boleto for order:', orderId);
    
    const paymentId = crypto.randomUUID();
    
    const boletoBarcode = generateBoletoBarcode(amount, orderId);
    const boletoUrl = `https://boleto.vortextech.com/${paymentId}`;
    
    const payment: Payment = {
      id: paymentId,
      orderId,
      amount,
      method: 'boleto',
      status: 'pending',
      boletoBarcode,
      boletoUrl,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment:${paymentId}`, JSON.stringify(payment));
    await kv.set(`order:${orderId}:payment`, paymentId);
    
    console.log('✅ Boleto generated:', paymentId);
    
    return {
      success: true,
      data: payment,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Generate boleto error:', error);
    return {
      success: false,
      error: {
        code: 'BOLETO_ERROR',
        message: 'Erro ao gerar boleto',
      },
    };
  }
}

export async function getPaymentByOrderId(orderId: string): Promise<ApiResponse<Payment>> {
  try {
    const paymentId = await kv.get(`order:${orderId}:payment`);
    
    if (!paymentId) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_NOT_FOUND',
          message: 'Pagamento não encontrado',
        },
      };
    }
    
    const paymentJson = await kv.get(`payment:${JSON.parse(paymentId)}`);
    
    if (!paymentJson) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_NOT_FOUND',
          message: 'Dados de pagamento não encontrados',
        },
      };
    }
    
    return {
      success: true,
      data: JSON.parse(paymentJson),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get payment error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar pagamento',
      },
    };
  }
}

export async function confirmPixPayment(paymentId: string): Promise<ApiResponse<Payment>> {
  try {
    const paymentJson = await kv.get(`payment:${paymentId}`);
    
    if (!paymentJson) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_NOT_FOUND',
          message: 'Pagamento não encontrado',
        },
      };
    }
    
    const payment: Payment = JSON.parse(paymentJson);
    
    if (payment.method !== 'pix') {
      return {
        success: false,
        error: {
          code: 'INVALID_METHOD',
          message: 'Método de pagamento inválido',
        },
      };
    }
    
    const updatedPayment: Payment = {
      ...payment,
      status: 'completed',
      completedAt: new Date().toISOString(),
      transactionId: `PIX${Date.now()}`,
    };
    
    await kv.set(`payment:${paymentId}`, JSON.stringify(updatedPayment));
    await updatePaymentStatus(payment.orderId, 'paid');
    
    console.log('✅ PIX payment confirmed:', paymentId);
    
    return {
      success: true,
      data: updatedPayment,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Confirm PIX payment error:', error);
    return {
      success: false,
      error: {
        code: 'CONFIRMATION_ERROR',
        message: 'Erro ao confirmar pagamento',
      },
    };
  }
}

function generatePixCode(amount: number, orderId: string): string {
  const timestamp = Date.now().toString(36);
  const orderHash = orderId.substring(0, 8);
  const amountStr = amount.toFixed(2).replace('.', '');
  
  return `00020126580014BR.GOV.BCB.PIX0136${orderHash}${timestamp}520400005303986540${amountStr.padStart(8, '0')}5802BR5913VORTEX TECH6009SAO PAULO62070503***6304`;
}

async function generatePixQRCode(pixCode: string): Promise<string> {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
}

function generateBoletoBarcode(amount: number, orderId: string): string {
  const bankCode = '001';
  const currency = '9';
  const dueDate = Math.floor((Date.now() - new Date('1997-10-07').getTime()) / 86400000);
  const amountStr = Math.floor(amount * 100).toString().padStart(10, '0');
  const orderHash = orderId.replace(/-/g, '').substring(0, 10);
  
  return `${bankCode}${currency}${dueDate}${amountStr}${orderHash}`;
}

function validateCreditCard(cardNumber: string): { valid: boolean; error?: string } {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: 'Número do cartão deve conter apenas dígitos' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, error: 'Número do cartão inválido' };
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, error: 'Número do cartão inválido (falha na validação Luhn)' };
  }
  
  return { valid: true };
}
