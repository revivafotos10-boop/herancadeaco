import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, ArrowLeft, ShieldCheck, Database, Share2, Lock, Cookie, UserCog, History } from 'lucide-react';

const Privacidade = () => {
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
              <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">Política de Privacidade</h1>
              <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm">Última atualização: Abril de 2026</p>
              <div className="w-24 h-1 bg-amber-600 mx-auto mt-8"></div>
            </div>

            <div className="prose prose-invert prose-amber max-w-none space-y-12">
              <p className="text-zinc-400 text-lg leading-relaxed text-center italic">
                A Herança de Aço respeita a sua privacidade e está comprometida em proteger os dados pessoais coletados em nosso site.
              </p>

              <div className="grid gap-8">
                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <Database className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">1. Coleta de Dados</h2>
                  </div>
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    Coletamos informações fornecidas pelo cliente no momento da compra ou contato, como:
                  </p>
                  <ul className="list-none p-0 space-y-2">
                    {['Nome completo', 'Número de WhatsApp', 'Endereço de entrega', 'E-mail', 'Dados necessários para personalização do produto'].map((item) => (
                      <li key={item} className="flex gap-3 text-zinc-400 italic">
                        <span className="text-amber-600 font-black">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">2. Uso das Informações</h2>
                  </div>
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    Os dados coletados são utilizados para:
                  </p>
                  <ul className="list-none p-0 space-y-2">
                    {['Processar pedidos', 'Realizar entregas', 'Entrar em contato com o cliente', 'Personalizar produtos conforme solicitado', 'Melhorar a experiência no site'].map((item) => (
                      <li key={item} className="flex gap-3 text-zinc-400 italic">
                        <span className="text-amber-600 font-black">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <Share2 className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white m-0">3. Compartilhamento de Dados</h2>
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-bold mb-4">
                    A Herança de Aço NÃO vende ou compartilha seus dados com terceiros, exceto quando necessário para:
                  </p>
                  <ul className="list-none p-0 space-y-2">
                    {['Processamento de pagamento', 'Serviços de entrega (Correios ou transportadoras)'].map((item) => (
                      <li key={item} className="flex gap-3 text-zinc-400 italic">
                        <span className="text-amber-600 font-black">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-amber-600" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-amber-600">4. Segurança</h2>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração ou divulgação indevida.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-4">
                      <Cookie className="w-5 h-5 text-amber-600" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-amber-600">5. Cookies</h2>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Utilizamos cookies para melhorar a navegação, entender o comportamento do usuário e otimizar campanhas de marketing. Você pode desativar os cookies nas configurações do seu navegador.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-4">
                      <UserCog className="w-5 h-5 text-amber-600" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-amber-600">6. Direitos</h2>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Você pode solicitar a qualquer momento o acesso aos seus dados, correção de informações ou exclusão dos seus dados. Basta entrar em contato conosco.
                    </p>
                  </section>
                  <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-4">
                      <History className="w-5 h-5 text-amber-600" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-amber-600">7. Alterações</h2>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Esta política pode ser atualizada a qualquer momento para melhor atender nossos clientes e cumprir exigências legais.
                    </p>
                  </section>
                </div>

                <section className="bg-amber-600/10 border border-amber-600/20 p-8 rounded-[32px] text-center space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-amber-500 m-0">8. Contato</h2>
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
                  <p className="text-amber-500 font-serif italic text-xl pt-4">Herança de Aço – Segurança, respeito e tradição em cada detalhe.</p>
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

export default Privacidade;
