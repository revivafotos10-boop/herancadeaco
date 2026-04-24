import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  Star, 
  Pencil, 
  X, 
  Flame, 
  Timer, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  Crown,
  Lock,
  ChevronRight,
  Menu,
  User,
  Gift,
  ArrowRight,
  Loader2,
  Sword
} from 'lucide-react';
import UrgencyBanner from '@/components/UrgencyBanner';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  image_url: string;
  gallery_images: string[];
  features: string[];
  active: boolean;
}

const testimonials = [
  {
    name: "Carlos Alberto",
    role: "Mestre Cuteleiro",
    content: "A qualidade do aço e o equilíbrio do centro de massa são impressionantes. Uma obra de engenharia real.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Mariana Silva",
    role: "Entusiasta de Cutelaria",
    content: "Presenteei meu pai com uma lâmina personalizada e ele ficou sem palavras. A gravação é impecável e definitiva.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Ricardo Mendes",
    role: "Colecionador",
    content: "Uma verdadeira peça de museu. O acabamento em madeira de lei e a têmpera do aço são de outro nível.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  }
];

const fonts = ['Manuscrita', 'Caligrafia', 'Sans-Serif', 'Serif', 'Bold'];
const symbols = ['Nenhum', '⚓', '⚔️', '🔥', '🛡️', '🐎', '🤠'];
const sizes = ['8"', '10"', '12"'];

const PRODUCT_DEFAULTS: Record<string, { size: string, font: string, symbol: string }> = {
  'Cutelo Artesanal Brut': { size: '8"', font: 'Bold', symbol: '⚔️' },
  'Lâmina de Elite Gold': { size: '10"', font: 'Serif', symbol: 'Nenhum' },
  'Herança Silvestre': { size: '12"', font: 'Caligrafia', symbol: '🔥' },
  'Faca Guardião 20cm Inox': { size: '8"', font: 'Serif', symbol: '🛡️' },
  '🔥 Faca Imperador 31cm – Cabo em Osso': { size: '12"', font: 'Serif', symbol: 'Nenhum' },
};

const KnifeCustomizer = ({ product, onClose, onAddToCart }) => {
  const getProductDefault = (key: 'size' | 'font' | 'symbol') => {
    return PRODUCT_DEFAULTS[product.name]?.[key] || (key === 'size' ? sizes[1] : key === 'font' ? fonts[0] : symbols[0]);
  };

  const [engravedName, setEngravedName] = useState(() => localStorage.getItem(`engravedName_${product.id}`) || '');
  const [selectedFont, setSelectedFont] = useState(() => localStorage.getItem(`selectedFont_${product.id}`) || getProductDefault('font'));
  const [selectedSymbol, setSelectedSymbol] = useState(() => localStorage.getItem(`selectedSymbol_${product.id}`) || getProductDefault('symbol'));
  const [selectedSize, setSelectedSize] = useState(() => localStorage.getItem(`selectedSize_${product.id}`) || getProductDefault('size'));
  const [previewImage, setPreviewImage] = useState(product.image_url);

  useEffect(() => {
    localStorage.setItem(`engravedName_${product.id}`, engravedName);
    localStorage.setItem(`selectedFont_${product.id}`, selectedFont);
    localStorage.setItem(`selectedSymbol_${product.id}`, selectedSymbol);
    localStorage.setItem(`selectedSize_${product.id}`, selectedSize);
  }, [engravedName, selectedFont, selectedSymbol, selectedSize, product.id]);

  const getSizeScale = () => {
    switch(selectedSize) {
      case '8"': return { width: '50%', height: '35%', fontSize: '1.2rem' };
      case '12"': return { width: '70%', height: '45%', fontSize: '1.8rem' };
      default: return { width: '60%', height: '40%', fontSize: '1.5rem' };
    }
  };

  const scale = getSizeScale();

  const handleAddToCart = () => {
    onAddToCart({ product, engravedName, selectedFont, selectedSymbol, selectedSize });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a] w-full max-w-5xl rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row border border-zinc-800/50 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-20 p-2 transition-colors"><X /></button>
        
        <div className="md:w-3/5 p-6 md:p-12 bg-zinc-900/50 flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="relative w-full max-w-lg aspect-video flex items-center justify-center">
            <motion.div
              animate={{ 
                filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-xl"
            >
              {previewImage ? (
                <img src={previewImage} alt={product.name} className="w-full h-auto object-contain rounded-xl p-8" />
              ) : (
                <div className="w-full h-full bg-zinc-900/50 rounded-xl flex items-center justify-center border border-dashed border-zinc-800">
                  <span className="text-zinc-700 font-serif italic text-sm">Imagem não cadastrada</span>
                </div>
              )}
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="absolute border border-dashed border-amber-500/20"
                style={{ width: scale.width, height: scale.height }}
              />
              <motion.div 
                animate={{ opacity: engravedName ? 1 : 0.4 }}
                className="text-amber-500/90 text-center px-4"
                style={{ 
                  fontFamily: selectedFont === 'Manuscrita' ? 'Dancing Script, cursive' : 
                             selectedFont === 'Caligrafia' ? 'Great Vibes, cursive' :
                             selectedFont === 'Serif' ? 'Cormorant Garamond, serif' : 'Montserrat, sans-serif',
                  fontWeight: selectedFont === 'Bold' ? '700' : '400',
                  fontSize: engravedName.length > 15 ? `calc(${scale.fontSize} * 0.7)` : scale.fontSize,
                  letterSpacing: '0.05em',
                  textShadow: '0 0 12px rgba(217,119,6,0.4)'
                }}
              >
                {engravedName || "SEU NOME"} {selectedSymbol !== 'Nenhum' && selectedSymbol}
              </motion.div>
            </div>
          </div>
          {product.gallery_images && product.gallery_images.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar max-w-full">
              {[product.image_url, ...product.gallery_images].filter(Boolean).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setPreviewImage(img)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${previewImage === img ? 'border-amber-500 scale-110 shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'border-zinc-800 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-8 text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Simulador de Gravação Laser
          </p>
        </div>

        <div className="md:w-2/5 flex flex-col border-l border-zinc-800 bg-zinc-950">
          <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-serif tracking-tight">Sua {product.name}</h2>
              <p className="text-zinc-500 text-sm">Personalização artesanal e definitiva.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Texto na Lâmina</label>
                <input 
                  type="text" 
                  value={engravedName}
                  onChange={(e) => setEngravedName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-amber-600 outline-none transition-all placeholder:text-zinc-700 uppercase"
                  placeholder="Ex: PAI JOÃO"
                  maxLength={25}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Fonte</label>
                <div className="grid grid-cols-2 gap-2">
                  {fonts.map(font => (
                    <button 
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      className={`p-3 rounded-lg border text-sm transition-all ${selectedFont === font ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-semibold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Símbolo</label>
                <div className="grid grid-cols-4 gap-2">
                  {symbols.map(symbol => (
                    <button 
                      key={symbol}
                      onClick={() => setSelectedSymbol(symbol)}
                      className={`p-3 rounded-lg border text-xl transition-all ${selectedSymbol === symbol ? 'border-amber-500 bg-amber-500/10 text-amber-500 scale-105' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Polegadas</label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-lg border text-sm transition-all ${selectedSize === size ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-semibold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-zinc-800 bg-zinc-950 mt-auto">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-5 rounded-lg font-bold hover:from-amber-600 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] uppercase tracking-widest text-sm"
            >
              Adicionar ao Pedido
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productData) => {
    setCart([...cart, { ...productData, cartId: Date.now() }]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = typeof item.product.price === 'number' 
      ? item.product.price 
      : parseFloat(item.product.price.toString().replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price;
  }, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <UrgencyBanner className="z-[90] relative" />
      {/* Cinematic Header */}
      <nav className={`fixed w-full z-[80] transition-all duration-700 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4 border-b border-zinc-900 shadow-2xl' : 'bg-transparent py-8 mt-10 md:mt-12'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Sword className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl md:text-2xl font-black font-serif tracking-[0.3em] text-white uppercase group-hover:text-amber-500 transition-colors">Herança de Aço</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold tracking-[0.3em] text-zinc-400">
            <a href="#produtos" className="hover:text-white transition-colors">COLEÇÃO</a>
            <a href="#personalizacao" className="hover:text-white transition-colors">PERSONALIZAÇÃO</a>
            <a href="#historia" className="hover:text-white transition-colors">HISTÓRIA</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="group relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden text-zinc-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#050505] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-10" />
          <div className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] bg-amber-900/20 blur-[150px] rounded-full -translate-y-1/2" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-950/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md"
              >
                <Gift className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Campanha Dia dos Pais</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-6xl md:text-[100px] font-black font-serif leading-[0.9] tracking-tighter">
                  Um Presente <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-600 to-amber-900 bg-[length:200%_auto] animate-gradient-x italic font-medium">
                    Inesquecível
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  A força do aço e a exclusividade da sua marca. 
                  Um legado personalizado que seu pai carregará para sempre.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <button 
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:scale-105 hover:shadow-[0_0_40px_rgba(217,119,6,0.3)] transition-all flex items-center gap-4"
                >
                  Ver Coleção
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Client" />
                    </div>
                  ))}
                  <div className="pl-6 flex flex-col justify-center">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">+2.4k Avaliações</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-amber-600/10 blur-[120px] rounded-full animate-pulse" />
                <img 
                  src="https://images.unsplash.com/photo-1594470117722-da419337297b?auto=format&fit=crop&q=80&w=800" 
                  alt="Faca de Elite" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Grid */}
      <section id="personalizacao" className="relative py-24 bg-[#080808] border-y border-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Gravação Permanente", 
                desc: "Tecnologia laser de fibra óptica para uma marcação definitiva que nunca apaga.",
                icon: Pencil
              },
              { 
                title: "Envio Prioritário", 
                desc: "Despacho em 24h com rastreamento em tempo real para todo o território nacional.",
                icon: Truck
              },
              { 
                title: "Curadoria Premium", 
                desc: "Seleção rigorosa de materiais, desde o aço virgem até as madeiras de lei certificadas.",
                icon: Crown
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-10 rounded-3xl bg-[#0d0d0d] border border-zinc-800/40 hover:border-amber-500/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all">
                  <card.icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-4 tracking-tight group-hover:text-amber-500 transition-colors">{card.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Collection Display */}
      <section id="produtos" className="py-32 relative bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600">Catálogo de Edição Limitada</span>
            <h2 className="text-4xl md:text-8xl font-black font-serif tracking-tighter text-white">Escolha o Legado</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="w-12 h-[1px] bg-zinc-800" />
              <Crown className="w-5 h-5 text-amber-900" />
              <div className="w-12 h-[1px] bg-zinc-800" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {loading ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                <p className="text-zinc-500 font-serif italic tracking-widest text-xs uppercase">Carregando Acervo...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-zinc-500 font-serif italic">
                Nenhum exemplar disponível no momento.
              </div>
            ) : products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-500 shadow-2xl flex flex-col h-full"
              >
                <div className="relative h-80 overflow-hidden flex items-center justify-center bg-zinc-900/20">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-6" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900/50 to-black/50 p-12">
                      <div className="w-20 h-[1px] bg-amber-500/20 mb-4" />
                      <span className="text-zinc-600 font-serif italic tracking-widest text-[10px] uppercase text-center">Imagem não cadastrada</span>
                      <div className="w-20 h-[1px] bg-amber-500/20 mt-4" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
                
                <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-2xl font-bold font-serif text-white tracking-tight group-hover:text-amber-500 transition-colors">
                        {product.name}
                      </h3>
                      <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">Aço Premium</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed font-light min-h-[3rem]">
                      {product.description}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-1 pt-2">
                        {product.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-amber-500/50" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-6 pt-4">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Investimento</span>
                        <div className="flex items-center gap-2">
                          {product.old_price && (
                            <span className="text-sm text-zinc-500 line-through decoration-amber-500/50">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.old_price)}
                            </span>
                          )}
                          <p className="text-3xl font-black text-white tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:from-amber-600 hover:to-amber-500 transition-all shadow-[0_10px_30px_rgba(217,119,6,0.2)] flex items-center justify-center gap-3"
                    >
                      Personalizar Agora
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a0a0a] h-full shadow-2xl border-l border-zinc-800 p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-serif uppercase tracking-widest">Seu Pedido</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Acervo Herança de Aço</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-zinc-500 font-serif italic">Seu acervo está vazio.</p>
                      <button onClick={() => setIsCartOpen(false)} className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline">Continuar Explorando</button>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="group relative bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 hover:border-amber-500/20 transition-all">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">{item.product.name}</h3>
                            <button onClick={() => removeFromCart(item.cartId)} className="text-zinc-600 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                              <Pencil className="w-3 h-3 text-amber-600" />
                              Gravação: {item.engravedName || 'Sem nome'}
                            </p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                              <Crown className="w-3 h-3 text-amber-600" />
                              Tamanho: {item.selectedSize}
                            </p>
                          </div>
                          <p className="text-sm font-black text-amber-500 mt-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 space-y-6 pt-8 border-t border-zinc-800">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Subtotal do Acervo</span>
                    <span className="text-2xl font-black text-white tracking-tighter">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:from-amber-600 hover:to-amber-500 transition-all shadow-[0_10px_30px_rgba(217,119,6,0.3)] flex items-center justify-center gap-3"
                  >
                    Finalizar Pedido
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    Pagamento 100% Seguro & Criptografado
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <KnifeCustomizer 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      <footer className="bg-[#050505] border-t border-zinc-900 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <Sword className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-black font-serif tracking-[0.4em] uppercase">Herança de Aço</h2>
            </div>
            <div className="flex gap-10 text-[10px] font-black tracking-[0.3em] text-zinc-500">
              <a href="#" className="hover:text-amber-500 transition-colors">TERMOS</a>
              <a href="#" className="hover:text-amber-500 transition-colors">PRIVACIDADE</a>
              <a href="#" className="hover:text-amber-500 transition-colors">CONTATO</a>
              <a href="/admin-produtos" className="hover:text-amber-500 transition-colors">ADMIN</a>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">© 2024 Herança de Aço. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
