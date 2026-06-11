import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, QrCode, ShieldCheck, Truck, ChevronLeft, Lock, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(() => {
    if (location.state?.cart) return location.state.cart;
    if (location.state?.product) {
      return [{ 
        product: location.state.product, 
        engravedName: location.state.engravedName || '', 
        selectedFont: location.state.selectedFont || 'Manuscrita', 
        selectedSymbol: location.state.selectedSymbol || 'Nenhum', 
        selectedSize: location.state.selectedSize || '10"',
        cartId: Date.now() 
      }];
    }
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      localStorage.removeItem('cart');
      return [];
    }
  });
  
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Validate cart items
    const isIncomplete = cart.some((item: any) => 
      !item.selectedSize || !item.selectedFont || !item.selectedSymbol || !item.engravedName ||
      item.selectedSize === '' || item.selectedFont === '' || item.selectedSymbol === '' || item.engravedName === ''
    );
    
    setShowValidationAlert(isIncomplete);
  }, [cart]);

  const recoverData = () => {
    const recoveredCart = cart.map((item: any) => ({
      ...item,
      selectedSize: item.selectedSize || localStorage.getItem('selectedSize') || '10"',
      selectedFont: item.selectedFont || localStorage.getItem('selectedFont') || 'Manuscrita',
      selectedSymbol: item.selectedSymbol || localStorage.getItem('selectedSymbol') || 'Nenhum',
      engravedName: item.engravedName || localStorage.getItem('selectedEngravedName') || '',
    }));
    
    setCart(recoveredCart);
    
    // Ensure top-level values are also set if missing
    if (!localStorage.getItem('selectedSize')) localStorage.setItem('selectedSize', '10"');
    if (!localStorage.getItem('selectedFont')) localStorage.setItem('selectedFont', 'Manuscrita');
    if (!localStorage.getItem('selectedSymbol')) localStorage.setItem('selectedSymbol', 'Nenhum');
    if (!localStorage.getItem('selectedEngravedName')) {
      const firstItemWithName = cart.find((i: any) => i.engravedName);
      if (firstItemWithName) localStorage.setItem('selectedEngravedName', firstItemWithName.engravedName);
    }
    
    setShowValidationAlert(false);
    toast.success("Dados recuperados com sucesso!");
  };

  const clearCartAndGoHome = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedSize');
    localStorage.removeItem('selectedFont');
    localStorage.removeItem('selectedSymbol');
    localStorage.removeItem('selectedEngravedName');
    setCart([]);
    setShowValidationAlert(false);
    toast.info("Carrinho limpo. Redirecionando...");
    navigate('/');
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = typeof item.product.price === 'number' 
      ? item.product.price 
      : parseFloat(item.product.price.toString().replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price;
  }, 0);

  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal);



  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);

  // ---------- Masks ----------
  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10) {
      return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
        [a && `(${a}`, a && a.length === 2 ? ') ' : '', b, c && `-${c}`].filter(Boolean).join('')
      );
    }
    return d.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  };
  const maskCPF = (v: string) =>
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const maskCEP = (v: string) =>
    v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  // ---------- Validators ----------
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const isValidPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    return d.length >= 10 && d.length <= 11;
  };
  const isValidCPF = (v: string) => {
    const cpf = v.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let d1 = (sum * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let d2 = (sum * 10) % 11;
    if (d2 === 10) d2 = 0;
    return d2 === parseInt(cpf[10]);
  };
  const isValidCEP = (v: string) => v.replace(/\D/g, '').length === 8;
  const isValidAddress = (v: string) => v.trim().length >= 5;

  const validateField = (id: string, value: string): string => {
    switch (id) {
      case 'email': return isValidEmail(value) ? '' : 'Digite um e-mail válido';
      case 'phone': return isValidPhone(value) ? '' : 'Digite um telefone válido';
      case 'cpf': return isValidCPF(value) ? '' : 'CPF inválido';
      case 'cep': return isValidCEP(value) ? '' : 'CEP inválido';
      case 'address': return isValidAddress(value) ? '' : 'Endereço deve ter no mínimo 5 caracteres';
      default: return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let v = value;
    if (id === 'phone') v = maskPhone(value);
    else if (id === 'cpf') v = maskCPF(value);
    else if (id === 'cep') v = maskCEP(value);
    setCustomer(prev => ({ ...prev, [id]: v }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const err = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: err }));

    if (id === 'cep' && !err) {
      const cep = value.replace(/\D/g, '');
      try {
        setCepLoading(true);
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) {
          setErrors(prev => ({ ...prev, cep: 'CEP inválido' }));
        } else {
          const addr = [data.logradouro, data.bairro, data.localidade, data.uf]
            .filter(Boolean).join(', ');
          if (addr) {
            setCustomer(prev => ({ ...prev, address: addr }));
            setErrors(prev => ({ ...prev, address: '' }));
          }
        }
      } catch {
        toast.error('Não foi possível buscar o endereço.');
      } finally {
        setCepLoading(false);
      }
    }
  };

  const validateAll = () => {
    const next: Record<string, string> = {};
    (['email', 'phone', 'cpf', 'cep', 'address'] as const).forEach(k => {
      const e = validateField(k, customer[k]);
      if (e) next[k] = e;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    if (showValidationAlert) {
      toast.error("Revise os dados de personalização antes de continuar.");
      return;
    }
    if (!validateAll()) {
      toast.error("Revise os campos do formulário.");
      return;
    }
    setLoading(true);
    
    try {
      const items = cart.map((item: any) => ({
        product_id: item.product.id,
        quantity: 1,
        engraved_name: item.engravedName || '',
      }));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { items, customer }
      });

      if (error) throw error;
      if (data?.init_url) {
        window.location.href = data.init_url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const fieldClass = (id: string) =>
    `bg-zinc-950 ${errors[id] ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-700'}`;
  const ErrorMsg = ({ id }: { id: string }) =>
    errors[id] ? <p className="text-xs text-red-500 mt-1">{errors[id]}</p> : null;


  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-12">
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-xl font-bold text-amber-500 font-serif">Herança de Aço</h1>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Lock className="w-4 h-4" />
            <span>Checkout Seguro</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showValidationAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8"
          >
            <Alert className="bg-amber-500/10 border-amber-500/50 text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Dados de Personalização Incompletos</AlertTitle>
              <AlertDescription className="mt-2 space-y-4">
                <div className="text-zinc-300">
                  <p className="mb-2">Detectamos que alguns itens do seu carrinho ou preferências gerais estão com informações faltando:</p>
                  <ul className="space-y-2 mb-4">
                    {cart.map((item: any) => {
                      const missing = [];
                      if (!item.selectedSize || item.selectedSize === '') missing.push('Tamanho');
                      if (!item.selectedFont || item.selectedFont === '') missing.push('Fonte');
                      if (!item.selectedSymbol || item.selectedSymbol === '') missing.push('Símbolo');
                      if (!item.engravedName || item.engravedName === '') missing.push('Nome');
                      
                      if (missing.length === 0) return null;
                      
                      return (
                        <li key={item.cartId} className="text-sm bg-zinc-900/50 p-2 rounded border border-zinc-800">
                          <span className="font-bold text-amber-500">{item.product.name}:</span>
                          <span className="ml-1 text-zinc-400">Faltando: {missing.join(', ')}</span>
                        </li>
                      );
                    })}
                    {(!localStorage.getItem('selectedSize') || !localStorage.getItem('selectedFont') || !localStorage.getItem('selectedSymbol') || !localStorage.getItem('selectedEngravedName')) && (
                      <li className="text-sm bg-zinc-900/50 p-2 rounded border border-zinc-800 italic text-zinc-400">
                        Preferências gerais do sistema também precisam ser recuperadas.
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-500/20">
                  <span className="text-xs text-zinc-400">Clique em "Recuperar Dados" para preencher com suas últimas preferências.</span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={recoverData}
                      className="bg-amber-500 text-black hover:bg-amber-400 border-none font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Recuperar Dados
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearCartAndGoHome}
                      className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-none font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpar e Início
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold">1</span>
                Informações de Contato
              </h2>
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardContent className="pt-6 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      placeholder="seu@email.com" 
                      className="bg-zinc-950 border-zinc-700" 
                      value={customer.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input 
                      id="phone" 
                      placeholder="(00) 00000-0000" 
                      className="bg-zinc-950 border-zinc-700" 
                      value={customer.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold">2</span>
                Entrega
              </h2>
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input 
                        id="cpf" 
                        placeholder="000.000.000-00" 
                        className="bg-zinc-950 border-zinc-700" 
                        value={customer.cpf}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        placeholder="00000-000" 
                        className="bg-zinc-950 border-zinc-700" 
                        value={customer.cep}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input 
                      id="address" 
                      placeholder="Rua, número e bairro" 
                      className="bg-zinc-950 border-zinc-700" 
                      value={customer.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold">3</span>
                Pagamento
              </h2>
              <form onSubmit={handlePayment}>
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col items-center justify-center py-6 bg-zinc-950/50 rounded-lg border border-dashed border-zinc-700 text-center space-y-3">
                      <div className="flex gap-4">
                        <CreditCard className="h-8 w-8 text-amber-500" />
                        <QrCode className="h-8 w-8 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Mercado Pago</p>
                        <p className="text-sm text-zinc-400">Pague com Cartão, Pix ou Boleto de forma segura.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit"
                      disabled={loading || cart.length === 0 || showValidationAlert}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-6 text-lg"
                    >
                      {loading ? "Processando..." : `Finalizar Pedido (${formattedTotal})`}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 text-white sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-zinc-950 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.product.name}</h3>
                      <div className="mt-1 space-y-0.5">
                        {item.engravedName && (
                          <p className="text-xs text-amber-500">Gravação: "{item.engravedName}"</p>
                        )}
                        <p className="text-[10px] text-zinc-500">Tam: {item.selectedSize} | Fonte: {item.selectedFont} | Símbolo: {typeof item.selectedSymbol === 'object' ? item.selectedSymbol.name : item.selectedSymbol}</p>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator className="bg-zinc-800" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Frete</span>
                    <span className="text-green-500">Grátis</span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-amber-500">{formattedTotal}</span>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex-col gap-4 text-xs text-zinc-500 text-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Pagamento 100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Entrega garantida pela Herança de Aço</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
