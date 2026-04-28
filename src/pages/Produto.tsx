import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  Star, 
  Pencil, 
  X, 
  ShoppingBag, 
  Trash2, 
  Crown,
  ChevronRight,
  Menu,
  User,
  ArrowRight,
  Loader2,
  Sword,
  CheckCircle2
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
  slug: string;
  engraving_x?: number;
  engraving_y?: number;
  engraving_rotation?: number;
  engraving_font_size?: number;
  engraving_color?: string;
  engraving_area_x?: number;
  engraving_area_y?: number;
  engraving_area_width?: number;
  engraving_area_height?: number;
  engraving_start_x?: number;
  engraving_start_y?: number;
  engraving_end_x?: number;
  engraving_end_y?: number;
  engraving_opacity?: number;
  engraving_blend_mode?: string;
}

const fonts = ['Manuscrita', 'Caligrafia', 'Sans-Serif', 'Serif', 'Bold'];
const symbols = [
  { name: 'Nenhum', image: null },
  { name: 'Corinthians', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/cor.png' },
  { name: 'Palmeiras', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/pepa.png' },
  { name: 'São Paulo', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/sp.png' },
  { name: 'Santos', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/san.png' },
  { name: 'Flamengo', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/fla.png' },
  { name: 'Flamengo 1', image: 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/symbols/fla1.png' }
];
const sizes = ['8"', '10"', '12"'];

const PRODUCT_DEFAULTS: Record<string, { size: string, font: string, symbol: string }> = {
  'Cutelo Artesanal Brut': { size: '8"', font: 'Bold', symbol: 'Corinthians' },
  'Lâmina de Elite Gold': { size: '10"', font: 'Serif', symbol: 'Nenhum' },
  'Herança Silvestre': { size: '12"', font: 'Caligrafia', symbol: 'Palmeiras' },
  'Faca Guardião 20cm Inox': { size: '8"', font: 'Serif', symbol: 'São Paulo' },
  '🔥 Faca Imperador 31cm – Cabo em Osso': { size: '12"', font: 'Serif', symbol: 'Nenhum' },
};

export default function Produto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Customization state
  const [engravedName, setEngravedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setProduct(data);
      setPreviewImage(data.image_url);
      
      // Set initial engraving font size from product config
      if (data.engraving_font_size) {
        setSelectedFontSize(data.engraving_font_size);
      }
      
      // Load defaults
      const defaults = PRODUCT_DEFAULTS[data.name];
      if (defaults) {
        setSelectedFont(defaults.font);
        const defaultSymbol = symbols.find(s => s.name === defaults.symbol) || symbols[0];
        setSelectedSymbol(defaultSymbol);
        setSelectedSize(defaults.size);
      }
    } catch (error: any) {
      console.error('Erro ao buscar produto:', error.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || !product?.engraving_start_x || !product?.engraving_end_x) return;
    
    const container = containerRef.current;
    const parent = container.parentElement;
    if (!parent) return;

    const x1 = product.engraving_start_x;
    const y1 = product.engraving_start_y!;
    const x2 = product.engraving_end_x;
    const y2 = product.engraving_end_y!;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const maxWidthPercent = Math.sqrt(dx * dx + dy * dy);
    
    // Convert percent to pixels (parent is the boxStyle div which is maxWidthPercent wide)
    const parentWidthPx = parent.getBoundingClientRect().width;
    const containerWidthPx = container.getBoundingClientRect().width;
    
    if (containerWidthPx > parentWidthPx && selectedFontSize > 12) {
      setSelectedFontSize(prev => Math.max(12, prev - 1));
    }
  }, [engravedName, selectedFontSize, selectedSymbol, selectedFont, product]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    if (!product) return;
    const item = {
      product,
      engravedName,
      selectedFont,
      selectedSymbol,
      selectedSize,
      engraving_font_size_selected: selectedFontSize,
      engraving_text: engravedName,
      engraving_symbol: selectedSymbol.name,
      cartId: Date.now()
    };
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter((item: any) => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((acc: number, item: any) => {
    const price = typeof item.product.price === 'number' 
      ? item.product.price 
      : parseFloat(item.product.price.toString().replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price;
  }, 0);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const getEngravingBoxStyle = () => {
    // If start/end points exist, use them for automatic calculation
    if (product?.engraving_start_x !== undefined && product?.engraving_end_x !== undefined) {
      const x1 = product.engraving_start_x;
      const y1 = product.engraving_start_y!;
      const x2 = product.engraving_end_x;
      const y2 = product.engraving_end_y!;

      // Center point
      const x = (x1 + x2) / 2;
      const y = (y1 + y2) / 2;

      // Distance (width of the area)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const w = Math.sqrt(dx * dx + dy * dy);
      
      // Rotation in degrees
      const rot = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Height for the text area - adjusted by product font size
      const h = selectedFontSize / 2.5; 
      const previewFontSize = selectedFontSize * 1.5;
      return {
        position: 'absolute' as const,
        left: `${x - (w / 2)}%`,
        top: `${y - (h / 2)}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: `rotate(${rot}deg)`,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none' as const,
        mixBlendMode: (product.engraving_blend_mode as any) || 'normal',
        opacity: product.engraving_opacity ?? 1.0,
      };
    }

    // Fallback values
    const x = product?.engraving_area_x ?? 50;
    const y = product?.engraving_area_y ?? 50;
    const w = product?.engraving_area_width ?? 30;
    const h = product?.engraving_area_height ?? 10;
    const rot = product?.engraving_rotation ?? 0;

    return {
      position: 'absolute' as const,
      left: `${x - (w / 2)}%`,
      top: `${y - (h / 2)}%`,
      width: `${w}%`,
      height: `${h}%`,
      transform: `rotate(${rot}deg)`,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none' as const,
      mixBlendMode: (product?.engraving_blend_mode as any) || 'normal',
      opacity: product?.engraving_opacity ?? 1.0,
    };
  };

  const boxStyle = getEngravingBoxStyle();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <UrgencyBanner className="z-[90] relative" />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-[80] transition-all duration-700 ${scrolled ? 'bg-black/95 backdrop-blur-md py-8 border-b border-zinc-900 shadow-2xl' : 'bg-transparent py-12 mt-10 md:mt-12'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center gap-10">
          <div onClick={() => navigate('/#home')} className="flex items-center group cursor-pointer shrink-0">
            <img 
              src="https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/header/logo-header.png" 
              alt="Herança de Aço" 
              className="h-[45px] md:h-[65px] max-h-[45px] md:max-h-[65px] w-auto max-w-[180px] md:max-w-[320px] object-contain brightness-110 contrast-110"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold tracking-[0.3em] text-zinc-400">
            <button onClick={() => navigate('/#home')} className="hover:text-white transition-colors">VOLTAR PARA LOJA</button>
          </div>

          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </nav>

      <main className="pt-48 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Gallery & Preview */}
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="relative aspect-square bg-zinc-900/30 rounded-[32px] flex items-center justify-center overflow-hidden border border-zinc-800/50 group">
                <motion.img 
                  key={previewImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={previewImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-12 relative z-10 transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Simulation Overlay - Only on main image */}
                {previewImage === product.image_url && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        ...boxStyle,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          whiteSpace: 'nowrap',
                          color: product?.engraving_color || '#2b2b2b',
                          fontFamily: selectedFont === 'Manuscrita' ? 'Dancing Script, cursive' : 
                                     selectedFont === 'Caligrafia' ? 'Great Vibes, cursive' :
                                     selectedFont === 'Serif' ? 'Cormorant Garamond, serif' : 'Montserrat, sans-serif',
                          fontSize: `${selectedFontSize * 1.5}px`,
                          fontWeight: '600',
                          letterSpacing: '0px',
                          lineHeight: 1,
                          transformOrigin: 'center center'
                        }}
                      >
                        {selectedSymbol.name !== 'Nenhum' && selectedSymbol.image && (
                          <img 
                            src={selectedSymbol.image} 
                            alt="" 
                            style={{ 
                              height: `${(selectedFontSize * 1.5) * 1.1}px`, 
                              width: `${(selectedFontSize * 1.5) * 1.1}px`, 
                              objectFit: 'contain',
                              flexShrink: 0
                            }} 
                          />
                        )}
                        {selectedSymbol.name !== 'Nenhum' && !selectedSymbol.image && (
                          <span style={{ marginRight: '4px' }}>{selectedSymbol.name}</span>
                        )}
                        <span style={{ letterSpacing: '0px', whiteSpace: 'nowrap' }}>
                          {engravedName || "NOME"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Simulador de Gravação Laser</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {(product.gallery_images && product.gallery_images.length > 0) && (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {[product.image_url, ...product.gallery_images].map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setPreviewImage(img)}
                      className={`w-24 h-24 rounded-2xl border-2 overflow-hidden flex-shrink-0 transition-all ${previewImage === img ? 'border-amber-500 scale-105 shadow-[0_0_20px_rgba(217,119,6,0.2)]' : 'border-zinc-800 opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description & Features */}
              <div className="space-y-12 py-12 border-t border-zinc-900">
                <div className="space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-amber-500">O Legado por trás da Peça</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg font-light">{product.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-6">Diferenciais Técnicos</h4>
                    <ul className="space-y-4">
                      {product.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col justify-center items-center text-center space-y-4">
                    <ShieldCheck className="w-12 h-12 text-amber-600" />
                    <h4 className="text-lg font-bold font-serif">Garantia Vitalícia</h4>
                    <p className="text-sm text-zinc-500">Nossas lâminas são forjadas para durar gerações. Cobrimos qualquer defeito de fabricação para sempre.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info & Options */}
            <div className="w-full lg:w-2/5">
              <div className="sticky top-32 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Flame className="w-3 h-3" /> MAIS VENDIDA
                      </span>
                    </div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-tight">{product.name}</h1>
                  
                  <div className="flex items-center gap-6 pt-4">
                    <div className="space-y-1">
                      {product.old_price && (
                        <span className="text-lg text-zinc-500 line-through decoration-amber-500/50 font-light">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.old_price)}
                        </span>
                      )}
                      <p className="text-5xl font-black text-white tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </p>
                    </div>
                    <div className="h-12 w-[1px] bg-zinc-800" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                      Em até 12x no cartão<br />
                      5% OFF no PIX
                    </div>
                  </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-black flex justify-between items-center">
                      Tamanho da escrita
                      <span className="text-[10px] text-amber-500 font-bold">{selectedFontSize}px</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedFontSize(Math.max(12, selectedFontSize - 1))}
                        className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all"
                      >
                        -
                      </button>
                      <input 
                        type="range" 
                        min="12" 
                        max="32" 
                        value={selectedFontSize}
                        onChange={(e) => setSelectedFontSize(parseInt(e.target.value))}
                        className="flex-grow accent-amber-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <button 
                        onClick={() => setSelectedFontSize(Math.min(32, selectedFontSize + 1))}
                        className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                <div className="space-y-8 bg-zinc-900/20 p-8 rounded-3xl border border-zinc-800/50">
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-amber-500/70 font-black flex justify-between items-center">
                      Personalize sua Lâmina
                      <span className="text-[10px] text-zinc-600 font-normal">Máx 25 caracteres</span>
                    </label>
                    <input 
                      type="text" 
                      value={engravedName}
                      onChange={(e) => setEngravedName(e.target.value)}
                      className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-5 text-white focus:border-amber-600 outline-none transition-all placeholder:text-zinc-800 uppercase font-bold tracking-widest"
                      placeholder="Ex: NOME DO SEU PAI"
                      maxLength={25}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-black">Estilo da Fonte</label>
                    <div className="grid grid-cols-2 gap-2">
                      {fonts.map(font => (
                        <button 
                          key={font}
                          onClick={() => setSelectedFont(font)}
                          className={`p-4 rounded-xl border text-sm transition-all ${selectedFont === font ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-black">Símbolo</label>
                    <div className="grid grid-cols-4 gap-2">
                      {symbols.map((symbol, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedSymbol(symbol)}
                          className={`p-4 rounded-xl border flex items-center justify-center min-h-[64px] transition-all ${selectedSymbol.name === symbol.name ? 'border-amber-500 bg-amber-500/10 text-amber-500 scale-105' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          {symbol.image ? (
                            <img src={symbol.image} alt={symbol.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-sm font-bold uppercase tracking-tighter">{symbol.name}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-black">Tamanho da Lâmina</label>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-4 rounded-xl border text-sm transition-all ${selectedSize === size ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={addToCart}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:from-amber-600 hover:to-amber-500 transition-all shadow-[0_20px_40px_rgba(217,119,6,0.3)] flex items-center justify-center gap-4 group"
                  >
                    COMPRAR E PERSONALIZAR
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <div className="pt-4 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <Truck className="w-5 h-5 text-zinc-500" />
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Frete Grátis</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="w-5 h-5 text-zinc-500" />
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Compra Segura</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <User className="w-5 h-5 text-zinc-500" />
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Suporte VIP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

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
                  cart.map((item: any) => (
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
                              Gravação: {item.engravedName || 'Sem nome'} {item.selectedSymbol?.name !== 'Nenhum' && `(${item.selectedSymbol?.name})`}
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
                </div>
              )}
            </motion.div>
          </div>
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
              <a href="/termos" className="hover:text-amber-500 transition-colors">TERMOS</a>
              <a href="/privacidade" className="hover:text-amber-500 transition-colors">PRIVACIDADE</a>
              <a href="/contato" className="hover:text-amber-500 transition-colors">CONTATO</a>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">© 2024 Herança de Aço. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Flame(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
