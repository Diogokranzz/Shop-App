import * as kv from './kv_store.tsx';
import type { Product, ApiResponse, PaginationParams, FilterParams } from './types.tsx';

export async function getProducts(
  pagination: PaginationParams = {},
  filters: FilterParams = {}
): Promise<ApiResponse<{ products: Product[]; total: number }>> {
  try {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const { category, minPrice, maxPrice, search, tags, inStock } = filters;
    
    console.log('📦 Fetching products with filters:', filters);
    
    const productKeys = await kv.getByPrefix('product:');
    
    if (!productKeys || productKeys.length === 0) {
      return {
        success: true,
        data: {
          products: [],
          total: 0,
        },
        meta: {
          page,
          limit,
          total: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    let products: Product[] = productKeys
      .map(key => {
        try {
          return JSON.parse(key);
        } catch {
          return null;
        }
      })
      .filter(p => p !== null);
    
    if (category && category !== 'Todos') {
      products = products.filter(p => p.category === category);
    }
    
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (tags && tags.length > 0) {
      products = products.filter(p => 
        p.tags?.some(tag => tags.includes(tag))
      );
    }
    
    if (inStock === true) {
      products = products.filter(p => p.stock > 0);
    }
    
    const total = products.length;
    
    products.sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: {
        products: paginatedProducts,
        total,
      },
      meta: {
        page,
        limit,
        total,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get products error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar produtos',
        details: error.message,
      },
    };
  }
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  try {
    const productJson = await kv.get(`product:${id}`);
    
    if (!productJson) {
      return {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produto não encontrado',
        },
      };
    }
    
    const product: Product = JSON.parse(productJson);
    
    return {
      success: true,
      data: product,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get product error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar produto',
      },
    };
  }
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const product: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    await kv.set(`product:${id}`, JSON.stringify(product));
    
    await kv.set(`category:${productData.category}:${id}`, id);
    
    console.log('✅ Product created:', id);
    
    return {
      success: true,
      data: product,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Create product error:', error);
    return {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Erro ao criar produto',
      },
    };
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<ApiResponse<Product>> {
  try {
    const productJson = await kv.get(`product:${id}`);
    
    if (!productJson) {
      return {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produto não encontrado',
        },
      };
    }
    
    const product: Product = JSON.parse(productJson);
    const updatedProduct: Product = {
      ...product,
      ...updates,
      id: product.id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`product:${id}`, JSON.stringify(updatedProduct));
    
    console.log('✅ Product updated:', id);
    
    return {
      success: true,
      data: updatedProduct,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Update product error:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Erro ao atualizar produto',
      },
    };
  }
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  try {
    const productJson = await kv.get(`product:${id}`);
    
    if (!productJson) {
      return {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produto não encontrado',
        },
      };
    }
    
    const product: Product = JSON.parse(productJson);
    
    await kv.del(`product:${id}`);
    await kv.del(`category:${product.category}:${id}`);
    
    console.log('✅ Product deleted:', id);
    
    return {
      success: true,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Delete product error:', error);
    return {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Erro ao deletar produto',
      },
    };
  }
}

export async function updateStock(
  productId: string,
  quantity: number,
  operation: 'add' | 'subtract' | 'set'
): Promise<ApiResponse<Product>> {
  try {
    const productJson = await kv.get(`product:${productId}`);
    
    if (!productJson) {
      return {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produto não encontrado',
        },
      };
    }
    
    const product: Product = JSON.parse(productJson);
    let newStock = product.stock;
    
    switch (operation) {
      case 'add':
        newStock += quantity;
        break;
      case 'subtract':
        newStock -= quantity;
        if (newStock < 0) {
          return {
            success: false,
            error: {
              code: 'INSUFFICIENT_STOCK',
              message: 'Estoque insuficiente',
            },
          };
        }
        break;
      case 'set':
        newStock = quantity;
        break;
    }
    
    const updatedProduct: Product = {
      ...product,
      stock: newStock,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`product:${productId}`, JSON.stringify(updatedProduct));
    
    console.log('✅ Stock updated:', productId, 'New stock:', newStock);
    
    return {
      success: true,
      data: updatedProduct,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Update stock error:', error);
    return {
      success: false,
      error: {
        code: 'STOCK_UPDATE_ERROR',
        message: 'Erro ao atualizar estoque',
      },
    };
  }
}

export async function getCategories(): Promise<ApiResponse<string[]>> {
  try {
    const productKeys = await kv.getByPrefix('product:');
    
    if (!productKeys || productKeys.length === 0) {
      return {
        success: true,
        data: [],
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    const products: Product[] = productKeys
      .map(key => {
        try {
          return JSON.parse(key);
        } catch {
          return null;
        }
      })
      .filter(p => p !== null);
    
    const categories = [...new Set(products.map(p => p.category))];
    
    return {
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Get categories error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Erro ao buscar categorias',
      },
    };
  }
}
