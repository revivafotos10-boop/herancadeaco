import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, QrCode, ShieldCheck, Truck, ChevronLeft, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

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
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Validate cart items
    const isIncomplete = cart.some((item: any) => 
      !item.selectedSize || !item.selectedFont || !item.selectedSymbol ||
      item.selectedSize === '' || item.selectedFont === '' || item.selectedSymbol === ''
    );
    
    // Check for top-level localStorage items mentioned in prompt
    const savedSize = localStorage.getItem('selectedSize');
    const savedFont = localStorage.getItem('selectedFont');
    const savedSymbol = localStorage.getItem('selectedSymbol');
    
    if (isIncomplete || !savedSize || !savedFont || !savedSymbol) {
      setShowValidationAlert(true);
    } else {
      setShowValidationAlert(false);
    }
  }, [cart]);

  const recoverData = () => {
    const recoveredCart = cart.map((item: any) => ({
      ...item,
      selectedSize: item.selectedSize || localStorage.getItem('selectedSize') || '10"',
      selectedFont: item.selectedFont || localStorage.getItem('selectedFont') || 'Manuscrita',
      selectedSymbol: item.selectedSymbol || localStorage.getItem('selectedSymbol') || 'Nenhum',
    }));
    
    setCart(recoveredCart);
    
    // Ensure top-level values are also set if missing
    if (!localStorage.getItem('selectedSize')) localStorage.setItem('selectedSize', '10"');
    if (!localStorage.getItem('selectedFont')) localStorage.setItem('selectedFont', 'Manuscrita');
    if (!localStorage.getItem('selectedSymbol')) localStorage.setItem('selectedSymbol', 'Nenhum');
    
    setShowValidationAlert(false);
    toast.success("Dados recuperados com sucesso!");
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace('R$ ', '').replace(',', '.'));
    return acc + price;
  }, 0);

  const formattedTotal = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;



  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating payment processing
    setTimeout(() => {
      setLoading(false);
      if (paymentMethod === 'pix') {
        navigate('/payment-status', { state: { status: 'pending', method: 'pix', cart } });
      } else {
        navigate('/payment-status', { state: { status: 'success', method: 'card', cart } });
      }


    }, 2000);
  };

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
                    <Input id="email" placeholder="seu@email.com" className="bg-zinc-950 border-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" className="bg-zinc-950 border-zinc-700" />
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
                      <Input id="cpf" placeholder="000.000.000-00" className="bg-zinc-950 border-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" className="bg-zinc-950 border-zinc-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" placeholder="Rua, número e bairro" className="bg-zinc-950 border-zinc-700" />
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
                  <CardHeader>
                    <RadioGroup defaultValue="pix" onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                        <Label
                          htmlFor="pix"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-amber-500 [&:has([data-state=checked])]:border-amber-500 cursor-pointer"
                        >
                          <QrCode className="mb-3 h-6 w-6" />
                          <span>Pix</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-amber-500 [&:has([data-state=checked])]:border-amber-500 cursor-pointer"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          <span>Cartão</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="bg-zinc-950 border-zinc-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Validade</Label>
                            <Input id="expiry" placeholder="MM/AA" className="bg-zinc-950 border-zinc-700" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="bg-zinc-950 border-zinc-700" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {paymentMethod === 'pix' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-center py-4 bg-zinc-950/50 rounded-lg border border-dashed border-zinc-700"
                      >
                        <p className="text-sm text-zinc-400">O código Pix será gerado após clicar em finalizar.</p>
                        <p className="text-xs text-amber-500/70 mt-2">Aprovação instantânea</p>
                      </motion.div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-6 text-lg"
                    >
                      {loading ? "Processando..." : `Pagar ${formattedTotal}`}
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
                    <div className="w-20 h-20 bg-zinc-950 rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.product.name}</h3>
                      <div className="mt-1 space-y-0.5">
                        {item.engravedName && (
                          <p className="text-xs text-amber-500">Gravação: "{item.engravedName}"</p>
                        )}
                        <p className="text-[10px] text-zinc-500">Tam: {item.selectedSize} | Fonte: {item.selectedFont} | Símbolo: {item.selectedSymbol}</p>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{item.product.price}</p>
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
