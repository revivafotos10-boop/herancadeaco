import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Star, Pencil, X, Flame, Timer, ShoppingBag, Trash2 } from 'lucide-react';
import UrgencyBanner from '@/components/UrgencyBanner';

const products = [
  { id: 1, name: 'Cutelo Artesanal', price: 'R$ 299,00', image: 'https://images.unsplash.com/photo-1593618998160-caf454c70e89?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Faca Chef Premium', price: 'R$ 249,00', image: 'https://images.unsplash.com/photo-1590947162383-231aab744a7f?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Faca Picanheira', price: 'R$ 329,00', image: 'https://images.unsplash.com/photo-1577705998142-b363b95764d9?auto=format&fit=crop&q=80&w=600' },
];

const fonts = ['Manuscrita', 'Caligrafia', 'Sans-Serif', 'Serif', 'Bold'];
const symbols = ['Nenhum', '⚓', '⚔️', '🔥', '🛡️', '🐎', '🤠'];


const KnifeCustomizer = ({ product, onClose, onAddToCart }) => {
  const [engravedName, setEngravedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);

  const handleAddToCart = () => {
    onAddToCart({ product, engravedName, selectedFont, selectedSymbol });
  };



  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-800 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-amber-500 z-20 p-2"><X /></button>
        
        <div className="md:w-1/2 p-8 bg-zinc-800/50 flex flex-col items-center justify-center relative">
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-2xl" />
          <motion.div 
            className="absolute bottom-[35%] w-full text-center text-amber-500/90 font-serif text-3xl tracking-widest uppercase pointer-events-none drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: engravedName ? 1 : 0 }}
          >
            {engravedName || "Seu Nome"} {selectedSymbol !== 'Nenhum' && selectedSymbol}
          </motion.div>
          <p className="mt-6 text-sm text-zinc-400 italic">Simulação de gravação a laser</p>
        </div>

        <div className="md:w-1/2 p-8 overflow-y-auto relative pt-14">
          <UrgencyBanner className="absolute top-0 left-0 right-0 py-2 text-[10px] md:text-xs z-10" />
          <h2 className="text-2xl font-bold text-white mb-6">Personalize sua {product.name}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Nome gravado</label>
              <input 
                type="text" 
                value={engravedName}
                onChange={(e) => setEngravedName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Ex: Pai João"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Fonte</label>
              <div className="grid grid-cols-3 gap-2">
                {fonts.map(font => (
                  <button 
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`p-2 rounded border text-xs ${selectedFont === font ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400'}`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Símbolo</label>
              <div className="grid grid-cols-4 gap-2">
                {symbols.map(symbol => (
                  <button 
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={`p-2 rounded border text-lg ${selectedSymbol === symbol ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400'}`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>


            <div className="pt-6 border-t border-zinc-800">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold hover:bg-amber-500 transition-all shadow-[0_0_15px_rgba(217,119,6,0.2)]"
              >
                Adicionar ao Carrinho
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <UrgencyBanner className="fixed top-0 w-full z-50 shadow-md h-14 md:h-10" />
      <nav className="fixed w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 py-4 top-14 md:top-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500 font-serif">Herança de Aço</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-700">Login</button>
          </div>
        </div>
      </nav>


      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1632733958172-881b490f23f8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center brightness-[0.4]" />
        <div className="relative z-10 text-center px-4 max-w-3xl mt-10">
          <div className="inline-flex items-center gap-2 bg-amber-950/50 text-amber-400 px-4 py-2 rounded-full mb-6 border border-amber-800/50">
            <Flame className="w-4 h-4" /> Entrega garantida para o Dia dos Pais
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 text-white font-serif">Um presente à altura do seu pai</h1>
          <p className="text-xl mb-10 text-zinc-300">Facas premium personalizadas — um presente que ele guardará para sempre.</p>
          <button 
            onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(217,119,6,0.3)]"
          >
            Personalizar minha faca
          </button>
        </div>
      </section>

      <section id="produtos" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              { icon: ShieldCheck, title: "Gravação Permanente", desc: "Laser de alta precisão que não desgasta." },
              { icon: Truck, title: "Entrega Garantida", desc: "Logística expressa para o Dia dos Pais." },
              { icon: Star, title: "Qualidade Premium", desc: "Aço inox de alto desempenho e cabos nobres." }
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <b.icon className="w-12 h-12 text-amber-500 mb-6" />
                <h3 className="font-bold text-xl mb-3">{b.title}</h3>
                <p className="text-zinc-400">{b.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-center mb-16">Coleção de Facas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-2xl overflow-hidden group border border-zinc-800 hover:border-zinc-600 transition-all">
                <img src={product.image} alt={product.name} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-amber-500 font-bold mb-8 text-2xl">{product.price}</p>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full py-4 border-2 border-amber-500 text-amber-500 font-bold hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                  >
                    Personalizar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <KnifeCustomizer 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        )}

        {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-zinc-900 h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Seu Carrinho
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                      <img src={item.product.image} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-zinc-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-amber-500 mt-1">"{item.engravedName}"</p>
                        <p className="text-[10px] text-zinc-400">Fonte: {item.selectedFont} | {item.selectedSymbol}</p>
                        <p className="text-sm font-bold mt-2">{item.product.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Total do pedido</span>
                    <span className="text-xl font-bold text-amber-500">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout', { state: { cart } })}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg"
                  >
                    Finalizar Compra
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
