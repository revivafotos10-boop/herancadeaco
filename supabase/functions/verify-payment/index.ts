import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.25.76'

const BodySchema = z.object({
  payment_id: z.string().regex(/^\d+$/).max(32),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Identificador de pagamento inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) throw new Error('Credencial de pagamento indisponível')

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${parsed.data.payment_id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Pagamento não encontrado' }), {
        status: response.status === 404 ? 404 : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payment = await response.json()
    return new Response(JSON.stringify({
      status: payment.status,
      payment_method_id: payment.payment_method_id,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('verify-payment error:', error)
    return new Response(JSON.stringify({ error: 'Não foi possível verificar o pagamento' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})