import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Copy, QrCode, ChevronLeft, Package, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const PRODUCT_DEFAULTS: Record<string, { size: string, font: string, symbol: string }> = {
  'Cutelo Artesanal': { size: '8"', font: 'Bold', symbol: '⚔️' },
  'Faca Chef Premium': { size: '10"', font: 'Serif', symbol: 'Nenhum' },
  'Faca Picanheira': { size: '12"', font: 'Caligrafia', symbol: '🔥' },
};

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(() => {
    if (location.state) return location.state;
    const savedCart = localStorage.getItem('cart');
    return {
      status: 'success',
      method: 'card',
      cart: savedCart ? JSON.parse(savedCart) : []
    };
  });
  const { status, method, cart } = orderData;
  
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  useEffect(() => {
    // Validate cart items
    const isIncomplete = cart.some((item: any) => 
      !item.selectedSize || !item.selectedFont || !item.selectedSymbol || !item.engravedName ||
      item.selectedSize === '' || item.selectedFont === '' || item.selectedSymbol === '' || item.engravedName === ''
    );
    
    // Check if any item in cart has its corresponding product-specific localStorage items missing
    const isLocalStorageIncomplete = cart.some((item: any) => {
      const productId = item.product?.id;
      return !localStorage.getItem(`selectedSize_${productId}`) || 
             !localStorage.getItem(`selectedFont_${productId}`) || 
             !localStorage.getItem(`selectedSymbol_${productId}`);
    });
    
    if (isIncomplete || isLocalStorageIncomplete) {
      setShowValidationAlert(true);
    }
  }, [cart]);

  const recoverData = () => {
    const recoveredCart = cart.map((item: any) => {
      const productName = item.product?.name;
      const productId = item.product?.id;
      const defaults = PRODUCT_DEFAULTS[productName] || { size: '10"', font: 'Manuscrita', symbol: 'Nenhum' };
      
      return {
        ...item,
        selectedSize: item.selectedSize || localStorage.getItem(`selectedSize_${productId}`) || defaults.size,
        selectedFont: item.selectedFont || localStorage.getItem(`selectedFont_${productId}`) || defaults.font,
        selectedSymbol: item.selectedSymbol || localStorage.getItem(`selectedSymbol_${productId}`) || defaults.symbol,
        engravedName: item.engravedName || localStorage.getItem(`engravedName_${productId}`) || '',
      };
    });
    
    setOrderData({ ...orderData, cart: recoveredCart });
    
    // Update individual localStorage items if missing
    recoveredCart.forEach((item: any) => {
      const productId = item.product?.id;
      if (!localStorage.getItem(`selectedSize_${productId}`)) localStorage.setItem(`selectedSize_${productId}`, item.selectedSize);
      if (!localStorage.getItem(`selectedFont_${productId}`)) localStorage.setItem(`selectedFont_${productId}`, item.selectedFont);
      if (!localStorage.getItem(`selectedSymbol_${productId}`)) localStorage.setItem(`selectedSymbol_${productId}`, item.selectedSymbol);
      if (!localStorage.getItem(`engravedName_${productId}`) && item.engravedName) {
        localStorage.setItem(`engravedName_${productId}`, item.engravedName);
      }
    });
    
    setShowValidationAlert(false);
    toast.success("Dados de visualização recuperados!");
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace('R$ ', '').replace(',', '.'));
    return acc + price;
  }, 0);

  const formattedTotal = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;


  const copyPix = () => {
    navigator.clipboard.writeText("00020101021226850014br.gov.bcb.pix013662d59302-604a-4363-9524-766723f6685a5204000053039865802BR5925HERANCA DE ACO6009SAO PAULO62070503***6304E22A");
    toast.success("Código Pix copiado!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        {showValidationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="bg-amber-500/10 border-amber-500/50 text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Aviso: Informações Ausentes</AlertTitle>
              <AlertDescription className="flex flex-col gap-3 mt-2">
                <p className="text-sm text-zinc-300">Alguns detalhes técnicos do seu pedido não foram carregados completamente na visualização.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={recoverData}
                  className="bg-amber-500 text-black hover:bg-amber-400 border-none font-bold self-start flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Corrigir Visualização
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden">
            {status === 'success' ? (
              <div className="bg-green-500/10 p-8 text-center border-b border-green-500/20">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-green-500">Pagamento Aprovado!</h1>
                <p className="text-zinc-400 mt-2">Seu pedido foi recebido e já está em processamento.</p>
              </div>
            ) : (
              <div className="bg-amber-500/10 p-8 text-center border-b border-amber-500/20">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-12 h-12 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-amber-500">Aguardando Pagamento</h1>
                <p className="text-zinc-400 mt-2">Finalize o pagamento via Pix para confirmar seu pedido.</p>
              </div>
            )}

            <CardContent className="p-8 space-y-6">
              {status === 'pending' && method === 'pix' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-xl">
                      <QrCode className="w-48 h-48 text-black" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-center text-zinc-400">Ou copie o código abaixo:</p>
                    <div className="flex gap-2">
                      <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg flex-1 overflow-hidden">
                        <code className="text-xs text-zinc-500 block truncate">
                          00020101021226850014br.gov.bcb.pix013662d59302-604a-4363-9524-766723f6685a5204000053039865802BR5925HERANCA DE ACO6009SAO PAULO62070503***6304E22A
                        </code>
                      </div>
                      <Button onClick={copyPix} variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-start gap-4">
                  <Package className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">Resumo do Pedido</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.cartId} className="border-l-2 border-amber-500/30 pl-3">
                          <p className="text-sm text-zinc-300 font-medium">{item.product.name}</p>
                          <div className="mt-1">
                            {item.engravedName && (
                              <p className="text-sm text-amber-500 font-bold">"{item.engravedName}"</p>
                            )}
                            <p className="text-[10px] text-zinc-500">
                              Tam: {item.selectedSize} | Fonte: {item.selectedFont} | Símbolo: {item.selectedSymbol}
                            </p>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{item.product.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center mt-4">
                      <span className="text-sm text-zinc-400">Total Pago</span>
                      <span className="text-lg font-bold text-amber-500">{formattedTotal}</span>
                    </div>


                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">Prazo de Entrega</h3>
                    <p className="text-sm text-zinc-400">Previsão de entrega para o Dia dos Pais.</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0 flex flex-col gap-3">
              <Button onClick={() => navigate('/')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                Voltar para a Loja
              </Button>
              {status === 'success' && (
                <p className="text-center text-xs text-zinc-500">
                  Enviamos um e-mail de confirmação com todos os detalhes.
                </p>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentStatus;
