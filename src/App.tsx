import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Menu,
  Grid3x3,
  TrendingUp,
  Package,
  Shield,
  ChevronUp,
  Star,
  ArrowLeftRight,
} from "lucide-react";
import { PixelProductCard, PixelProduct } from "./components/PixelProductCard";
import { PixelCartDrawer, PixelCartItem } from "./components/PixelCartDrawer";
import { VortexLogo } from "./components/VortexLogo";
import { TypewriterText } from "./components/TypewriterText";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { GlitchText } from "./components/GlitchText";
import { ScanlineEffect } from "./components/ScanlineEffect";
import { Input } from "./components/ui/input";
import { toast } from "sonner@2.0.3";
import { useSoundSystem, SoundToggle } from "./components/SoundSystem";
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from "./components/KeyboardShortcuts";
import { StatusBar } from "./components/StatusBar";
import { QuickView } from "./components/QuickView";
import { useRecentlyViewed, RecentlyViewed } from "./components/RecentlyViewed";
import { useWishlist, WishlistDrawer } from "./components/Wishlist";
import { useProductComparator, ProductComparator } from "./components/ProductComparator";
import { useEasterEggs, MatrixMode, SnakeGame } from "./components/EasterEggs";
import { ScrollProgress } from "./components/ScrollProgress";
import { PixelTooltip } from "./components/PixelTooltip";
import { useHighContrast, HighContrastToggle, HighContrastStyles } from "./components/HighContrastMode";
import { ViewModeToggle, ViewMode } from "./components/ViewModeToggle";
import { ProductBadge } from "./components/ProductBadge";
import { CountdownTimer } from "./components/CountdownTimer";
import { CustomCursor } from "./components/CustomCursor";

