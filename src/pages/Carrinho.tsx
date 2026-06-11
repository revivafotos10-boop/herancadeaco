import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const getPrice = (p: any) =>
  typeof p === 'number' ? p : parseFloat(String(p).replace('R$ ', '').replace('.', '').replace(',', '.'));

export default function Carrinho() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <header className="border-b border-zinc-900 bg-black/60 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Continuar Comprando</span>
          </button>
          <h1 className="text-base sm:text-xl font-black font-serif tracking-[0.3em] uppercase text-amber-500">
            Carrinho
          </h1>
          <div className="w-[120px] hidden sm:block" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-zinc-600" />
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400 font-serif italic">Seu carrinho está vazio.</p>
              <button
                onClick={() => navigate('/')}
                className="text-amber-500 text-[11px] font-black uppercase tracking-[0.3em] hover:underline"
              >
                Explorar Lâminas
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const unit = getPrice(item.product.price);
                const qty = item.quantity ?? 1;
                return (
                  <div
                    key={item.cartId}
                    className="flex flex-col sm:flex-row gap-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4"
                  >
                    <div className="w-full sm:w-32 h-32 bg-black rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-zinc-700 text-[10px] uppercase">Sem imagem</span>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col justify-between gap-3">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-white">
                            {item.product.name}
                          </h3>
                          {item.engravedName && (
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
                              Gravação: {item.engravedName}
                            </p>
                          )}
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            Unitário: {fmt(unit)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          aria-label="Remover item"
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center border border-zinc-700 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.cartId, qty - 1)}
                            disabled={qty <= 1}
                            aria-label="Diminuir quantidade"
                            className="w-9 h-9 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, qty + 1)}
                            aria-label="Aumentar quantidade"
                            className="w-9 h-9 flex items-center justify-center hover:bg-zinc-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-base font-black text-amber-500">
                          {fmt(unit * qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <aside className="lg:col-span-1">
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 sticky top-24 space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                  Resumo
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Itens</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">{fmt(subtotal)}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                      Total
                    </span>
                    <span className="text-2xl font-black text-white tracking-tighter">
                      {fmt(subtotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:from-amber-600 hover:to-amber-500 transition-all shadow-[0_10px_30px_rgba(217,119,6,0.3)] flex items-center justify-center gap-3"
                >
                  Finalizar Compra
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
