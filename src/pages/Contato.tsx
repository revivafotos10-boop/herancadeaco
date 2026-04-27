import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Instagram, 
  MapPin, 
  Send, 
  Phone,
  Sword,
  ShieldCheck,
  CheckCircle2,
  Crown,
  User,
  ShoppingBag,
  Menu,
  X,
  Trash2,
  Pencil,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UrgencyBanner from '@/components/UrgencyBanner';

export default function Contato() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter((item: any) => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((acc: number, item: any) => {
    const price = typeof item.product.price === 'number' 
      ? item.product.price 
      : parseFloat(item.product.price.toString().replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.', {
      style: {
        background: '#0a0a0a',
        color: '#fff',
        border: '1px solid #f59e0b'
      }
    });
    
    setFormData({ nome: '', whatsapp: '', email: '', mensagem: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <UrgencyBanner className="z-[90] relative" />
      
      {/* Cinematic Header */}
      <nav className="w-full z-[100] absolute top-[40px] bg-transparent py-8 mt-0">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <Sword className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl md:text-2xl font-black font-serif tracking-[0.3em] text-white uppercase group-hover:text-amber-500 transition-colors">Herança de Aço</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold tracking-[0.3em] text-zinc-400">
            <a href="/#produtos" className="hover:text-white transition-colors">COLEÇÃO</a>
            <a href="/#personalizacao" className="hover:text-white transition-colors">PERSONALIZAÇÃO</a>
            <a href="/#historia" className="hover:text-white transition-colors">HISTÓRIA</a>
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

      <div className="container mx-auto px-6 pt-48 pb-20">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight mb-4">
              Fale com a <span className="text-amber-500">Herança de Aço</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
              Atendimento rápido para dúvidas, pedidos personalizados e suporte.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Quick Contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* WhatsApp Highlight Box */}
            <div className="bg-zinc-900/40 border border-amber-500/20 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <MessageSquare className="w-32 h-32 text-amber-500" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Contato Imediato</h3>
                  <h2 className="text-2xl font-bold font-serif italic">Atendimento via WhatsApp</h2>
                </div>

                <a 
                  href="https://wa.me/5515981173796" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_15px_40px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  Falar no WhatsApp
                </a>

                <div className="grid gap-4 pt-4">
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/item:border-amber-500/50 transition-colors">
                      <Phone className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">WhatsApp</p>
                      <p className="text-sm font-bold">(15) 98117-3796</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/item:border-amber-500/50 transition-colors">
                      <Instagram className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Instagram</p>
                      <p className="text-sm font-bold">@herancadeaco</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/item:border-amber-500/50 transition-colors">
                      <MapPin className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Localização</p>
                      <p className="text-sm font-bold">Itararé - SP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge Section */}
            <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed italic font-serif">
                "Respondemos rapidamente. Seu pedido é tratado com atenção e qualidade, como toda peça Herança de Aço."
              </p>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8 md:p-10 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Sua Mensagem</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.mensagem}
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  placeholder="Como podemos ajudar com sua faca personalizada?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-700 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-900 border border-zinc-800 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:bg-zinc-800 hover:border-amber-500/50 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Enviar mensagem
                    <Send className="w-4 h-4 text-amber-500" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Benefits/Footer Section inside Contact */}
        <div className="mt-24 pt-16 border-t border-zinc-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Tradição", icon: Sword },
              { label: "Qualidade", icon: ShieldCheck },
              { label: "Precisão", icon: CheckCircle2 },
              { label: "Exclusividade", icon: Crown }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
                <item.icon className="w-6 h-6 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
