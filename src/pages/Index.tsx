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
  ArrowRight
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
  'Faca Imperador 31cm – Cabo em Osso': { size: '12"', font: 'Serif', symbol: 'Nenhum' },
};

const KnifeCustomizer = ({ product, onClose, onAddToCart }) => {
  const getProductDefault = (key: 'size' | 'font' | 'symbol') => {
    return PRODUCT_DEFAULTS[product.name]?.[key] || (key === 'size' ? sizes[1] : key === 'font' ? fonts[0] : symbols[0]);
  };

  const [engravedName, setEngravedName] = useState(() => localStorage.getItem(`engravedName_${product.id}`) || '');
  const [selectedFont, setSelectedFont] = useState(() => localStorage.getItem(`selectedFont_${product.id}`) || getProductDefault('font'));
  const [selectedSymbol, setSelectedSymbol] = useState(() => localStorage.getItem(`selectedSymbol_${product.id}`) || getProductDefault('symbol'));
  const [selectedSize, setSelectedSize] = useState(() => localStorage.getItem(`selectedSize_${product.id}`) || getProductDefault('size'));

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
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded-xl" />
              ) : (
                <div className="w-full h-full bg-zinc-900/50 rounded-xl flex items-center justify-center border border-dashed border-zinc-800">
                  <span className="text-zinc-700 font-serif italic">Carregando visualização...</span>
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
      : parseFloat(item.product.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price;
  }, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <UrgencyBanner className="z-[90] relative" />
      {/* Cinematic Header */}
      <nav className={`fixed w-full z-[80] transition-all duration-700 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4 border-b border-zinc-900 shadow-2xl' : 'bg-transparent py-8 mt-10 md:mt-12'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Crown className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
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

      {/* Hero Section - Redesigned for Maximum Impact */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
        {/* Multi-layered Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#050505] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-10" />
          
          {/* Heat/Fire Glows */}
          <div className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] bg-amber-900/20 blur-[150px] rounded-full -translate-y-1/2" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-950/20 blur-[120px] rounded-full" />
          
          {/* Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Hero Text */}
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
                className="flex flex-wrap justify-center lg:justify-start gap-8"
              >
                {[
                  { icon: ShieldCheck, label: "Aço Inox Premium" },
                  { icon: Pencil, label: "Gravação Exclusiva" },
                  { icon: Crown, label: "Caixa de Luxo" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">{item.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-6"
              >
                <button 
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-12 py-6 bg-gradient-to-r from-amber-800 to-amber-600 rounded-full font-black text-sm uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(217,119,6,0.4)] hover:shadow-[0_0_80px_rgba(217,119,6,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-4">
                    Personalizar Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                  <Flame className="inline w-3 h-3 text-amber-500 mr-2" />
                  Estoque limitado para o Dia dos Pais
                </p>
              </motion.div>
            </div>

            {/* Hero Visual Composed of multiple elements */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center py-20 lg:py-0">
              {/* Background Luxury Box */}
              <motion.div 
                initial={{ opacity: 0, x: 60, rotate: 12, scale: 0.9 }}
                animate={{ opacity: 0.4, x: 40, rotate: 8, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="absolute w-[450px] h-[550px] bg-[#111] rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-zinc-800/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-white/5" />
              </motion.div>

              {/* Main Knife Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -25, x: 150 }}
                animate={{ opacity: 1, scale: 1, rotate: -15, x: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-30 group cursor-pointer"
              >
                <div className="bg-gradient-to-b from-[#111] to-black p-6 rounded-[48px] border border-zinc-800/50 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden max-w-[600px] group-hover:border-amber-500/30 transition-all duration-700 aspect-video flex items-center justify-center">
                  <div className="relative overflow-hidden rounded-[32px] w-full h-full bg-zinc-900/50 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1593612803893-7a9151244192?auto=format&fit=crop&q=80&w=1200" 
                      alt="Faca Premium Herança" 
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[55] flex flex-col justify-end p-8">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Edição Especial</span>
                        <h3 className="text-3xl font-bold font-serif">Faca Premium Herança</h3>
                        <p className="text-2xl font-black text-white">R$ 499,00</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Blade Shine */}
                <motion.div 
                  animate={{ 
                    left: ['-20%', '120%'],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute top-[20%] left-0 w-16 h-[60%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[45deg] pointer-events-none z-40 blur-[2px]"
                />
              </motion.div>

              {/* Seal of Authenticity */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', damping: 15 }}
                className="absolute top-0 right-[10%] z-40"
              >
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-amber-500/40 rounded-full"
                  />
                  <div className="w-28 h-28 rounded-full bg-black/60 backdrop-blur-xl border border-amber-500/20 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Entrega</span>
                    <span className="text-[11px] font-black text-amber-500 uppercase leading-none tracking-tighter">Garantida</span>
                    <div className="w-8 h-[1px] bg-amber-900 my-2" />
                    <span className="text-[7px] font-bold text-zinc-400 uppercase">AGO 2024</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Grid - Refined */}
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
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-500 shadow-2xl"
              >
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden flex items-center justify-center bg-zinc-900/20">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900/50 to-black/50 p-12">
                      <div className="w-20 h-[1px] bg-amber-500/20 mb-4" />
                      <span className="text-zinc-600 font-serif italic tracking-widest text-sm uppercase">Acervo Herança</span>
                      <div className="w-20 h-[1px] bg-amber-500/20 mt-4" />
                    </div>
                  )}
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>
                
                {/* Content Section */}
                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold font-serif text-white tracking-tight group-hover:text-amber-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed font-light min-h-[3rem]">
                      {product.description}
                    </p>
                    {product.features && (
                      <ul className="space-y-1 pt-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-amber-500/50" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Investimento</span>
                        <div className="flex items-center gap-2">
                          {product.oldPrice && (
                            <span className="text-sm text-zinc-500 line-through decoration-amber-500/50">{product.oldPrice}</span>
                          )}
                          <p className="text-3xl font-black text-white tracking-tighter">{product.price}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Aço Premium</span>
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

      {/* Cart & Customizer Logic (Maintained) */}
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
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a0a0a] h-full shadow-2xl flex flex-col border-l border-zinc-900"
            >
              <div className="p-10 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
                <h2 className="text-xl font-bold flex items-center gap-4 font-serif uppercase tracking-widest">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  Carrinho
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
                      <ShoppingBag className="w-10 h-10 text-zinc-800" />
                    </div>
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Vazio por enquanto</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="group relative flex gap-6 bg-[#0d0d0d] p-6 rounded-3xl border border-zinc-900 transition-all">
                      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 flex items-center justify-center bg-zinc-900/50">
                        {item.product.image ? (
                          <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <Crown className="w-6 h-6 text-zinc-700" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm text-white truncate">{item.product.name}</h3>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-zinc-700 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {item.engravedName && (
                            <p className="text-[10px] uppercase tracking-widest text-amber-500 font-black italic">"{item.engravedName}"</p>
                          )}
                          <p className="text-[10px] text-zinc-600 font-bold">Tam: {item.selectedSize} / {item.selectedFont}</p>
                        </div>
                        <p className="mt-4 text-amber-500 font-black text-sm">{item.product.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-10 bg-zinc-950 border-t border-zinc-900 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Total do Investimento</span>
                    <span className="text-4xl font-black text-white tracking-tighter">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-amber-600 text-white py-6 rounded-2xl font-black hover:bg-amber-500 transition-all shadow-[0_15px_40px_rgba(217,119,6,0.3)] flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs"
                  >
                    <Lock className="w-4 h-4" />
                    Finalizar Compra
                  </button>
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

      {/* Testimonials Section */}
      <section id="historia" className="py-32 relative bg-[#050505] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600">O que dizem nossos clientes</span>
            <h2 className="text-4xl md:text-6xl font-black font-serif tracking-tighter text-white">Satisfação de Mestre</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-[#0d0d0d] p-10 rounded-[32px] border border-zinc-900/50 relative group hover:border-amber-500/20 transition-all duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                
                <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light italic">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider">{item.name}</h4>
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-zinc-900">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <Crown className="w-10 h-10 text-amber-500" />
              <h2 className="text-3xl font-bold font-serif tracking-[0.3em] uppercase">Herança de Aço</h2>
            </div>
            <p className="text-zinc-600 text-sm max-w-2xl mx-auto leading-relaxed font-light">
              Mestres da cutelaria artesanal, transformando o mais nobre aço em 
              legados que atravessam gerações. Qualidade incontestável, personalização definitiva.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-16 text-zinc-700 uppercase text-[9px] font-black tracking-[0.4em]">
            <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Suporte</a>
            <a href="#produtos" className="hover:text-amber-500 transition-colors">Coleção</a>
            <a href="#historia" className="hover:text-amber-500 transition-colors">Nossa História</a>
            <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">B2B/Corporativo</a>
          </div>
          
          <div className="mt-20 pt-10 border-t border-zinc-900/30">
            <p className="text-[9px] text-zinc-800 tracking-[0.3em] uppercase">© 2024 Herança de Aço - Arte em Metal & Madeira. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
