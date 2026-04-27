import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, ArrowLeft, ShieldCheck, Scale, History, UserCheck } from 'lucide-react';

const Termos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-[80] bg-black/95 backdrop-blur-md py-4 border-b border-zinc-900 shadow-2xl">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
            <Sword className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl md:text-2xl font-black font-serif tracking-[0.3em] text-white uppercase group-hover:text-amber-500 transition-colors">Herança de Aço</h1>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">Termos de Uso</h1>
              <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm">Última atualização: Abril de 2026</p>
              <div className="w-24 h-1 bg-amber-600 mx-auto mt-8"></div>
            </div>

            <div className="prose prose-invert prose-amber max-w-none space-y-12">
              <p className="text-zinc-400 text-lg leading-relaxed text-center italic">
                Ao acessar e realizar compras neste site, você concorda com os termos abaixo.
              </p>

              <div className="grid gap-8">
                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <History className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">1. Sobre a Empresa</h2>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    A Herança de Aço atua na fabricação e venda de facas personalizadas, prezando pela qualidade, segurança e satisfação do cliente.
                  </p>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <Scale className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">2. Produtos Personalizados</h2>
                  </div>
                  <ul className="list-none p-0 space-y-3">
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      As facas podem ser personalizadas com nomes ou frases escolhidas pelo cliente.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      É responsabilidade do cliente conferir corretamente o texto antes da finalização do pedido.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      Não nos responsabilizamos por erros digitados pelo cliente.
                    </li>
                  </ul>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">3. Prazo de Produção e Envio</h2>
                  </div>
                  <ul className="list-none p-0 space-y-3">
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      Produtos personalizados possuem prazo de produção de até 3 dias úteis.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      O prazo de entrega varia de acordo com o endereço e método de envio escolhido.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      O cliente será informado sobre o envio após a finalização do pedido.
                    </li>
                  </ul>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <UserCheck className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">4. Trocas e Devoluções</h2>
                  </div>
                  <ul className="list-none p-0 space-y-3">
                    <li className="flex gap-3 text-zinc-400 italic font-bold">
                      <span className="text-amber-600 font-black">•</span>
                      Produtos personalizados NÃO podem ser devolvidos por arrependimento, conforme o Código de Defesa do Consumidor.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      Trocas serão realizadas apenas em caso de defeito de fabricação.
                    </li>
                    <li className="flex gap-3 text-zinc-400 italic">
                      <span className="text-amber-600 font-black">•</span>
                      O cliente deve entrar em contato em até 7 dias após o recebimento.
                    </li>
                  </ul>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4">5. Uso Responsável</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      As facas são ferramentas cortantes e devem ser utilizadas com responsabilidade. A Herança de Aço não se responsabiliza por uso indevido dos produtos.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4">6. Pagamentos</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Os pagamentos são processados por plataformas seguras. O pedido será iniciado somente após a confirmação do pagamento.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4">7. Privacidade</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Os dados do cliente são utilizados apenas para processamento do pedido. Não compartilhamos informações com terceiros.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4">8. Alterações</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      A Herança de Aço pode atualizar estes termos a qualquer momento, sem aviso prévio.
                    </p>
                  </section>
                </div>

                <section className="bg-amber-600/10 border border-amber-600/20 p-8 rounded-[32px] text-center space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-amber-500 m-0">9. Contato</h2>
                  <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">WhatsApp</p>
                      <p className="text-lg font-bold">(15) 98117-3796</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Instagram</p>
                      <p className="text-lg font-bold">@herancadeaco</p>
                    </div>
                  </div>
                  <p className="text-amber-500 font-serif italic text-xl pt-4">Herança de Aço – Tradição em cada lâmina.</p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-[#050505] border-t border-zinc-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">© 2026 Herança de Aço. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Termos;
