import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, ShieldCheck, Truck, Sparkles, Pencil } from 'lucide-react';

const products = [
  { id: 1, name: 'Cutelo Artesanal', price: 'R$ 299,00', image: 'https://images.unsplash.com/photo-1593618998160-caf454c70e89?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Faca Chef Premium', price: 'R$ 249,00', image: 'https://images.unsplash.com/photo-1590947162383-231aab744a7f?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Faca Picanheira', price: 'R$ 329,00', image: 'https://images.unsplash.com/photo-1577705998142-b363b95764d9?auto=format&fit=crop&q=80&w=600' },
];

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1632733958172-881b490f23f8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-amber-500">Um presente à altura do seu pai</h1>
          <p className="text-xl md:text-2xl mb-8 text-zinc-200">Facas personalizadas com gravação exclusiva — um presente que ele vai guardar para sempre</p>
          <button className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]">
            Personalizar minha faca
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-zinc-900 border-y border-zinc-800">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Gravação Permanente</h3>
            <p className="text-zinc-400">Laser de alta precisão que não desgasta.</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Entrega Garantida</h3>
            <p className="text-zinc-400">Chega a tempo para o Dia dos Pais.</p>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Qualidade Premium</h3>
            <p className="text-zinc-400">Aço inox de alto desempenho.</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Escolha o modelo do seu pai</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-2xl overflow-hidden group border border-zinc-800 hover:border-amber-500 transition-all">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-amber-500 font-bold mb-6">{product.price}</p>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    Personalizar <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
