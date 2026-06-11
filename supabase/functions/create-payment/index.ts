import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { z } from "npm:zod@3.25.76"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  product_id: string
  quantity?: number
  engraved_name?: string
}

const BodySchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1).max(20).default(1),
    engraved_name: z.string().trim().max(25).default(''),
  })).min(1).max(20),
  customer: z.object({
    email: z.string().email().max(254),
    phone: z.string().trim().max(30).optional(),
    cpf: z.string().trim().max(20).optional(),
    cep: z.string().trim().max(12).optional(),
    address: z.string().trim().max(300).optional(),
  }),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid checkout data', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const body = parsed.data
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set')
    }

    const cartItems: CartItem[] = body.items

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
          success: `https://herancadeaco.lovable.app/payment-status`,
          failure: `https://herancadeaco.lovable.app/payment-status`,
          pending: `https://herancadeaco.lovable.app/payment-status`,
        },
        auto_return: 'approved',
        statement_descriptor: 'HERANCA ACO',
        payer: {
          email: body.customer.email,
          phone: body.customer.phone ? { number: body.customer.phone } : undefined,
          identification: body.customer.cpf ? { type: 'CPF', number: body.customer.cpf.replace(/\D/g, '') } : undefined,
          address: body.customer.address || body.customer.cep ? {
            street_name: body.customer.address,
            zip_code: body.customer.cep?.replace(/\D/g, ''),
          } : undefined,
        },
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
