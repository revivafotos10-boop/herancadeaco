import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  Star, 
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
  Flame,
  Pencil,
  Dna
} from 'lucide-react';
import UrgencyBanner from '@/components/UrgencyBanner';
import HomeCarousel from '@/components/HomeCarousel';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';

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
}

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    
    // Handle initial hash scroll
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
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

  const cartTotal = subtotal;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <div id="home" className="absolute top-0 left-0 w-0 h-0" />
      <UrgencyBanner className="z-[90] relative" />
      
      {/* Cinematic Header */}
      <nav className="w-full z-[100] absolute top-[40px] bg-transparent py-12 mt-0">
        <div className="container mx-auto px-6 flex justify-between items-center gap-10">
          <div className="flex items-center group cursor-pointer shrink-0" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>
            <img 
              src="https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/header/logo-header.png" 
              alt="Herança de Aço" 
              width={420}
              height={75}
              decoding="async"
              className="h-[45px] md:h-[75px] max-h-[45px] md:max-h-[75px] w-auto max-w-[220px] md:max-w-[420px] object-contain brightness-110 contrast-110"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-16 text-[11px] font-bold tracking-[0.3em] text-zinc-400">
            <a href="#produtos" onClick={(e) => {
              e.preventDefault();
              document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors">FACAS</a>
            <a href="#personalizacao" onClick={(e) => {
              e.preventDefault();
              document.getElementById('personalizacao')?.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors">CUTELOS</a>
            <a href="#historia" onClick={(e) => {
              e.preventDefault();
              document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors">LÂMINAS RARAS</a>
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* 1. Hero Carousel */}
      <HomeCarousel />

      {/* 2. Seção de produtos (vitrine) */}
      <section id="produtos" className="py-16 relative bg-[#050505]">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                <p className="text-zinc-500 font-serif italic tracking-widest text-xs uppercase">Preparando Lâminas...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-zinc-500 font-serif italic">
                Nenhuma peça disponível no momento.
              </div>
            ) : products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/produto/${product.slug}`)}
                className="group cursor-pointer bg-[#0d0d0d] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-900 hover:border-amber-600/30 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container with Zoom Effect */}
                <div className="relative h-[160px] sm:h-[220px] lg:h-[260px] overflow-hidden bg-black rounded-t-xl sm:rounded-t-2xl flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-zinc-800 text-[10px] uppercase font-bold tracking-widest">Sem Imagem</span>
                    </div>
                  )}
                  
                  {/* MAIS VENDIDA Badge */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-600 text-white rounded-full flex items-center gap-1 sm:gap-1.5 shadow-lg">
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">MAIS VENDIDA</span>
                    </div>
                  </div>
                </div>
                
                {/* Info Container */}
                <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 flex-grow flex flex-col justify-between text-center">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-lg font-bold font-serif text-white tracking-tight group-hover:text-amber-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 pt-1 sm:pt-2">
                      {product.old_price && (
                        <span className="text-[10px] sm:text-xs text-zinc-600 line-through decoration-amber-500/30">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.old_price)}
                        </span>
                      )}
                      <p className="text-lg sm:text-2xl font-black text-white tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ product: { id: product.id, name: product.name, price: product.price, image_url: product.image_url, slug: product.slug } });
                      setIsCartOpen(true);
                    }}
                    className="w-full min-h-[48px] bg-amber-700 sm:bg-zinc-900 group-hover:bg-amber-700 text-white px-2 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all border border-amber-600 sm:border-zinc-800 group-hover:border-amber-600 flex items-center justify-center gap-2 active:scale-95"
                  >
                    ADICIONAR AO CARRINHO
                    <ArrowRight className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Quality Grid (Small Refactor) */}
      <section id="personalizacao" className="relative py-24 bg-[#080808] border-y border-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { 
                title: "Gravação Permanente", 
                desc: "Tecnologia laser de fibra óptica para uma marcação definitiva que nunca apaga.",
                icon: Dna
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
              <div 
                key={i}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-xl">
                  <card.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold font-serif tracking-tight">{card.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">{card.desc}</p>
              </div>
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
                  cart.map((item: any) => (
                    <div key={item.cartId} className="group relative bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 hover:border-amber-500/20 transition-all">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
                          <img src={item.product.image_url} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-contain p-2" />
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
                              Autêntica Herança de Aço
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

      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[120] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-[320px] bg-[#0a0a0a] h-full shadow-2xl border-r border-zinc-800/50 flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-16">
                <img 
                  src="https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/header/logo-header.png" 
                  alt="Herança de Aço" 
                  className="h-[32px] w-auto object-contain brightness-110"
                />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-8">
                {[
                  { label: 'FACAS', href: '#produtos' },
                  { label: 'CUTELOS', href: '#personalizacao' },
                  { label: 'LÂMINAS RARAS', href: '#historia' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      document.getElementById(item.href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group flex items-center justify-between text-[13px] font-black tracking-[0.4em] text-zinc-400 hover:text-white transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-2 transition-transform">{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-600" />
                  </a>
                ))}
              </nav>

              <div className="mt-auto space-y-8 pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-4 text-zinc-500">
                  <User className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Minha Conta</span>
                </div>
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed tracking-wider">
                  PEÇAS EXCLUSIVAS PARA<br />COLECIONADORES EXIGENTES
                </p>
              </div>
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
