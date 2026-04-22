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
  Gift
} from 'lucide-react';
import UrgencyBanner from '@/components/UrgencyBanner';

const products = [
  { 
    id: 1, 
    name: 'Cutelo Artesanal Brut', 
    price: 'R$ 349,00', 
    image: 'https://images.unsplash.com/photo-1593618998160-caf454c70e89?auto=format&fit=crop&q=80&w=800',
    description: 'Forjado em alto carbono, ideal para cortes robustos.'
  },
  { 
    id: 2, 
    name: 'Faca Chef Premium Gold', 
    price: 'R$ 299,00', 
    image: 'https://images.unsplash.com/photo-1590947162383-231aab744a7f?auto=format&fit=crop&q=80&w=800',
    description: 'Equilíbrio perfeito e fio de navalha para alta gastronomia.'
  },
  { 
    id: 3, 
    name: 'Faca Picanheira Raiz', 
    price: 'R$ 389,00', 
    image: 'https://images.unsplash.com/photo-1577705998142-b363b95764d9?auto=format&fit=crop&q=80&w=800',
    description: 'O clássico do churrasco, com cabo em madeira nobre.'
  },
];

const fonts = ['Manuscrita', 'Caligrafia', 'Sans-Serif', 'Serif', 'Bold'];
const symbols = ['Nenhum', '⚓', '⚔️', '🔥', '🛡️', '🐎', '🤠'];
const sizes = ['8"', '10"', '12"'];

