import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  product_id: string
  quantity?: number
  engraved_name?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set')
    }

    // Build normalized cart items list (only product_id + quantity accepted)
    let cartItems: CartItem[] = []
    if (Array.isArray(body.items)) {
      cartItems = body.items
        .map((i: any) => ({
          product_id: i.product_id ?? i.product?.id,
          quantity: Number(i.quantity) || 1,
          engraved_name: i.engraved_name ?? i.engravedName ?? '',
        }))
        .filter((i: CartItem) => typeof i.product_id === 'string' && i.product_id.length > 0)
    } else if (body.product_id) {
      cartItems = [{ product_id: body.product_id, quantity: Number(body.quantity) || 1 }]
    }

    if (cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch real prices from database — never trust client-supplied prices
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const productIds = cartItems.map(i => i.product_id)
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id, name, price, image_url, active')
      .in('id', productIds)

    if (dbError) throw dbError
    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Products not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const productMap = new Map(products.map(p => [p.id, p]))
    const mpItems = cartItems
      .map(ci => {
        const p = productMap.get(ci.product_id)
        if (!p || p.active === false) return null
        return {
          title: p.name,
          unit_price: Number(p.price),
          quantity: ci.quantity || 1,
          currency_id: 'BRL',
          picture_url: p.image_url,
          description: ci.engraved_name ? `Gravação: ${ci.engraved_name}` : undefined,
        }
      })
      .filter(Boolean)

    if (mpItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid active products in cart' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: mpItems,
        back_urls: {
          success: `https://herancadeaco.lovable.app/sucesso`,
          failure: `https://herancadeaco.lovable.app/erro`,
          pending: `https://herancadeaco.lovable.app/pendente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'HERANCA ACO',
      }),
    })

    const preference = await preferenceResponse.json()

    if (!preferenceResponse.ok) {
      console.error('Mercado Pago error:', preference)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment preference' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ init_url: preference.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('create-payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
