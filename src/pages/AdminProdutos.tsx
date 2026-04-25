import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
import { Plus, Pencil, Trash2, Loader2, Upload, X, Save, ImagePlus, Minus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
  engraving_opacity: number;
  engraving_blend_mode: string;
  engraving_area_x: number;
  engraving_area_y: number;
  engraving_area_width: number;
  engraving_area_height: number;
  engraving_start_x: number;
  engraving_start_y: number;
  engraving_end_x: number;
  engraving_end_y: number;
  preview_text: string;
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
  engraving_rotation: -55,
  engraving_font_size: 20,
  engraving_color: '#000000',
  engraving_opacity: 1.0,
  engraving_blend_mode: 'normal',
  engraving_area_x: 35,
  engraving_area_y: 40,
  engraving_area_width: 30,
  engraving_area_height: 10,
  engraving_start_x: 33,
  engraving_start_y: 44,
  engraving_end_x: 60,
  engraving_end_y: 35,
  preview_text: 'MARCELO',
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    setZoomLevel(prev => {
      const newZoom = delta < 0 ? Math.min(prev + 0.1, 3) : Math.max(prev - 0.1, 1);
      
      // Se estamos dando zoom, vamos focar onde o mouse está
      if (newZoom > 1) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomOrigin({ x, y });
      } else {
        setZoomOrigin({ x: 50, y: 50 });
      }
      
      return newZoom;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setZoomOrigin({ x: 50, y: 50 });
  };

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
          engraving_rotation: -55,
          engraving_font_size: 20,
          engraving_color: '#000000',
          engraving_opacity: 1.0,
          engraving_blend_mode: 'normal',
          engraving_area_x: 35,
          engraving_area_y: 40,
          engraving_area_width: 30,
          engraving_area_height: 10,
          engraving_start_x: 33,
          engraving_start_y: 44,
          engraving_end_x: 60,
          engraving_end_y: 35,
          preview_text: 'MARCELO',
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

              <div className="space-y-2">
                <Label>Imagem Principal (Clique para marcar pontos de gravação)</Label>
                <div 
                  className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-zoom-in group"
                  onWheel={handleWheel}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    
                    // Consider zoom for coordinate calculation
                    // Se o zoom origin é {x: 50, y: 50} e zoom é 2x, 
                    // o que vemos é um recorte.
                    // Para simplificar e manter a precisão das coordenadas originais:
                    // As coordenadas são sempre relativas à imagem base 0-100%
                    
                    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
                    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
                    
                    // Quando há zoom, a posição visual do mouse precisa ser convertida de volta
                    // para a coordenada real da imagem base.
                    // VisualPosition = Origin + (RealPosition - Origin) * Zoom
                    // RealPosition = Origin + (VisualPosition - Origin) / Zoom
                    
                    const x = zoomOrigin.x + (mouseX - zoomOrigin.x) / zoomLevel;
                    const y = zoomOrigin.y + (mouseY - zoomOrigin.y) / zoomLevel;
                    
                    setFormData(prev => {
                      const distStart = Math.sqrt(Math.pow(x - prev.engraving_start_x, 2) + Math.pow(y - prev.engraving_start_y, 2));
                      const distEnd = Math.sqrt(Math.pow(x - prev.engraving_end_x, 2) + Math.pow(y - prev.engraving_end_y, 2));
                      
                      if (distStart < distEnd) {
                        return { ...prev, engraving_start_x: x, engraving_start_y: y };
                      } else {
                        return { ...prev, engraving_end_x: x, engraving_end_y: y };
                      }
                    });
                  }}
                >
                  <div 
                    className="w-full h-full transition-transform duration-200 ease-out"
                    style={{ 
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
                    }}
                  >
                  {formData.image_url ? (
                    <>
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain p-4" />
                      
                      {/* Simulation Overlay - Auto positioning logic */}
                      {(() => {
                        const x1 = formData.engraving_start_x;
                        const y1 = formData.engraving_start_y;
                        const x2 = formData.engraving_end_x;
                        const y2 = formData.engraving_end_y;

                        // Center point
                        const x = (x1 + x2) / 2;
                        const y = (y1 + y2) / 2;

                        // Distance (width of the area)
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const w = Math.sqrt(dx * dx + dy * dy);
                        
                        // Rotation in degrees
                        const rot = Math.atan2(dy, dx) * (180 / Math.PI);
                        
                        // Standard height for the text area - adjusted by font size
                        const h = (formData.engraving_font_size || 20) / 2.5;

                        return (
                          <div 
                            className="absolute pointer-events-none flex items-center justify-center"
                            style={{
                              left: `${x - (w / 2)}%`,
                              top: `${y - (h / 2)}%`,
                              width: `${w}%`,
                              height: `${h}%`,
                              transform: `rotate(${rot}deg)`,
                              zIndex: 20,
                              mixBlendMode: (formData.engraving_blend_mode as any) || 'normal',
                              opacity: formData.engraving_opacity ?? 1.0,
                            }}
                          >
                            <svg 
                              viewBox="0 0 200 40" 
                              width="100%" 
                              height="100%" 
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <text 
                                x="100" 
                                y="20" 
                                textAnchor="middle" 
                                dominantBaseline="middle"
                                textLength="190"
                                lengthAdjust="spacing"
                                style={{ 
                                  fontSize: `${formData.engraving_font_size * 1.5}px`, 
                                  fontWeight: '600',
                                  fill: formData.engraving_color || '#2b2b2b',
                                  fontFamily: 'Dancing Script, cursive',
                                  letterSpacing: '0.01em',
                                }}
                              >
                                {formData.preview_text || "MARCELO"}
                              </text>
                            </svg>
                          </div>
                        );
                      })()}

                      {/* Visual indicators for points */}
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-lg z-30" style={{ left: `${formData.engraving_start_x}%`, top: `${formData.engraving_start_y}%` }}>
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-black px-1 rounded">INÍCIO</span>
                      </div>
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-lg z-30" style={{ left: `${formData.engraving_end_x}%`, top: `${formData.engraving_end_y}%` }}>
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-black px-1 rounded">FIM</span>
                      </div>
                      {/* Line connecting points */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-25">
                        <line 
                          x1={`${formData.engraving_start_x}%`} 
                          y1={`${formData.engraving_start_y}%`} 
                          x2={`${formData.engraving_end_x}%`} 
                          y2={`${formData.engraving_end_y}%`} 
                          stroke="white" 
                          strokeWidth="1" 
                          strokeDasharray="4"
                        />
                      </svg>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">Upload image to set points</div>
                  )}
                  </div>
                  
                  {/* Zoom Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-40">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-zinc-800/80 hover:bg-zinc-700 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(prev => Math.min(prev + 0.5, 3));
                      }}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-zinc-800/80 hover:bg-zinc-700 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(prev => Math.max(prev - 0.5, 1));
                      }}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-zinc-800/80 hover:bg-zinc-700 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetZoom();
                      }}
                      title="Reset Zoom"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-bold">CLIQUE PARA REPOSICIONAR PONTOS | SCROLL PARA ZOOM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input type="file" onChange={(e) => handleFileUpload(e, 'image_url')} className="hidden" id="main-image" />
                  <Button asChild variant="outline" className="w-full bg-zinc-900 border-zinc-800">
                    <label htmlFor="main-image" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" /> {uploading ? 'Fazendo upload...' : 'Mudar Imagem Principal'}
                    </label>
                  </Button>
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
                <Label className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Posicionamento da Gravação</Label>
                <p className="text-[10px] text-zinc-500 mb-2">Clique na imagem ao lado para definir o Ponto Inicial e Final da gravação.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px]">Início (X, Y)</Label>
                    <div className="flex gap-1">
                      <Input type="number" value={Math.round(formData.engraving_start_x)} onChange={(e) => setFormData({...formData, engraving_start_x: Number(e.target.value)})} className="bg-zinc-950 border-zinc-800 h-8 text-[10px]" />
                      <Input type="number" value={Math.round(formData.engraving_start_y)} onChange={(e) => setFormData({...formData, engraving_start_y: Number(e.target.value)})} className="bg-zinc-950 border-zinc-800 h-8 text-[10px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px]">Fim (X, Y)</Label>
                    <div className="flex gap-1">
                      <Input type="number" value={Math.round(formData.engraving_end_x)} onChange={(e) => setFormData({...formData, engraving_end_x: Number(e.target.value)})} className="bg-zinc-950 border-zinc-800 h-8 text-[10px]" />
                      <Input type="number" value={Math.round(formData.engraving_end_y)} onChange={(e) => setFormData({...formData, engraving_end_y: Number(e.target.value)})} className="bg-zinc-950 border-zinc-800 h-8 text-[10px]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preview_text">Texto de Preview</Label>
                    <Input 
                      id="preview_text" 
                      value={formData.preview_text} 
                      onChange={(e) => setFormData({...formData, preview_text: e.target.value})} 
                      className="bg-zinc-900 border-zinc-800"
                      placeholder="MARCELO"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] text-zinc-400">Tamanho da Fonte ({formData.engraving_font_size})</Label>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 bg-zinc-800 border-zinc-700"
                          onClick={() => setFormData(prev => ({ ...prev, engraving_font_size: Math.max(10, (prev.engraving_font_size || 20) - 1) }))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 bg-zinc-800 border-zinc-700"
                          onClick={() => setFormData(prev => ({ ...prev, engraving_font_size: Math.min(40, (prev.engraving_font_size || 20) + 1) }))}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Slider 
                      value={[formData.engraving_font_size || 20]} 
                      min={10} 
                      max={40} 
                      step={1} 
                      onValueChange={(vals) => setFormData({ ...formData, engraving_font_size: vals[0] })}
                      className="py-2"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-2 border-t border-zinc-800/50">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-zinc-400 uppercase tracking-widest">Cor da Personalização</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={formData.engraving_color === '#000000' ? "default" : "outline"}
                        className={`flex-1 h-9 text-xs ${formData.engraving_color === '#000000' ? 'bg-zinc-100 text-black border-white hover:bg-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                        onClick={() => setFormData({...formData, engraving_color: '#000000', engraving_blend_mode: 'normal'})}
                      >
                        <div className="w-3 h-3 rounded-full bg-black border border-zinc-700 mr-2" />
                        Preto
                      </Button>
                      <Button 
                        variant={formData.engraving_color === '#BFBFBF' ? "default" : "outline"}
                        className={`flex-1 h-9 text-xs ${formData.engraving_color === '#BFBFBF' ? 'bg-zinc-100 text-black border-white hover:bg-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                        onClick={() => setFormData({...formData, engraving_color: '#BFBFBF', engraving_blend_mode: 'normal'})}
                      >
                        <div className="w-3 h-3 rounded-full bg-[#BFBFBF] border border-zinc-400 mr-2" />
                        Cinza
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] text-zinc-400 uppercase tracking-widest">Opacidade ({Math.round((formData.engraving_opacity ?? 1) * 100)}%)</Label>
                      <div className="flex gap-1">
                        {[0.6, 0.8, 1.0].map((val) => (
                          <Button
                            key={val}
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-[9px] ${formData.engraving_opacity === val ? 'bg-amber-500/20 text-amber-500 font-bold' : 'text-zinc-500'}`}
                            onClick={() => setFormData({...formData, engraving_opacity: val})}
                          >
                            {val * 100}%
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Slider 
                      value={[(formData.engraving_opacity ?? 1.0) * 100]} 
                      min={60} 
                      max={100} 
                      step={20} 
                      onValueChange={(vals) => setFormData({ ...formData, engraving_opacity: vals[0] / 100 })}
                      className="py-1"
                    />
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
