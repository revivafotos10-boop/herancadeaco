import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Copy, QrCode, ChevronLeft, Package, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status, method, product, engravedName, selectedFont, selectedSymbol } = location.state || { status: 'success', method: 'card', product: { name: 'Faca Selecionada', price: 'R$ 299,00' }, engravedName: '', selectedFont: '', selectedSymbol: '' };

  const copyPix = () => {
    navigator.clipboard.writeText("00020101021226850014br.gov.bcb.pix013662d59302-604a-4363-9524-766723f6685a5204000053039865802BR5925HERANCA DE ACO6009SAO PAULO62070503***6304E22A");
    toast.success("Código Pix copiado!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
                    <p className="text-sm text-zinc-400">{product.name}</p>
                    <p className="text-sm font-bold text-amber-500 mt-1">{product.price}</p>
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
