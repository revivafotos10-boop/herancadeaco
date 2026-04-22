import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, ShieldCheck, Truck, Sparkles, Pencil, X } from 'lucide-react';

const products = [
  { id: 1, name: 'Cutelo Artesanal', price: 'R$ 299,00', image: 'https://images.unsplash.com/photo-1593618998160-caf454c70e89?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Faca Chef Premium', price: 'R$ 249,00', image: 'https://images.unsplash.com/photo-1590947162383-231aab744a7f?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Faca Picanheira', price: 'R$ 329,00', image: 'https://images.unsplash.com/photo-1577705998142-b363b95764d9?auto=format&fit=crop&q=80&w=600' },
];

const fonts = ['Manuscrita', 'Caligrafia', 'Sans-Serif', 'Serif', 'Bold'];

const KnifeCustomizer = ({ product, onClose }) => {
  const [engravedName, setEngravedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-amber-500"><X /></button>
        
        {/* Mockup side */}
        <div className="md:w-1/2 p-8 bg-zinc-800 flex flex-col items-center justify-center relative">
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
          <motion.div 
            className="absolute bottom-[35%] w-full text-center text-amber-500/80 font-serif text-3xl tracking-widest uppercase pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: engravedName ? 1 : 0 }}
          >
            {engravedName}
          </motion.div>
          <p className="mt-4 text-sm text-zinc-400 italic">Visualização em tempo real</p>
        </div>

        {/* Inputs side */}
        <div className="md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Personalize sua {product.name}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Nome gravado</label>
              <input 
                type="text" 
                value={engravedName}
                onChange={(e) => setEngravedName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                placeholder="Ex: Pai João"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Fonte</label>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map(font => (
                  <button 
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`p-2 rounded border ${selectedFont === font ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400'}`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold hover:bg-amber-500 transition-colors">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1632733958172-881b490f23f8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center brightness-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-amber-500 font-serif">Um presente à altura do seu pai</h1>
          <p className="text-xl md:text-2xl mb-8 text-zinc-200">Facas personalizadas com gravação exclusiva — um presente que ele vai guardar para sempre</p>
          <button className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
            Personalizar minha faca
          </button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Escolha o modelo do seu pai</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-2xl overflow-hidden group border border-zinc-800">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-amber-500 font-bold mb-6">{product.price}</p>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <KnifeCustomizer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
