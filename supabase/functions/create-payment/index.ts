import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, price, quantity } = await req.json()
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set')
    }

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: title,
            unit_price: Number(price),
            quantity: Number(quantity) || 1,
            currency_id: 'BRL',
          }
        ],
        back_urls: {
          success: `https://herancadeaco.lovable.app/sucesso`,
          failure: `https://herancadeaco.lovable.app/erro`,
          pending: `https://herancadeaco.lovable.app/pendente`,
        },
        auto_return: 'approved',
      }),
    })

    const preference = await preferenceResponse.json()

    if (!preferenceResponse.ok) {
      throw new Error(preference.message || 'Error creating preference')
    }

    return new Response(
      JSON.stringify({ init_url: preference.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
