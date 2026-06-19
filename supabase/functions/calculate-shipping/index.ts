import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const ORIGIN_CEP = '18466052';
const FREE_SHIPPING_UFS = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'];
const FREE_SHIPPING_THRESHOLD = 300;

interface ShippingOption {
  id: number | string;
  name: string;
  company: string;
  price: number;
  delivery_time: number;
  free: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('MELHOR_ENVIO_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'MELHOR_ENVIO_TOKEN não configurado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const rawCep = String(body.cep ?? '').replace(/\D/g, '');
    const subtotal = Number(body.subtotal ?? 0);

    if (rawCep.length !== 8) {
      return new Response(JSON.stringify({ error: 'CEP inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Detect UF via ViaCEP
    let destUf = '';
    try {
      const viaRes = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const viaData = await viaRes.json();
      destUf = (viaData?.uf ?? '').toUpperCase();
    } catch (_) {
      // ignore — fallback: don't apply free shipping
    }

    const eligibleFree =
      FREE_SHIPPING_UFS.includes(destUf) && subtotal >= FREE_SHIPPING_THRESHOLD;

    const payload = {
      from: { postal_code: ORIGIN_CEP },
      to: { postal_code: rawCep },
      products: [
        {
          id: 'pacote-1',
          width: 10,
          height: 10,
          length: 50,
          weight: 0.6,
          insurance_value: Math.max(subtotal, 1),
          quantity: 1,
        },
      ],
    };

    const meRes = await fetch(
      'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Heranca de Aco (contato@herancadeaco.com.br)',
        },
        body: JSON.stringify(payload),
      },
    );

    const meText = await meRes.text();
    if (!meRes.ok) {
      console.error('Melhor Envio error:', meRes.status, meText);
      return new Response(
        JSON.stringify({ error: 'Erro ao calcular frete', details: meText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let meData: any;
    try {
      meData = JSON.parse(meText);
    } catch {
      return new Response(JSON.stringify({ error: 'Resposta inválida do Melhor Envio' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const options: ShippingOption[] = (Array.isArray(meData) ? meData : [])
      .filter((s: any) => !s?.error)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        company: s?.company?.name ?? '',
        price: eligibleFree ? 0 : Number(s.price ?? 0),
        delivery_time: Number(s.delivery_time ?? 0),
        free: eligibleFree,
      }));

    return new Response(
      JSON.stringify({ uf: destUf, free_shipping: eligibleFree, options }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('calculate-shipping error', err);
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
