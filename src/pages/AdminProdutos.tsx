import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, Upload, X, Save, ImagePlus } from 'lucide-react';
import { toast } from "sonner";

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  size_cm: string;
  material: string;
  handle_material: string;
  features: string[];
  image_url: string;
  gallery_images: string[];
  active: boolean;
  engraving_x: number;
  engraving_y: number;
  engraving_rotation: number;
  engraving_font_size: number;
  engraving_color: string;
  created_at?: string;
}

const INITIAL_PRODUCT: Product = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  old_price: null,
  size_cm: '',
  material: '',
  handle_material: '',
  features: [],
  image_url: '',
  gallery_images: [],
  active: true,
  engraving_x: 55,
  engraving_y: 45,
  engraving_rotation: -5,
  engraving_font_size: 20,
  engraving_color: '#111111',
};

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>(INITIAL_PRODUCT);
  const [uploading, setUploading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [previews, setPreviews] = useState<{file: File, url: string}[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Erro ao buscar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData(INITIAL_PRODUCT);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const dataToSave = { 
        ...formData, 
        slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      };

      if (editingProduct?.id) {
        const { error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([dataToSave]);
        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao salvar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'gallery_images') => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (field === 'image_url') {
        setFormData({ ...formData, image_url: publicUrl });
      } else {
        setFormData({ ...formData, gallery_images: [...formData.gallery_images, publicUrl] });
      }
      toast.success('Upload realizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };
  const handleBulkFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPreviews = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const processBulkUpload = async () => {
    if (previews.length === 0) return;
    setBulkUploading(true);
    try {
      const createdProducts: Product[] = [];
      
      for (const item of previews) {
        const file = item.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const productName = "Produto novo";
        const baseSlug = productName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

        const newProduct = {
          name: productName,
          slug: slug,
          description: "Editar descrição",
          price: 0,
          image_url: publicUrl,
          active: true,
          features: [],
          gallery_images: [],
          size_cm: '',
          material: '',
          handle_material: '',
          old_price: null,
          engraving_x: 55,
          engraving_y: 45,
          engraving_rotation: -25,
          engraving_font_size: 20,
          engraving_color: '#111111',
          engraving_area_x: 43,
          engraving_area_y: 34,
          engraving_area_width: 25,
          engraving_area_height: 8,
        };

        const { data, error: insertError } = await supabase
          .from('products')
          .insert([newProduct])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) createdProducts.push(data);
      }

      toast.success(`${createdProducts.length} produtos criados com sucesso!`);
      setPreviews([]);
      await fetchProducts();

      if (createdProducts.length > 0) {
        handleOpenDialog(createdProducts[0]);
      }
    } catch (error: any) {
      toast.error('Erro ao processar produtos: ' + error.message);
    } finally {
      setBulkUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-amber-500">Gestão de Produtos</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-amber-600 hover:bg-amber-700 text-black font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <Card className="mb-8 bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-amber-500 flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Adicionar produto por imagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-8 bg-zinc-950/50 transition-colors hover:border-amber-500/50">
              <Upload className="h-12 w-12 text-zinc-600 mb-4" />
              <p className="text-zinc-400 mb-4 text-center">Arraste suas imagens aqui ou clique para selecionar</p>
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                Selecionar Imagens
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleBulkFileUpload} 
                  disabled={bulkUploading} 
                />
              </label>
            </div>

            {previews.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {previews.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                      <img src={item.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removePreview(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={processBulkUpload} 
                    disabled={bulkUploading}
                    className="bg-amber-600 hover:bg-amber-700 text-black font-bold"
                  >
                    {bulkUploading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" /> Criar {previews.length} Produto(s)</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800 border-zinc-800">
              <TableHead className="text-zinc-400">Imagem</TableHead>
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">Preço</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-right text-zinc-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-500" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-zinc-800/50 border-zinc-800">
                  <TableCell>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-contain bg-zinc-800 rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center text-[8px] text-zinc-500">S/ Foto</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>R$ {Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.active ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)} className="text-zinc-400 hover:text-amber-500">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => product.id && handleDelete(product.id)} className="text-zinc-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-amber-500">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço Atual</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="old_price">Preço Antigo</Label>
                  <Input 
                    id="old_price" 
                    type="number"
                    value={formData.old_price || ''} 
                    onChange={(e) => setFormData({...formData, old_price: e.target.value ? Number(e.target.value) : null})}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho (cm)</Label>
                  <Input 
                    id="size" 
                    value={formData.size_cm} 
                    onChange={(e) => setFormData({...formData, size_cm: e.target.value})}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material Lâmina</Label>
                  <Input 
                    id="material" 
                    value={formData.material} 
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle">Material Cabo</Label>
                  <Input 
                    id="handle" 
                    value={formData.handle_material} 
                    onChange={(e) => setFormData({...formData, handle_material: e.target.value})}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="active">Produto Ativo</Label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Imagem Principal</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                  {formData.image_url ? (
                    <div className="relative w-full aspect-video">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <button 
                        onClick={() => setFormData({...formData, image_url: ''})}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-zinc-600 mb-2" />
                      <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                        Subir Imagem
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} disabled={uploading} />
                      </label>
                    </div>
                  )}
                  {uploading && <Loader2 className="mt-2 h-4 w-4 animate-spin text-amber-500" />}
                </div>
              </div>

              <div className="space-y-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
                <Label className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Zona de Gravação (Automática)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area_x">Centro X (%)</Label>
                    <Input id="area_x" type="number" value={formData.engraving_area_x} onChange={(e) => setFormData({...formData, engraving_area_x: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_y">Centro Y (%)</Label>
                    <Input id="area_y" type="number" value={formData.engraving_area_y} onChange={(e) => setFormData({...formData, engraving_area_y: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_w">Largura Máx (%)</Label>
                    <Input id="area_w" type="number" value={formData.engraving_area_width} onChange={(e) => setFormData({...formData, engraving_area_width: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_h">Altura Máx (%)</Label>
                    <Input id="area_h" type="number" value={formData.engraving_area_height} onChange={(e) => setFormData({...formData, engraving_area_height: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eng_rot">Rotação (graus)</Label>
                    <Input id="eng_rot" type="number" value={formData.engraving_rotation} onChange={(e) => setFormData({...formData, engraving_rotation: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eng_color">Cor</Label>
                    <Input id="eng_color" type="text" value={formData.engraving_color} onChange={(e) => setFormData({...formData, engraving_color: e.target.value})} className="bg-zinc-900 border-zinc-800" placeholder="#2b2b2b" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Diferenciais (Features)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={featureInput} 
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Ex: Aço Carbono 1070"
                    className="bg-zinc-900 border-zinc-800"
                  />
                  <Button onClick={addFeature} className="bg-zinc-800 hover:bg-zinc-700">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, idx) => (
                    <span key={idx} className="bg-amber-900/30 text-amber-500 border border-amber-500/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {feature}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(idx)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Galeria de Imagens</Label>
                <div className="grid grid-cols-3 gap-2">
                  {formData.gallery_images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded border border-zinc-800" />
                      <button 
                        onClick={() => setFormData({
                          ...formData, 
                          gallery_images: formData.gallery_images.filter((_, i) => i !== idx)
                        })}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                    <Plus className="h-6 w-6 text-zinc-600" />
                    <span className="text-[10px] text-zinc-500 mt-1">Add</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery_images')} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t border-zinc-800 pt-6">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400">Cancelar</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-black font-bold">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Salvar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