const PRODUCT_DEFAULTS: Record<string, { size: string, font: string, symbol: string }> = {
  'Cutelo Artesanal Brut': { size: '8"', font: 'Bold', symbol: '⚔️' },
  'Faca Chef Premium Gold': { size: '10"', font: 'Serif', symbol: 'Nenhum' },
  'Faca Picanheira Raiz': { size: '12"', font: 'Caligrafia', symbol: '🔥' },
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
        className="bg-[#0f0f0f] w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row border border-zinc-800 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-20 p-2 transition-colors"><X /></button>
        
        <div className="md:w-3/5 p-6 md:p-12 bg-zinc-900/50 flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="relative w-full max-w-lg">
            <motion.div
              animate={{ 
                filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={product.image} alt={product.name} className="w-full h-auto rounded-xl shadow-2xl border border-zinc-700/50" />
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
            Prévia Digital de Gravação a Laser
          </p>
        </div>

        <div className="md:w-2/5 flex flex-col border-l border-zinc-800 bg-zinc-950">
          <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-serif tracking-tight">Personalize sua {product.name}</h2>
              <p className="text-zinc-500 text-sm">Crie uma peça única para um momento inesquecível.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Nome para Gravação</label>
                <input 
                  type="text" 
                  value={engravedName}
                  onChange={(e) => setEngravedName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-amber-600 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Ex: PAI JOÃO"
                  maxLength={25}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Estilo da Fonte</label>
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
                <label className="text-xs uppercase tracking-widest text-amber-500/70 font-bold">Tamanho da Lâmina</label>
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
              Confirmar Personalização
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
    const price = parseFloat(item.product.price.replace('R$ ', '').replace(',', '.'));
    return acc + price;
  }, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat',sans-serif]">
      {/* Header */}
      <nav className={`fixed w-full z-[80] transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-zinc-900 shadow-xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl md:text-2xl font-bold font-serif tracking-widest text-white uppercase">Herança de Aço</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-widest text-zinc-400">
            <a href="#produtos" className="hover:text-amber-500 transition-colors">COLEÇÃO</a>
            <a href="#" className="hover:text-amber-500 transition-colors">NOSSA HISTÓRIA</a>
            <a href="#" className="hover:text-amber-500 transition-colors">CUIDADOS</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
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
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513512147376-c09da5f8b2c4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/50 z-10" />
          
          {/* Decorative Glows */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-900/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-amber-900/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-8 mt-12 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm"
            >
              <Gift className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500">Dia dos Pais</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold font-serif leading-[1.1] tracking-tight"
            >
              Um presente à <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 bg-[length:200%_auto] animate-gradient-x">
                Altura do seu Pai
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed"
            >
              Facas artesanais personalizadas com gravação exclusiva a laser. 
              Um legado de aço para quem forjou sua história.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-8 py-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">Aço Inox Premium</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">Gravação a Laser</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">Caixa de Luxo</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium tracking-wide font-bold text-amber-500/80">Entrega Garantida para o Dia dos Pais</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-6"
            >
              <button 
                onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-5 bg-amber-600 rounded-full font-bold text-lg overflow-hidden transition-all hover:bg-amber-500 shadow-[0_0_30px_rgba(217,119,6,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-3">
                  PERSONALIZAR MINHA FACA
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </div>

          {/* Product Visual */}
          <div className="md:w-1/2 relative h-[500px] md:h-[700px] flex items-center justify-center">
            {/* Background Box (Subtle) */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 10 }}
              animate={{ opacity: 0.5, x: 30, rotate: 5 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute w-[400px] h-[500px] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800/50 transform translate-x-10 translate-y-10"
              style={{ backgroundImage: 'linear-gradient(to bottom right, #1a1a1a, #050505)' }}
            />
            
            {/* Main Knife */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -25, x: 100 }}
              animate={{ opacity: 1, scale: 1, rotate: -15, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-30 drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
            >
              <img 
                src="https://images.unsplash.com/photo-1590947162383-231aab744a7f?auto=format&fit=crop&q=80&w=1200" 
                alt="Faca Premium" 
                className="w-full h-auto max-w-[600px] transform hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              
              {/* Blade Shine Animation */}
              <motion.div 
                animate={{ 
                  left: ['-10%', '110%'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[35deg] pointer-events-none z-40"
              />
            </motion.div>

            {/* Certification Seal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="absolute top-20 right-10 z-40 w-24 h-24 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-black/40 backdrop-blur-md"
            >
              <div className="text-center">
                <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-400">Entrega</span>
                <span className="block text-[10px] font-black text-amber-500 uppercase leading-none">Garantida</span>
                <span className="block text-[7px] font-bold uppercase tracking-tighter text-zinc-500">Ago 2024</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-20 border-y border-zinc-900 bg-zinc-950/50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Gravação Permanente", 
                desc: "Laser de alta precisão que não desgasta com o uso ou lavagens." 
              },
              { 
                icon: Truck, 
                title: "Entrega Expressa", 
                desc: "Logística prioritária para chegar antes do Dia dos Pais em todo Brasil." 
              },
              { 
                icon: Crown, 
                title: "Aço Premium", 
                desc: "Lâminas forjadas com alto padrão de dureza e retenção de fio." 
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="group p-10 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center mb-8 group-hover:bg-amber-500/10 transition-colors">
                  <f.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-serif">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Collection */}
      <section id="produtos" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-500">A Coleção Herança</span>
            <h2 className="text-4xl md:text-6xl font-bold font-serif tracking-tight">O Presente Inesquecível</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group bg-[#0a0a0a] rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-700 transition-all duration-500 shadow-2xl"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-zinc-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase">Best Seller</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-serif mb-1 group-hover:text-amber-500 transition-colors">{product.name}</h3>
                      <p className="text-xs text-zinc-500">{product.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8">
                    <p className="text-2xl font-bold text-white tracking-tight">{product.price}</p>
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="px-6 py-3 border border-amber-600/30 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-300"
                    >
                      Personalizar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a0a0a] h-full shadow-2xl flex flex-col border-l border-zinc-900"
            >
              <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
                <h2 className="text-xl font-bold flex items-center gap-3 font-serif">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Seu Pedido
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-8 h-8 text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 font-medium">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="group relative flex gap-6 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all">
                      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800">
                        <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm text-white truncate pr-6">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {item.engravedName && (
                            <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1.5">
                              <Pencil className="w-3 h-3" />
                              "{item.engravedName}"
                            </p>
                          )}
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Tamanho: {item.selectedSize}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-amber-500 font-bold">{item.product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-zinc-950 border-t border-zinc-900 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">Total</span>
                    <span className="text-3xl font-bold text-white tracking-tighter">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-amber-600 text-white py-5 rounded-xl font-bold hover:bg-amber-500 transition-all shadow-[0_10px_30px_rgba(217,119,6,0.3)] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Finalizar Presente
                  </button>
                  <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest">Pagamento 100% Seguro & Envio Rastreado</p>
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

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-zinc-900">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Crown className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold font-serif tracking-widest uppercase">Herança de Aço</h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed mb-12">
            Forjando momentos inesquecíveis e legados que atravessam gerações. 
            A excelência do aço brasileiro em cada corte.
          </p>
          <div className="flex justify-center gap-12 text-zinc-600 uppercase text-[10px] font-bold tracking-[0.3em]">
            <a href="#" className="hover:text-amber-500 transition-colors">Termos</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Trocas</a>
          </div>
          <div className="mt-12 pt-12 border-t border-zinc-900/50">
            <p className="text-[10px] text-zinc-700 tracking-[0.2em] uppercase">© 2024 Herança de Aço. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
