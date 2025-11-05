import * as kv from './kv_store.tsx';
import type { Product } from './types.tsx';

const SEED_PRODUCTS: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "MacBook Pro M3",
    description: "Laptop profissional com chip M3, 16GB RAM, 512GB SSD",
    price: 15999,
    originalPrice: 18999,
    category: "Notebooks",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    stock: 15,
    discount: 16,
    isNew: true,
    isBestSeller: true,
    specs: {
      processor: "Apple M3",
      ram: "16GB",
      storage: "512GB SSD",
      screen: "14 polegadas",
    },
    tags: ["premium", "apple", "laptop"],
  },
  {
    name: "iPhone 15 Pro Max",
    description: "Smartphone top de linha com câmera de 48MP e chip A17 Pro",
    price: 9499,
    originalPrice: 10999,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1592286927505-38f17ed177f8?w=800",
    stock: 30,
    discount: 14,
    isNew: true,
    isBestSeller: true,
    specs: {
      processor: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      camera: "48MP",
    },
    tags: ["premium", "apple", "5g"],
  },
  {
    name: "Sony WH-1000XM5",
    description: "Headphone premium com cancelamento de ruído ativo",
    price: 1899,
    originalPrice: 2499,
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
    stock: 45,
    discount: 24,
    isBestSeller: true,
    specs: {
      bluetooth: "5.3",
      battery: "30h",
      anc: "Ativo",
    },
    tags: ["premium", "wireless", "anc"],
  },
  {
    name: "Samsung Odyssey G9",
    description: "Monitor ultrawide curvo 49\" 240Hz para gamers",
    price: 8999,
    originalPrice: 11999,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    stock: 8,
    discount: 25,
    isNew: true,
    specs: {
      size: "49 polegadas",
      resolution: "5120x1440",
      refresh: "240Hz",
      panel: "QLED",
    },
    tags: ["gaming", "ultrawide", "curved"],
  },
  {
    name: "Logitech MX Master 3S",
    description: "Mouse ergonômico para produtividade com 8000 DPI",
    price: 699,
    originalPrice: 899,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    stock: 60,
    discount: 22,
    isBestSeller: true,
    specs: {
      dpi: "8000",
      buttons: "7",
      battery: "70 dias",
    },
    tags: ["wireless", "productivity"],
  },
  {
    name: "iPad Pro 12.9\" M2",
    description: "Tablet profissional com chip M2 e tela Liquid Retina XDR",
    price: 11999,
    originalPrice: 13999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    stock: 20,
    discount: 14,
    isNew: true,
    specs: {
      processor: "Apple M2",
      ram: "16GB",
      storage: "512GB",
      screen: "12.9 polegadas",
    },
    tags: ["premium", "apple", "professional"],
  },
  {
    name: "Dell XPS 13 Plus",
    description: "Ultrabook premium com Intel Core i7 13ª geração",
    price: 8999,
    originalPrice: 10999,
    category: "Notebooks",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    stock: 12,
    discount: 18,
    specs: {
      processor: "Intel Core i7-13700H",
      ram: "16GB",
      storage: "1TB SSD",
      screen: "13.4 polegadas",
    },
    tags: ["premium", "ultrabook", "windows"],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Smartphone flagship com S Pen e câmera de 200MP",
    price: 7999,
    originalPrice: 9499,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    stock: 25,
    discount: 16,
    isNew: true,
    isBestSeller: true,
    specs: {
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "512GB",
      camera: "200MP",
    },
    tags: ["flagship", "android", "5g"],
  },
  {
    name: "Keychron K8 Pro",
    description: "Teclado mecânico wireless com hot-swap switches",
    price: 899,
    originalPrice: 1199,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    stock: 35,
    discount: 25,
    specs: {
      layout: "TKL",
      switches: "Hot-swap",
      battery: "240h",
      rgb: "Per-key RGB",
    },
    tags: ["mechanical", "wireless", "gaming"],
  },
  {
    name: "LG UltraGear 27GN950",
    description: "Monitor 4K 144Hz com HDR600 para gaming premium",
    price: 4999,
    originalPrice: 5999,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800",
    stock: 15,
    discount: 17,
    specs: {
      size: "27 polegadas",
      resolution: "3840x2160",
      refresh: "144Hz",
      hdr: "HDR600",
    },
    tags: ["4k", "gaming", "hdr"],
  },
  {
    name: "AirPods Pro 2",
    description: "Fones wireless com ANC adaptativo e áudio espacial",
    price: 1799,
    originalPrice: 2199,
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
    stock: 50,
    discount: 18,
    isBestSeller: true,
    specs: {
      anc: "Adaptativo",
      battery: "6h (30h com case)",
      audio: "Espacial",
    },
    tags: ["apple", "wireless", "anc"],
  },
  {
    name: "SSD Samsung 990 Pro 2TB",
    description: "SSD NVMe PCIe 4.0 ultra-rápido para desempenho extremo",
    price: 1299,
    originalPrice: 1699,
    category: "Componentes",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
    stock: 40,
    discount: 24,
    specs: {
      capacity: "2TB",
      interface: "PCIe 4.0 NVMe",
      read: "7450 MB/s",
      write: "6900 MB/s",
    },
    tags: ["storage", "nvme", "performance"],
  },
  {
    name: "Canon EOS R6 Mark II",
    description: "Câmera mirrorless full-frame 24MP com IBIS",
    price: 16999,
    originalPrice: 19999,
    category: "Câmeras",
    image: "https://images.unsplash.com/photo-1606982068106-8e21bdb3bfa6?w=800",
    stock: 5,
    discount: 15,
    isNew: true,
    specs: {
      sensor: "24MP Full-Frame",
      video: "4K 60fps",
      ibis: "8 stops",
      af: "Dual Pixel II",
    },
    tags: ["professional", "mirrorless", "video"],
  },
  {
    name: "Google Pixel 8 Pro",
    description: "Smartphone Google com IA avançada e câmera incrível",
    price: 6499,
    originalPrice: 7499,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
    stock: 18,
    discount: 13,
    isNew: true,
    specs: {
      processor: "Google Tensor G3",
      ram: "12GB",
      storage: "256GB",
      camera: "50MP",
    },
    tags: ["android", "ai", "camera"],
  },
  {
    name: "Razer BlackWidow V4 Pro",
    description: "Teclado mecânico gaming com display OLED e command dial",
    price: 1499,
    originalPrice: 1899,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800",
    stock: 22,
    discount: 21,
    specs: {
      switches: "Razer Green",
      display: "OLED",
      rgb: "Chroma RGB",
    },
    tags: ["gaming", "mechanical", "rgb"],
  },
  {
    name: "Microsoft Surface Pro 9",
    description: "2-em-1 versátil com processador Intel Core i7",
    price: 9499,
    originalPrice: 11499,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=800",
    stock: 14,
    discount: 17,
    specs: {
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB",
      screen: "13 polegadas",
    },
    tags: ["2-in-1", "windows", "professional"],
  },
  {
    name: "AMD Ryzen 9 7950X",
    description: "Processador 16-core/32-threads para desempenho extremo",
    price: 3499,
    originalPrice: 4199,
    category: "Componentes",
    image: "https://images.unsplash.com/photo-1555680202-c7d7028d8f8d?w=800",
    stock: 28,
    discount: 17,
    specs: {
      cores: "16",
      threads: "32",
      boost: "5.7 GHz",
      tdp: "170W",
    },
    tags: ["cpu", "amd", "performance"],
  },
  {
    name: "Bose QuietComfort 45",
    description: "Headphone bluetooth com ANC e bateria de 24h",
    price: 1599,
    originalPrice: 1999,
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    stock: 32,
    discount: 20,
    specs: {
      anc: "Ativo",
      battery: "24h",
      bluetooth: "5.1",
    },
    tags: ["wireless", "anc", "comfort"],
  },
  {
    name: "ASUS ROG Swift PG32UQ",
    description: "Monitor 4K 144Hz com G-Sync Ultimate para gaming",
    price: 6999,
    originalPrice: 8499,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404f29a?w=800",
    stock: 10,
    discount: 18,
    specs: {
      size: "32 polegadas",
      resolution: "3840x2160",
      refresh: "144Hz",
      gsync: "Ultimate",
    },
    tags: ["4k", "gaming", "gsync"],
  },
  {
    name: "Steam Deck OLED 1TB",
    description: "Portátil gaming com tela OLED e 1TB de armazenamento",
    price: 4499,
    originalPrice: 5299,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800",
    stock: 17,
    discount: 15,
    isNew: true,
    specs: {
      screen: "7.4\" OLED",
      storage: "1TB NVMe",
      battery: "50Wh",
      os: "SteamOS",
    },
    tags: ["gaming", "portable", "oled"],
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  
  try {
    let created = 0;
    let skipped = 0;
    
    for (const productData of SEED_PRODUCTS) {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const product: Product = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      
      const existingKeys = await kv.getByPrefix('product:');
      const exists = existingKeys?.some(key => {
        try {
          const p = JSON.parse(key);
          return p.name === product.name;
        } catch {
          return false;
        }
      });
      
      if (exists) {
  console.log(`⏭️  Skipping existing product: ${product.name}`);
        skipped++;
        continue;
      }
      
      await kv.set(`product:${id}`, JSON.stringify(product));
      await kv.set(`category:${product.category}:${id}`, id);
      
  console.log(`✅ Created: ${product.name} (${product.category})`);
      created++;
    }
    
  console.log('');
  console.log('🎉 Seed completed!');
  console.log(`✅ Created: ${created} products`);
  console.log(`⏭️  Skipped: ${skipped} products`);
  console.log(`📦 Total: ${SEED_PRODUCTS.length} products`);
    
    return {
      success: true,
      created,
      skipped,
      total: SEED_PRODUCTS.length,
    };
  } catch (error) {
  console.error('❌ Seed error:', error);
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)),
    };
  }
}

if (typeof process !== 'undefined' && require.main === module) {
  seedDatabase();
}
