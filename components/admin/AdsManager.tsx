// components/admin/AdsManager.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Upload, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { IAd } from '@/models/Ads';
import Image from 'next/image';

interface AdsManagerProps {
  initialAds: IAd[];
}

export default function AdsManager({ initialAds }: AdsManagerProps) {
  const [ads, setAds] = useState<IAd[]>(initialAds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<IAd | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    linkUrl: '',
    linkType: 'product' as 'product' | 'category' | 'external',
    linkId: '',
    adType: 'banner' as 'banner' | 'sidebar' | 'popup' | 'inline',
    placement: 'homepage' as 'homepage' | 'products' | 'product-detail' | 'cart' | 'all',
    isSponsored: false,
    priority: 0,
    startDate: '',
    endDate: '',
    sponsorInfo: {
      name: '',
      contact: '',
      amount: 0,
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      linkUrl: '',
      linkType: 'product',
      linkId: '',
      adType: 'banner',
      placement: 'homepage',
      isSponsored: false,
      priority: 0,
      startDate: '',
      endDate: '',
      sponsorInfo: {
        name: '',
        contact: '',
        amount: 0,
      },
    });
    setEditingAd(null);
  };

  const openEditDialog = (ad: IAd) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image: ad.image,
      linkUrl: ad.linkUrl,
      linkType: ad.linkType,
      linkId: ad.linkId || '',
      adType: ad.adType,
      placement: ad.placement,
      isSponsored: ad.isSponsored,
      priority: ad.priority,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
      sponsorInfo: ad.sponsorInfo || {
        name: '',
        contact: '',
        amount: 0,
      },
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'ad');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title || !formData.image || !formData.linkUrl) {
        toast.error('Title, image, and link URL are required');
        return;
      }

      const payload = {
        ...formData,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        sponsorInfo: formData.isSponsored ? formData.sponsorInfo : undefined,
      };

      const url = editingAd ? `/api/ads/${editingAd._id}` : '/api/ads';
      const method = editingAd ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save ad');
      }

      toast.success(editingAd ? 'Ad updated successfully' : 'Ad created successfully');
      fetchAds();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save ad');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data.ads);
    } catch (error) {
      toast.error('Failed to fetch ads');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete ad');
      }

      toast.success('Ad deleted successfully');
      fetchAds();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete ad');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ad');
      }

      toast.success('Ad updated');
      fetchAds();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const calculateMetrics = () => {
    const totalAds = ads.length;
    const activeAds = ads.filter(ad => ad.isActive).length;
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const sponsoredAds = ads.filter(ad => ad.isSponsored).length;
    const totalRevenue = ads
      .filter(ad => ad.isSponsored && ad.sponsorInfo)
      .reduce((sum, ad) => sum + (ad.sponsorInfo?.amount || 0), 0);

    return {
      totalAds,
      activeAds,
      totalClicks,
      totalImpressions,
      ctr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0',
      sponsoredAds,
      totalRevenue,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAds}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.activeAds} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Impressions
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalClicks} clicks ({metrics.ctr}% CTR)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Sponsored
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sponsoredAds}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Revenue
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From sponsored ads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ads Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Advertisements</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-zinc-500 hover:bg-zinc-500/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
                  </DialogTitle>
                  <DialogDescription>
                    Create an ad to promote products or display sponsored content
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ad Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Summer Sale - Up to 50% Off"
                      required
                    />
                  </div>
<div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional ad description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Ad Image *</Label>
                {formData.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Ad preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adType">Ad Type *</Label>
                  <Select
                    value={formData.adType}
                    onValueChange={(value: any) => setFormData({ ...formData, adType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner (Full Width)</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="inline">Inline (In Content)</SelectItem>
                      <SelectItem value="popup">Popup/Modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placement">Placement *</Label>
                  <Select
                    value={formData.placement}
                    onValueChange={(value: any) => setFormData({ ...formData, placement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">Homepage Only</SelectItem>
                      <SelectItem value="products">Products Page</SelectItem>
                      <SelectItem value="product-detail">Product Detail</SelectItem>
                      <SelectItem value="cart">Cart Page</SelectItem>
                      <SelectItem value="all">All Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkType">Link Type *</Label>
                  <Select
                    value={formData.linkType}
                    onValueChange={(value: any) => setFormData({ ...formData, linkType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="external">External URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkUrl">Link URL *</Label>
                  <Input
                    id="linkUrl"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/products/123 or https://..."
                    required
                  />
                </div>
              </div>

              {formData.linkType !== 'external' && (
                <div className="space-y-2">
                  <Label htmlFor="linkId">
                    {formData.linkType === 'product' ? 'Product ID' : 'Category Key'}
                  </Label>
                  <Input
                    id="linkId"
                    value={formData.linkId}
                    onChange={(e) => setFormData({ ...formData, linkId: e.target.value })}
                    placeholder={formData.linkType === 'product' ? 'Product ID' : 'Category key'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (Higher = Shown First)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isSponsored"
                  checked={formData.isSponsored}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSponsored: checked })}
                />
                <Label htmlFor="isSponsored" className="cursor-pointer">
                  This is a sponsored ad
                </Label>
              </div>

              {formData.isSponsored && (
                <Card className="p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Sponsor Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorName">Sponsor Name</Label>
                      <Input
                        id="sponsorName"
                        value={formData.sponsorInfo.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sponsorInfo: { ...formData.sponsorInfo, name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorContact">Contact</Label>
                      <Input
                        id="sponsorContact"
                        value={formData.sponsorInfo.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sponsorInfo: { ...formData.sponsorInfo, contact: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorAmount">Amount (GHS)</Label>
                    <Input
                      id="sponsorAmount"
                      type="number"
                      value={formData.sponsorInfo.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sponsorInfo: { ...formData.sponsorInfo, amount: parseFloat(e.target.value) },
                        })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                </Card>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || uploadingImage}
                  className="bg-zinc-500 hover:bg-zinc-500/90"
                >
                  {isLoading ? 'Saving...' : editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Placement</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => (
            <TableRow key={ad._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{ad.title}</p>
                    {ad.isSponsored && (
                      <Badge variant="secondary" className="mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ad.adType}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ad.placement}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{ad.impressions.toLocaleString()} views</p>
                  <p className="text-muted-foreground">
                    {ad.clicks} clicks (
                    {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0'}
                    % CTR)
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(ad._id, ad.isActive)}
                >
                  <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(ad)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ad._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>
);
}