const products: PixelProduct[] = [
  {
    id: 1,
    name: "Carregador Rápido 65W - Carrega Notebook e Celular Ao Mesmo Tempo",
    price: 149.90,
    originalPrice: 199.90,
    image: "https://images.unsplash.com/photo-1676567464007-ab42eb6929f0?w=800&q=80",
    category: "Carregadores",
    rating: 4.8,
    inStock: true,
    discount: 25,
    specs: ["65W Super Potente", "2 Entradas USB"],
    keywords: ["carregador", "carregador rapido", "carga rapida", "usb c", "usb-c", "gan", "65w", "turbo", "fonte", "adaptador", "celular", "notebook", "laptop", "tomada", "carrega celular", "carregar celular", "carregar notebook"],
  },
  {
    id: 2,
    name: "Carregador Original Tipo Apple 30W - Carrega iPhone Rápido",
    price: 119.90,
    originalPrice: 159.90,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    category: "Carregadores",
    rating: 4.9,
    inStock: true,
    discount: 25,
    specs: ["30W Potência", "Carga Ultra Rápida"],
    keywords: ["carregador", "carregador apple", "carregador iphone", "usb c", "usb-c", "30w", "power delivery", "pd", "rapido", "carga rapida", "iphone", "ipad", "macbook", "apple", "original", "fonte", "adaptador", "tomada"],
  },
  {
    id: 3,
    name: "Carregador Duplo 18W - Carrega 2 Celulares de Uma Vez",
    price: 64.90,
    originalPrice: 89.90,
    image: "https://images.unsplash.com/photo-1736516434209-51ece1006788?w=800&q=80",
    category: "Carregadores",
    rating: 4.6,
    inStock: true,
    discount: 28,
    specs: ["18W Cada Porta", "2 Saídas USB"],
    keywords: ["carregador", "carregador duplo", "duas portas", "usb", "tipo c", "usb c", "qc 3.0", "quick charge", "18w", "dual", "fonte", "adaptador", "carregador 2 portas", "carregar 2 celulares", "tomada"],
  },
  {
    id: 4,
    name: "Base de Carregamento Sem Fio 30W - Só Encostar Para Carregar",
    price: 99.90,
    originalPrice: 139.90,
    image: "https://images.unsplash.com/photo-1633381638729-27f730955c23?w=800&q=80",
    category: "Carregadores",
    rating: 4.7,
    inStock: true,
    discount: 29,
    specs: ["30W Wireless", "Sem Cabo Necessário"],
    keywords: ["carregador", "carregador sem fio", "wireless", "sem fio", "inducao", "indução", "qi", "30w", "fast charge", "carga rapida", "carregador wireless", "base de carregamento", "iphone", "samsung", "xiaomi", "magsafe"],
  },
  {
    id: 5,
    name: "Carregador Para Carro 36W - Carrega Celular No Veículo",
    price: 49.90,
    originalPrice: 79.90,
    image: "https://images.unsplash.com/photo-1737312272830-f445719b7ed9?w=800&q=80",
    category: "Carregadores",
    rating: 4.5,
    inStock: true,
    discount: 38,
    specs: ["36W Potente", "Liga No Acendedor"],
    keywords: ["carregador", "carregador veicular", "carregador carro", "carro", "veiculo", "automotivo", "usb", "36w", "fast charge", "carga rapida", "acendedor", "12v", "dual", "duas portas", "carregar no carro"],
  },
  {
    id: 6,
    name: "Fone Sony Top de Linha - Cancela Todo Barulho Externo",
    price: 1599.00,
    originalPrice: 1899.00,
    image: "https://images.unsplash.com/photo-1598900863662-da1c3e6dd9d9?w=800&q=80",
    category: "Fones de Ouvido",
    rating: 5.0,
    inStock: true,
    discount: 16,
    specs: ["Cancelamento Ativo", "Som Premium"],
    keywords: ["fone", "fone de ouvido", "fone bluetooth", "fone sem fio", "earbuds", "earbud", "sony", "wireless", "sem fio", "anc", "cancelamento de ruido", "noise cancelling", "intra auricular", "intra", "preto", "audio", "musica", "true wireless"],
  },
  {
    id: 7,
    name: "Samsung Galaxy Buds - Fone Pequeno com Grave Potente",
    price: 899.00,
    originalPrice: 1199.00,
    image: "https://images.unsplash.com/photo-1590658308017-35148deff6a4?w=800&q=80",
    category: "Fones de Ouvido",
    rating: 4.7,
    inStock: true,
    discount: 25,
    specs: ["Som AKG", "11h de Bateria"],
    keywords: ["fone", "fone de ouvido", "fone bluetooth", "fone sem fio", "earbuds", "earbud", "samsung", "galaxy buds", "buds", "wireless", "sem fio", "akg", "audio", "musica", "true wireless", "intra auricular", "anc", "cancelamento"],
  },
  {
    id: 8,
    name: "JBL Headphone Grande - Cobre Toda Orelha com Grave Forte",
    price: 449.00,
    originalPrice: 599.00,
    image: "https://images.unsplash.com/photo-1651748749471-ffb243c9ca2b?w=800&q=80",
    category: "Fones de Ouvido",
    rating: 4.6,
    inStock: true,
    discount: 25,
    specs: ["Cancela Ruído", "50h Sem Carregar"],
    keywords: ["fone", "fone de ouvido", "headphone", "headfone", "fone bluetooth", "fone sem fio", "jbl", "wireless", "sem fio", "anc", "cancelamento de ruido", "over ear", "circum auricular", "audio", "musica", "bass", "graves"],
  },
  {
    id: 9,
    name: "AirPods Pro Apple Original - Conecta Automático com iPhone",
    price: 1899.00,
    originalPrice: 2199.00,
    image: "https://images.unsplash.com/photo-1623788736363-55d36908ab21?w=800&q=80",
    category: "Fones de Ouvido",
    rating: 5.0,
    inStock: true,
    discount: 14,
    specs: ["Chip H2 Apple", "Áudio Espacial"],
    keywords: ["fone", "fone de ouvido", "fone bluetooth", "airpods", "airpod", "apple", "iphone", "pro", "wireless", "sem fio", "earbuds", "anc", "cancelamento", "spatial audio", "audio espacial", "usb c", "usb-c", "h2", "true wireless"],
  },
  {
    id: 10,
    name: "Caixa JBL Boombox Gigante - Som Extremamente Alto Para Festas",
    price: 2799.00,
    originalPrice: 3299.00,
    image: "https://images.unsplash.com/photo-1608488458196-61cd3a720de8?w=800&q=80",
    category: "Caixas de Som",
    rating: 5.0,
    inStock: true,
    discount: 15,
    specs: ["80W Muito Potente", "Não Molha"],
    keywords: ["caixa", "caixa de som", "speaker", "som", "bluetooth", "jbl", "boombox", "portatil", "portable", "80w", "potente", "grave", "bass", "prova dagua", "resistente", "ip67", "camuflada", "audio", "musica", "festa"],
  },
  {
    id: 11,
    name: "Sony Extra Bass - Caixa Com Grave Que Vibra Forte",
    price: 1299.00,
    originalPrice: 1699.00,
    image: "https://images.unsplash.com/photo-1618532498309-08ba18e6da89?w=800&q=80",
    category: "Caixas de Som",
    rating: 4.9,
    inStock: true,
    discount: 24,
    specs: ["Grave Extra Potente", "24h de Música"],
    keywords: ["caixa", "caixa de som", "speaker", "som", "bluetooth", "sony", "portatil", "portable", "extra bass", "grave", "bass", "audio", "musica", "festa", "bateria", "sem fio", "wireless"],
  },
  {
    id: 12,
    name: "JBL Flip 6 Pequena - Leva Para Piscina e Praia Sem Medo",
    price: 649.00,
    originalPrice: 799.00,
    image: "https://images.unsplash.com/photo-1675523796635-d6e4d8a127b1?w=800&q=80",
    category: "Caixas de Som",
    rating: 4.8,
    inStock: true,
    discount: 19,
    specs: ["30W Potente", "Totalmente À Prova D'água"],
    keywords: ["caixa", "caixa de som", "speaker", "som", "bluetooth", "jbl", "flip", "portatil", "portable", "30w", "prova dagua", "resistente", "agua", "waterproof", "audio", "musica", "piscina", "praia", "grave", "bass"],
  },
  {
    id: 13,
    name: "Anker Compacta Barata - Caixa Pequena Com Som Bom",
    price: 299.00,
    originalPrice: 399.00,
    image: "https://images.unsplash.com/photo-1643385958950-8f0b8852171a?w=800&q=80",
    category: "Caixas de Som",
    rating: 4.7,
    inStock: true,
    discount: 25,
    specs: ["12W Boa Qualidade", "24h Sem Parar"],
    keywords: ["caixa", "caixa de som", "speaker", "som", "bluetooth", "anker", "soundcore", "portatil", "portable", "12w", "compacta", "barata", "audio", "musica", "bateria", "sem fio", "wireless", "grave", "bass"],
  },
  {
    id: 14,
    name: "Capa iPhone 15 Pro Max Anti-Impacto - Protege Em Quedas",
    price: 119.00,
    originalPrice: 149.00,
    image: "https://images.unsplash.com/photo-1599129784623-d294a8eba74d?w=800&q=80",
    category: "Capas",
    rating: 4.9,
    inStock: true,
    discount: 20,
    specs: ["Padrão Militar", "Cantos Reforçados"],
    keywords: ["capa", "capinha", "case", "iphone", "iphone 15", "iphone 15 pro max", "pro max", "apple", "spigen", "rugged", "armor", "fibra carbono", "carbono", "resistente", "protecao", "proteção", "queda", "militar"],
  },
  {
    id: 15,
    name: "Capa iPhone 16 Transparente - Mostra a Cor do Celular",
    price: 139.00,
    originalPrice: 169.00,
    image: "https://images.unsplash.com/photo-1690896616164-04fcf6caa57d?w=800&q=80",
    category: "Capas",
    rating: 4.8,
    inStock: true,
    discount: 18,
    specs: ["Cristalina", "Gruda MagSafe"],
    keywords: ["capa", "capinha", "case", "iphone", "iphone 16", "apple", "spigen", "transparente", "cristal", "clear", "magsafe", "magnetica", "imã", "protecao", "proteção", "hibrida", "hybrid"],
  },
  {
    id: 16,
    name: "Capa Samsung S24 Ultra Militar - A Mais Resistente Que Existe",
    price: 249.00,
    originalPrice: 299.00,
    image: "https://images.unsplash.com/photo-1677319208058-72d37f06dd1a?w=800&q=80",
    category: "Capas",
    rating: 5.0,
    inStock: true,
    discount: 17,
    specs: ["Queda de 3 Metros", "Tampa das Entradas"],
    keywords: ["capa", "capinha", "case", "samsung", "s24", "s24 ultra", "galaxy", "otterbox", "defender", "resistente", "protecao", "proteção", "queda", "militar", "preta", "black", "ultra resistente"],
  },
  {
    id: 17,
    name: "Capa Apple Silicone Original - Macia e Gruda No MagSafe",
    price: 349.00,
    originalPrice: 449.00,
    image: "https://images.unsplash.com/photo-1588586975816-61378a5d1f82?w=800&q=80",
    category: "Capas",
    rating: 4.9,
    inStock: true,
    discount: 22,
    specs: ["MagSafe Oficial", "Silicone Premium"],
    keywords: ["capa", "capinha", "case", "iphone", "iphone 15", "apple", "original", "silicone", "silicona", "magsafe", "magnetica", "imã", "protecao", "proteção", "oficial", "apple original"],
  },
  {
    id: 18,
    name: "Cabo USB-C 2 Metros - Carrega Notebook e Transfere Arquivos",
    price: 69.00,
    originalPrice: 89.00,
    image: "https://images.unsplash.com/photo-1639675960002-2f414c58ed79?w=800&q=80",
    category: "Cabos",
    rating: 4.8,
    inStock: true,
    discount: 22,
    specs: ["100W Potente", "2m Comprido"],
    keywords: ["cabo", "cabo usb", "usb c", "usb-c", "type c", "tipo c", "100w", "carregamento", "carga rapida", "power delivery", "pd", "2 metros", "longo", "comprido", "celular", "notebook", "macbook", "carregar", "nylon"],
  },
  {
    id: 19,
    name: "Cabo Lightning Certificado Apple - Para iPhone e iPad",
    price: 119.00,
    originalPrice: 149.00,
    image: "https://images.unsplash.com/photo-1609527071860-6871516954dd?w=800&q=80",
    category: "Cabos",
    rating: 4.9,
    inStock: true,
    discount: 20,
    specs: ["Selo MFi Apple", "Carga Rápida 20W"],
    keywords: ["cabo", "cabo lightning", "lightning", "raio", "iphone", "ipad", "apple", "usb c", "usb-c", "mfi", "certificado", "original", "carregamento", "carga rapida", "20w", "1 metro"],
  },
  {
    id: 20,
    name: "Cabo Anker 3 Metros Extra Longo - Usa Deitado No Sofá",
    price: 89.00,
    originalPrice: 119.00,
    image: "https://images.unsplash.com/photo-1751846545116-838fe2e7e815?w=800&q=80",
    category: "Cabos",
    rating: 4.8,
    inStock: true,
    discount: 25,
    specs: ["3m Extra Longo", "Super Resistente"],
    keywords: ["cabo", "cabo usb", "usb c", "usb-c", "lightning", "raio", "iphone", "ipad", "apple", "anker", "powerline", "carregamento", "carga rapida", "3 metros", "longo", "extra longo", "resistente", "duravel"],
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<PixelCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [categoryGlitch, setCategoryGlitch] = useState(false);
  
  const [quickViewProduct, setQuickViewProduct] = useState<PixelProduct | null>(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [matrixMode, setMatrixMode] = useState(false);
  const [snakeGame, setSnakeGame] = useState(false);
  const [customCursorEnabled, setCustomCursorEnabled] = useState(() => {
    const saved = localStorage.getItem("vortex-custom-cursor");
    return saved !== null ? saved === "true" : true;
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { playSound, enabled: soundsEnabled, setEnabled: setSoundsEnabled } = useSoundSystem();
  const { enabled: highContrastEnabled, setEnabled: setHighContrastEnabled } = useHighContrast();
  const { recentProducts, addToRecent } = useRecentlyViewed();
  const { wishlist, toggleWishlist, isInWishlist, clearWishlist } = useWishlist();
  const { compareList, toggleCompare, isInCompare, removeFromCompare, clearCompare } = useProductComparator();
  
  const { handleLogoClick } = useEasterEggs((egg) => {
    if (egg === "konami") {
      setMatrixMode(true);
      playSound("success");
      setTimeout(() => setMatrixMode(false), 5000);
    } else if (egg === "logo") {
      setSnakeGame(true);
      playSound("success");
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest(".menu-dropdown")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const categories = [
    "Todos",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    
    const matchesName = product.name.toLowerCase().includes(query);
    
    const matchesKeywords = product.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(query)
    ) || false;
    
    const matchesInCategory = product.category.toLowerCase().includes(query);
    
    const matchesSpecs = product.specs?.some((spec) =>
      spec.toLowerCase().includes(query)
    ) || false;
    
    const matchesSearch = matchesName || matchesKeywords || matchesInCategory || matchesSpecs;
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesOffers = showOffers ? product.discount && product.discount > 0 : true;
    return matchesSearch && matchesCategory && matchesOffers;
  });

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleOffers = () => {
    setShowOffers(!showOffers);
    setSelectedCategory("Todos");
    scrollToProducts();
    toast.success(showOffers ? "EXIBINDO TODOS OS PRODUTOS" : "FILTRANDO APENAS OFERTAS", {
      description: showOffers ? "" : `${products.filter(p => p.discount && p.discount > 0).length} produtos com desconto`,
    });
  };

  const totalSold = products.reduce((sum, p) => sum + (p.discount || 0), 0);

  const handleAddToCart = (product: PixelProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success("QUANTIDADE ATUALIZADA", {
          description: product.name,
        });
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("ADICIONADO AO CARRINHO", {
        description: product.name,
      });
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      toast.error("REMOVIDO DO CARRINHO", {
        description: item.name,
      });
    }
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  
  const shortcuts = [
    {
      key: "CMD+K",
      description: "Abrir busca",
      action: () => searchInputRef.current?.focus(),
    },
    {
      key: "CMD+B",
      description: "Abrir carrinho",
      action: () => {
        const drawer = document.querySelector('[aria-label="Carrinho de compras"]');
        if (drawer) (drawer as HTMLElement).click();
      },
    },
    {
      key: "CMD+W",
      description: "Abrir favoritos",
      action: () => setShowWishlist(true),
    },
    {
      key: "CMD+C",
      description: "Comparar produtos",
      action: () => setShowComparator(compareList.length > 0),
    },
    {
      key: "/",
      description: "Focar busca",
      action: () => searchInputRef.current?.focus(),
    },
    {
      key: "1",
      description: "Categoria: Todos",
      action: () => setSelectedCategory("Todos"),
    },
    {
      key: "2",
      description: "Categoria: Carregadores",
      action: () => setSelectedCategory("Carregadores"),
    },
    {
      key: "3",
      description: "Categoria: Fones de Ouvido",
      action: () => setSelectedCategory("Fones de Ouvido"),
    },
    {
      key: "4",
      description: "Categoria: Caixas de Som",
      action: () => setSelectedCategory("Caixas de Som"),
    },
    {
      key: "5",
      description: "Categoria: Capas",
      action: () => setSelectedCategory("Capas"),
    },
    {
      key: "6",
      description: "Categoria: Cabos",
      action: () => setSelectedCategory("Cabos"),
    },
  ];
  
  const { showHelp, setShowHelp } = useKeyboardShortcuts(shortcuts);
  
  useEffect(() => {
    localStorage.setItem("vortex-custom-cursor", customCursorEnabled.toString());
  }, [customCursorEnabled]);
  
  const handleAddToCartWithSound = (product: PixelProduct) => {
    handleAddToCart(product);
    playSound("addToCart");
    addToRecent(product);
  };
  
  const handleQuickViewNext = () => {
    if (!quickViewProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id);
    const nextProduct = filteredProducts[(currentIndex + 1) % filteredProducts.length];
    setQuickViewProduct(nextProduct);
    addToRecent(nextProduct);
  };
  
  const handleQuickViewPrev = () => {
    if (!quickViewProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id);
    const prevProduct = filteredProducts[(currentIndex - 1 + filteredProducts.length) % filteredProducts.length];
    setQuickViewProduct(prevProduct);
    addToRecent(prevProduct);
  };
  
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#808080] relative overflow-hidden">
      <HighContrastStyles />
      {customCursorEnabled && <CustomCursor />}
      <ScrollProgress />
      <KeyboardShortcutsHelp
        shortcuts={shortcuts}
        show={showHelp}
        onClose={() => setShowHelp(false)}
      />
      <MatrixMode active={matrixMode} />
      <SnakeGame active={snakeGame} onClose={() => setSnakeGame(false)} />
      
      <StatusBar
        totalProducts={products.length}
        totalCategories={categories.length - 1}
        cartItemCount={cartItems.length}
        cartTotal={cartTotal}
        currentFilter={selectedCategory !== "Todos" ? selectedCategory : showOffers ? "Ofertas" : undefined}
      />
      
      <RecentlyViewed
        onProductClick={(product) => {
          setQuickViewProduct(product);
          playSound("click");
        }}
      />
      
      <WishlistDrawer
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlist={wishlist}
        onRemove={(product) => {
          toggleWishlist(product);
          playSound("click");
        }}
        onAddToCart={(product) => {
          handleAddToCartWithSound(product);
          playSound("addToCart");
        }}
        onClear={() => {
          clearWishlist();
          playSound("click");
        }}
      />
      
      {showComparator && compareList.length > 0 && (
        <ProductComparator
          products={compareList}
          onClose={() => setShowComparator(false)}
          onRemove={(productId) => {
            const product = compareList.find(p => p.id === productId);
            if (product) removeFromCompare(productId);
            playSound("click");
          }}
          onAddToCart={(product) => {
            handleAddToCartWithSound(product);
            playSound("addToCart");
          }}
        />
      )}
      
      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNext={handleQuickViewNext}
        onPrev={handleQuickViewPrev}
        onAddToCart={(product) => {
          handleAddToCartWithSound(product);
          setQuickViewProduct(null);
        }}
        onToggleFavorite={(product) => {
          toggleWishlist(product);
          playSound("click");
        }}
        isFavorite={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
      />
      
      <motion.div
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, black 0px, black 1px, transparent 1px, transparent 2px)"
        }}
        animate={{
          y: [0, 2],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div 
        className="min-h-screen bg-white border-0 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScanlineEffect />
        
        <div className="flex items-center justify-between p-2 border-b-2 border-black bg-white relative z-20 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #000 0px, #000 1px, #fff 1px, #fff 2px)",
            }}
            animate={{
              x: [0, 2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex gap-1">
              <motion.button 
                className="w-4 h-4 border-2 border-black bg-white hover:bg-black transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                animate={{
                  backgroundColor: ["#ffffff", "#000000", "#ffffff"],
                  boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 2px rgba(0,0,0,0.3)", "0 0 0 0 rgba(0,0,0,0)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.button 
                className="w-4 h-4 border-2 border-black bg-white hover:bg-black transition-colors"
                whileHover={{ scale: 1.1, rotate: -90 }}
                animate={{
                  backgroundColor: ["#ffffff", "#000000", "#ffffff"],
                  boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 2px rgba(0,0,0,0.3)", "0 0 0 0 rgba(0,0,0,0)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
            
            <motion.div className="relative flex items-center gap-2">
              <motion.span
                className="text-sm font-bold"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  x: [-2, 0, -2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {"["}
              </motion.span>

              <motion.h1 
                className="text-sm font-bold tracking-wider relative"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(0,0,0,0)",
                    "1px 0 0px rgba(0,0,0,0.3)",
                    "0 0 0px rgba(0,0,0,0)",
                    "-1px 0 0px rgba(0,0,0,0.3)",
                    "0 0 0px rgba(0,0,0,0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                whileHover={{
                  scale: 1.05,
                  letterSpacing: "0.15em",
                }}
              >
                <motion.span
                  animate={{
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  VÓRTEX TECH STORE
                </motion.span>
                
                <motion.span
                  className="absolute -right-3 top-0"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "steps(2)"
                  }}
                >
                  _
                </motion.span>
              </motion.h1>

              <motion.span
                className="text-sm font-bold"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  x: [2, 0, 2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                {"]"}
              </motion.span>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 border-b border-[#C0C0C0] bg-white relative z-20 overflow-hidden">
          <nav className="flex gap-4 text-sm font-bold relative menu-dropdown">
            <div className="relative">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                  playSound("click");
                }}
                className={`flex items-center gap-1 px-2 py-1 hover:bg-black hover:text-white transition-none relative ${
                  menuOpen ? "bg-black text-white" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={menuOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.div>
                Menu
                {soundsEnabled && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-600 border border-white rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.1 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white border-2 border-black z-50 shadow-[4px_4px_0_black] overflow-hidden"
                  >
                    <motion.div
                      className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black pointer-events-none"
                      animate={{
                        opacity: [1, 0.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black pointer-events-none"
                      animate={{
                        opacity: [1, 0.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.75
                      }}
                    />
                    
                    <motion.button
                      onClick={() => {
                        scrollToProducts();
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative"
                      whileHover={{ x: 2 }}
                    >
                      Ver Produtos
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        toggleOffers();
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative"
                      whileHover={{ x: 2 }}
                    >
                      {showOffers ? "Todas" : "Ofertas"}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setSelectedCategory("Todos");
                        setSearchQuery("");
                        setShowOffers(false);
                        scrollToTop();
                        setMenuOpen(false);
                        playSound("click");
                        toast.success("FILTROS RESETADOS");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative"
                      whileHover={{ x: 2 }}
                    >
                      Limpar Filtros
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowAbout(true);
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative"
                      whileHover={{ x: 2 }}
                    >
                      Sobre a Loja
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setShowWishlist(true);
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative flex items-center justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span>Lista de Desejos</span>
                      {wishlist.length > 0 && (
                        <span className="bg-black text-white px-1 text-xs">{wishlist.length}</span>
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        if (compareList.length > 0) {
                          setShowComparator(true);
                        } else {
                          toast.error("NENHUM PRODUTO SELECIONADO", {
                            description: "Adicione produtos para comparar"
                          });
                        }
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative flex items-center justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span>Comparar</span>
                      {compareList.length > 0 && (
                        <span className="bg-black text-white px-1 text-xs">{compareList.length}/3</span>
                      )}
                    </motion.button>
                    
                    <div className="border-t-2 border-black my-1" />
                    
                    <motion.button
                      onClick={() => {
                        setSoundsEnabled(!soundsEnabled);
                        setMenuOpen(false);
                        if (!soundsEnabled) {
                          setTimeout(() => playSound("click"), 100);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative flex items-center justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span>Sons</span>
                      <span className="text-xs">{soundsEnabled ? "ON" : "OFF"}</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setHighContrastEnabled(!highContrastEnabled);
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white border-b border-[#C0C0C0] transition-none relative flex items-center justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span>Alto Contraste</span>
                      <span className="text-xs">{highContrastEnabled ? "ON" : "OFF"}</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setCustomCursorEnabled(!customCursorEnabled);
                        setMenuOpen(false);
                        playSound("click");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-black hover:text-white transition-none relative flex items-center justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span>Cursor Retro</span>
                      <span className="text-xs">{customCursorEnabled ? "ON" : "OFF"}</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={scrollToProducts}
              className="px-2 py-1 hover:bg-black hover:text-white transition-none relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Produtos
            </motion.button>
            <motion.button
              onClick={toggleOffers}
              className={`px-2 py-1 hover:bg-black hover:text-white transition-none relative ${
                showOffers ? "bg-black text-white" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={showOffers ? {
                boxShadow: ["0 0 0 0 rgba(0,0,0,0.5)", "0 0 0 4px rgba(0,0,0,0)", "0 0 0 0 rgba(0,0,0,0)"],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              Ofertas
            </motion.button>
            <motion.button
              onClick={() => setShowAbout(true)}
              className="px-2 py-1 hover:bg-black hover:text-white transition-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sobre
            </motion.button>
          </nav>

          <PixelCartDrawer
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>

        <AnimatePresence>
          {showAbout && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAbout(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)",
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border-4 border-black z-50 shadow-[8px_8px_0_black] overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-black pointer-events-none z-10"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-black pointer-events-none z-10"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-black pointer-events-none z-10"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-black pointer-events-none z-10"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                />
                
                <div className="flex items-center justify-between p-2 border-b-2 border-black bg-white relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 1px, #fff 1px, #fff 2px)",
                    }}
                    animate={{
                      x: [0, 2, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.h3 
                    className="text-sm font-bold relative z-10"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "1px 0 0px rgba(0,0,0,0.2)",
                        "0 0 0px rgba(0,0,0,0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    SOBRE A VÓRTEX
                  </motion.h3>
                  <motion.button
                    onClick={() => setShowAbout(false)}
                    className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-none relative z-10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="p-6 bg-[#C0C0C0] relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 4px)",
                    }}
                    animate={{
                      backgroundPosition: ["0px 0px", "4px 4px"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <motion.div 
                    className="bg-white border-2 border-black p-4 mb-4 relative z-10 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
                      }}
                      animate={{
                        backgroundPosition: ["0px 0px", "0px 4px"],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />

                    <div className="text-center mb-4 relative z-10">
                      <motion.div 
                        className="mb-3 inline-block scale-75"
                        animate={{
                          scale: [0.75, 0.85, 0.75],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <VortexLogo />
                      </motion.div>
                      <motion.h4 
                        className="text-xl font-bold mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          textShadow: [
                            "0 0 0px rgba(0,0,0,0)",
                            "2px 0 0px rgba(0,0,0,0.2)",
                            "0 0 0px rgba(0,0,0,0)",
                          ],
                        }}
                        transition={{
                          opacity: { duration: 0.5, delay: 0.3 },
                          x: { duration: 0.5, delay: 0.3 },
                          textShadow: { duration: 3, repeat: Infinity },
                        }}
                      >
                        VÓRTEX TECH STORE
                      </motion.h4>
                      <motion.p 
                        className="text-xs text-[#808080]"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          opacity: { duration: 0.5, delay: 0.4 },
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        Versão Pixel Edition 1.0
                      </motion.p>
                    </div>

                    <div className="space-y-3 text-sm relative z-10">
                      <motion.div 
                        className="border-t-2 border-dashed border-[#808080] pt-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <p className="mb-2">
                          <span className="font-bold">São Paulo, Brasil</span>
                        </p>
                        <p className="text-xs leading-relaxed mb-2">
                          <span className="font-bold">Desde 2018</span> revolucionando o mercado de tecnologia no Brasil.
                        </p>
                        <p className="text-xs leading-relaxed">
                          Fundada por entusiastas da tecnologia retrô e design pixel art, 
                          a VÓRTEX surgiu com a missão de trazer produtos tecnológicos 
                          premium com uma experiência de compra única, inspirada nos 
                          icônicos computadores Macintosh dos anos 80 e 90.
                        </p>
                      </motion.div>

                      <motion.div 
                        className="border-t-2 border-dashed border-[#808080] pt-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="mb-2">
                          <span className="font-bold">Nossa História</span>
                        </p>
                        <p className="text-xs leading-relaxed mb-2">
                          <span className="font-bold">2018:</span> Inauguração da primeira loja física no bairro da Liberdade, SP
                        </p>
                        <p className="text-xs leading-relaxed mb-2">
                          <span className="font-bold">2020:</span> Expansão para e-commerce durante a pandemia, alcançando todo o Brasil
                        </p>
                        <p className="text-xs leading-relaxed mb-2">
                          <span className="font-bold">2022:</span> Mais de 50.000 clientes satisfeitos e 200.000 produtos vendidos
                        </p>
                        <p className="text-xs leading-relaxed">
                          <span className="font-bold">2025:</span> Lançamento da Pixel Edition - união perfeita entre nostalgia e tecnologia moderna
                        </p>
                      </motion.div>

                      <motion.div 
                        className="border-t-2 border-dashed border-[#808080] pt-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <p className="mb-2">
                          <span className="font-bold">Diferenciais VÓRTEX</span>
                        </p>
                        <motion.p 
                          className="text-xs mb-1"
                          whileHover={{ x: 5, color: "#000" }}
                        >
                          • 20 produtos premium cuidadosamente selecionados
                        </motion.p>
                        <motion.p 
                          className="text-xs mb-1"
                          whileHover={{ x: 5, color: "#000" }}
                        >
                          • Descontos de até 38% em produtos originais
                        </motion.p>
                        <motion.p 
                          className="text-xs mb-1"
                          whileHover={{ x: 5, color: "#000" }}
                        >
                          • Entrega expressa para todo Brasil em até 48h
                        </motion.p>
                        <motion.p 
                          className="text-xs mb-1"
                          whileHover={{ x: 5, color: "#000" }}
                        >
                          • Garantia estendida em todos os produtos
                        </motion.p>
                        <motion.p 
                          className="text-xs"
                          whileHover={{ x: 5, color: "#000" }}
                        >
                          • Atendimento especializado por amantes de tecnologia
                        </motion.p>
                      </motion.div>

                      <motion.div 
                        className="border-t-2 border-dashed border-[#808080] pt-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <p className="mb-2">
                          <span className="font-bold">Nossa Missão</span>
                        </p>
                        <p className="text-xs leading-relaxed italic">
                          "Onde a tecnologia converge com a arte pixel. 
                          Acreditamos que comprar tecnologia deve ser uma experiência 
                          memorável, não apenas uma transação. Por isso, cada detalhe 
                          da nossa loja foi pensado para transportar você aos primórdios 
                          da computação, sem abrir mão da modernidade."
                        </p>
                      </motion.div>

                      <motion.div 
                        className="border-t-2 border-dashed border-[#808080] pt-3 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <motion.p 
                          className="text-xs text-[#808080] mb-1"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          © 2025 VÓRTEX Tech Store
                        </motion.p>
                        <p className="text-xs text-[#808080]">
                          São Paulo • Brasil • Todos os direitos reservados
                        </p>
                        <motion.p 
                          className="text-xs text-[#808080] mt-2"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                        >
                          Made by tech enthusiasts
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => setShowAbout(false)}
                    className="w-full py-2 px-4 bg-black text-white border-2 border-black text-sm font-bold hover:bg-white hover:text-black transition-none relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{
                        opacity: [0, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <span className="relative z-10">FECHAR</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <section className="relative p-8 lg:p-12 border-b-4 border-black bg-white overflow-hidden z-10">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 text-center">
            <div className="relative inline-block">
              <motion.div
                className="absolute -top-4 -left-4 w-2 h-2 bg-black"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -top-4 -right-4 w-2 h-2 bg-black"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-2 h-2 bg-black"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-2 h-2 bg-black"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />

              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1"
                animate={{
                  y: [-2, 0, -2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-black"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>

              <motion.div
                onClick={handleLogoClick}
                className="cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <VortexLogo />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1"
                animate={{
                  y: [2, 0, 2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-black"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            </div>

            <motion.div 
              className="text-sm lg:text-base mt-6 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <TypewriterText
                text="ONDE A TECNOLOGIA CONVERGE - CATÁLOGO PREMIUM DE ACESSÓRIOS TECH"
                speed={5}
                delay={0}
              />
            </motion.div>

            <div className="max-w-xl mx-auto relative overflow-hidden">
              <motion.div 
                className="flex border-2 border-black bg-white overflow-hidden relative"
                whileHover={{
                  boxShadow: "4px 4px 0 black",
                }}
                transition={{
                  duration: 0.2
                }}
              >
                <motion.div
                  className="absolute inset-0 border-2 border-black pointer-events-none"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="absolute left-4 top-1/2 -translate-y-1/2 overflow-hidden flex items-center justify-center z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.div>
                </div>
                <Input
                  type="search"
                  placeholder=""
                  className="pl-12 h-12 bg-white border-0 rounded-none text-black focus-visible:ring-0 focus-visible:ring-offset-0 relative z-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="p-4 border-b-2 border-black bg-[#C0C0C0] relative z-10 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 4px)",
            }}
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide relative">
            {categories.map((category, idx) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowOffers(false);
                  setCategoryGlitch(true);
                  setTimeout(() => setCategoryGlitch(false), 400);
                  playSound("click");
                }}
                className={`px-4 py-2 text-sm font-bold whitespace-nowrap border-2 border-black transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-[#808080] hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {category.toUpperCase()}
              </motion.button>
            ))}
          </div>

          {(showOffers || searchQuery || selectedCategory !== "Todos") && (
            <motion.div 
              className="mt-3 flex items-center gap-2 flex-wrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.span 
                className="text-xs font-bold"
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                FILTROS ATIVOS:
              </motion.span>
              {showOffers && (
                <motion.button
                  onClick={() => setShowOffers(false)}
                  className="px-2 py-1 text-xs bg-black text-white border border-white hover:bg-[#333] transition-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: ["0 0 0 0 rgba(255,255,255,0.5)", "0 0 0 2px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 1.5,
                      repeat: Infinity,
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚡ OFERTAS ✕
                </motion.button>
              )}
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="px-2 py-1 text-xs bg-black text-white border border-white hover:bg-[#333] transition-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔍 "{searchQuery}" ✕
                </motion.button>
              )}
              {selectedCategory !== "Todos" && (
                <motion.button
                  onClick={() => setSelectedCategory("Todos")}
                  className="px-2 py-1 text-xs bg-black text-white border border-white hover:bg-[#333] transition-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📁 {selectedCategory} ✕
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-3 border-b-2 border-black bg-white relative z-10 overflow-hidden">
          {[
            { icon: Package, label: "Produtos", value: filteredProducts.length, isNumber: true },
            { icon: TrendingUp, label: "Descontos", value: totalSold, suffix: "%", isNumber: true },
            { icon: Shield, label: "Garantia", value: "100%", isNumber: false },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-4 text-center overflow-hidden ${
                index < 2 ? "border-r-2 border-black" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="overflow-hidden flex justify-center mb-2">
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="flex items-center justify-center"
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
              </div>
              <p className="text-xs text-[#808080] mb-1">{stat.label}</p>
              <p className="text-xl font-bold">
                {stat.isNumber ? (
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix || ""} 
                    duration={1.5}
                  />
                ) : (
                  stat.value
                )}
              </p>
            </motion.div>
          ))}
        </div>

        <main id="products-section" className="p-4 lg:p-6 bg-[#C0C0C0] min-h-[400px] relative z-10 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #000 20px, #000 21px)",
            }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div 
            className="mb-6 pb-0 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3 
              className="text-center text-xl font-bold"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <GlitchText
                text={showOffers ? "═══ OFERTAS EXCLUSIVAS ═══" : "═══ CATÁLOGO COMPLETO ═══"}
                trigger={categoryGlitch}
              />
            </motion.h3>
            
            {showOffers && (
              <motion.p 
                className="text-center text-xs mt-3 text-[#333]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredProducts.length} produtos com desconto
              </motion.p>
            )}
          </motion.div>

          {filteredProducts.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-32 h-32 mx-auto mb-4 border-4 border-black bg-white flex items-center justify-center relative overflow-hidden"
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.75
                  }}
                />
                
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Package className="h-16 w-16" />
                </motion.div>
              </motion.div>
              <motion.p 
                className="text-lg font-bold mb-2"
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                NENHUM PRODUTO ENCONTRADO
              </motion.p>
              <motion.p 
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Tente buscar por outro termo
              </motion.p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <PixelProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product) => {
                    handleAddToCartWithSound(product);
                  }}
                  index={index}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="flex items-center justify-between p-2 border-t-2 border-black bg-[#C0C0C0] text-xs relative z-20 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
            }}
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="flex items-center gap-4 relative z-10">
            <motion.span
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0
              }}
            >
              Produtos: {filteredProducts.length}
            </motion.span>
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              |
            </motion.span>
            <motion.span
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3
              }}
            >
              Carrinho: {cartItems.length}
            </motion.span>
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              |
            </motion.span>
            <motion.span
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.6
              }}
            >
              Total: R${" "}
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </motion.span>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            <motion.span 
              className="w-2 h-2 bg-black border border-white"
              animate={{
                opacity: [1, 0, 1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "1px 0 0px rgba(0,0,0,0.3)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ONLINE
            </motion.span>
          </div>
        </footer>
      </motion.div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ 
              scale: 1.1,
              rotate: 360,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white border-4 border-black flex items-center justify-center hover:bg-black hover:text-white z-50 shadow-[4px_4px_0_black] transition-colors duration-200 overflow-hidden"
          >
            <motion.div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.75
              }}
            />
            
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="relative z-10"
            >
              <ChevronUp className="h-6 w-6" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0 bg-black"
              animate={{
                opacity: [0, 0.1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
