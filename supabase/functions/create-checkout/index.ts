import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, customer } = await req.json()
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set')
    }

    // Usando fetch diretamente para a API do Mercado Pago (v1)
    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          title: item.product.name,
          unit_price: Number(item.product.price),
          quantity: 1,
          currency_id: 'BRL',
          picture_url: item.product.image_url,
          description: `Personalização: ${item.engravedName || 'Nenhum'}`,
        })),
        payer: {
          email: customer.email,
          identification: {
            type: 'CPF',
            number: customer.cpf?.replace(/\D/g, ''),
          },
        },
        back_urls: {
          success: `${req.headers.get('origin')}/payment-status?status=success`,
          failure: `${req.headers.get('origin')}/payment-status?status=failure`,
          pending: `${req.headers.get('origin')}/payment-status?status=pending`,
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
        statement_descriptor: 'HERANCA ACO',
      }),
    })

    const preference = await preferenceResponse.json()

    if (!preferenceResponse.ok) {
      console.error('Mercado Pago Error:', preference)
      throw new Error(preference.message || 'Error creating preference')
    }

    return new Response(
      JSON.stringify({ init_url: preference.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
