import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  GripVertical,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  button_url: string;
  active: boolean;
  sort_order: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('home_banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      alert('Erro ao carregar banners: ' + error.message);
    } else if (data) {
      setBanners(data);
    }
    setLoading(false);
  };

  const addBanner = () => {
    const newBanner: Banner = {
      id: crypto.randomUUID(),
      title: '',
      image_url: '',
      button_url: '',
      active: true,
      sort_order: banners.length
    };
    setBanners([...banners, newBanner]);
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners(banners.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBanner = async (id: string) => {
    const { error } = await supabase.from('home_banners').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir banner: ' + error.message);
      return;
    }
    setBanners(banners.filter(b => b.id !== id));
  };

  const saveBanners = async () => {
    setSaving(true);
    try {
      // Upsert all banners
      const bannersToSave = banners.map((b, index) => ({
        ...b,
        sort_order: index,
        id: b.id
      })).filter(b => b.image_url);

      const { error } = await supabase
        .from('home_banners')
        .upsert(bannersToSave);

      if (error) throw error;
      alert('Banners salvos com sucesso!');
      fetchBanners();
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin-produtos')} className="p-2 hover:bg-zinc-900 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-black font-serif uppercase tracking-widest">Banners da Home</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={addBanner}
              className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
            <button 
              onClick={saveBanners}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-600 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Alterações</>}
            </button>
          </div>
        </div>

        <Reorder.Group axis="y" values={banners} onReorder={setBanners} className="space-y-4">
          {banners.map((banner) => (
            <Reorder.Item 
              key={banner.id} 
              value={banner}
              className="bg-[#0d0d0d] border border-zinc-900 rounded-2xl p-6 flex gap-6 items-center"
            >
              <div className="cursor-grab active:cursor-grabbing text-zinc-700">
                <GripVertical className="w-6 h-6" />
              </div>

              <div className="w-40 h-24 bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 flex-shrink-0">
                {banner.image_url ? (
                  <img src={banner.image_url} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-800" />
                )}
              </div>

              <div className="flex-grow grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Título</label>
                  <input 
                    type="text" 
                    value={banner.title} 
                    onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-amber-500 outline-none transition-colors"
                    placeholder="Ex: Promoção de Natal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">URL da Imagem</label>
                  <input 
                    type="text" 
                    value={banner.image_url} 
                    onChange={(e) => updateBanner(banner.id, { image_url: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-amber-500 outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Link do Botão (Opcional)</label>
                  <input 
                    type="text" 
                    value={banner.button_url} 
                    onChange={(e) => updateBanner(banner.id, { button_url: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-amber-500 outline-none transition-colors"
                    placeholder="/produto/slug"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <button 
                    onClick={() => updateBanner(banner.id, { active: !banner.active })}
                    className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-all ${
                      banner.active 
                      ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {banner.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button 
                    onClick={() => removeBanner(banner.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {banners.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-3xl">
            <p className="text-zinc-500 font-serif italic mb-4">Nenhum banner cadastrado.</p>
            <button onClick={addBanner} className="text-amber-500 font-black text-xs uppercase tracking-widest hover:underline">Adicionar Primeiro</button>
          </div>
        )}
      </div>
    </div>
  );
}
