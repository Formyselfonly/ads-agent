import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Play,
  Pause,
  Brain,
  TrendingUp,
  Target,
  DollarSign,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCampaigns } from "@/hooks/useCampaigns";

function CreateCampaignDialog({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (v: boolean) => void, onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", product: "", objective: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createCampaign } = useCampaigns(); // 确保在这里获取createCampaign

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.product.trim() || !form.objective.trim() || !form.budget.trim()) {
      toast({ title: "所有字段不能为空" });
      return;
    }
    if (isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
      toast({ title: "预算必须为正数" });
      return;
    }
    setLoading(true);
    try {
      await createCampaign({
        name: form.name,
        product: form.product,
        objective: form.objective,
        budget: parseFloat(form.budget)
      });
      toast({ title: "创建成功" });
      onCreated();
      onOpenChange(false);
      setForm({ name: "", product: "", objective: "", budget: "" });
    } catch (err: any) {
      toast({ title: err.message || "创建失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新广告活动</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">活动名称</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="product">产品</Label>
            <Input id="product" name="product" value={form.product} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="objective">目标</Label>
            <Input id="objective" name="objective" value={form.objective} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="budget">预算</Label>
            <Input id="budget" name="budget" type="number" min="0" value={form.budget} onChange={handleChange} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "创建中..." : "创建"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditCampaignDialog({ open, onOpenChange, campaign, onUpdated }: { open: boolean, onOpenChange: (v: boolean) => void, campaign: any, onUpdated: () => void }) {
  const [form, setForm] = useState({ name: campaign?.name || "", product: campaign?.product || "", objective: campaign?.objective || "", budget: campaign?.budget?.toString() || "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateCampaign } = useCampaigns();

  useEffect(() => {
    setForm({
      name: campaign?.name || "",
      product: campaign?.product || "",
      objective: campaign?.objective || "",
      budget: campaign?.budget?.toString() || ""
    });
  }, [campaign]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.product.trim() || !form.objective.trim() || !form.budget.trim()) {
      toast({ title: "所有字段不能为空" });
      return;
    }
    if (isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
      toast({ title: "预算必须为正数" });
      return;
    }
    setLoading(true);
    try {
      await updateCampaign(campaign.id, {
        name: form.name,
        product: form.product,
        objective: form.objective,
        budget: parseFloat(form.budget)
      });
      toast({ title: "修改成功" });
      onUpdated();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: err.message || "修改失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑广告活动</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">活动名称</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="product">产品</Label>
            <Input id="product" name="product" value={form.product} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="objective">目标</Label>
            <Input id="objective" name="objective" value={form.objective} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="budget">预算</Label>
            <Input id="budget" name="budget" type="number" min="0" value={form.budget} onChange={handleChange} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "保存中..." : "保存"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CampaignList({ onSelectCampaign }: { onSelectCampaign?: (id: number) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { fetchCampaigns, createCampaign } = useCampaigns();
  const fetchCampaignsWithPage = (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    return fetch(`/api/campaigns/?limit=${pageSize}&offset=${offset}`)
      .then(res => {
        if (!res.ok) throw new Error("网络请求失败");
        return res.json();
      });
  };

  const reload = () => {
    setLoading(true);
    fetchCampaignsWithPage(page, pageSize)
      .then((data) => {
        setCampaigns(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "未知错误");
        setCampaigns([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-success/10 text-success border-success/20">运行中</Badge>;
      case "optimizing":
        return <Badge className="bg-primary/10 text-primary border-primary/20">优化中</Badge>;
      case "paused":
        return <Badge variant="outline">已暂停</Badge>;
      case "draft":
        return <Badge variant="secondary">草稿</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">广告活动管理</h1>
          <p className="text-muted-foreground">管理和优化您的广告投放活动</p>
        </div>
        <Button className="bg-gradient-primary text-white" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          创建新活动
        </Button>
      </div>
      <CreateCampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={reload} />
      <EditCampaignDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} campaign={editingCampaign} onUpdated={reload} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-surface">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总活动数</p>
                <p className="text-xl font-bold text-foreground">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Play className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">运行中</p>
                <p className="text-xl font-bold text-foreground">
                  {campaigns.filter(c => c.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总预算</p>
                <p className="text-xl font-bold text-foreground">
                  ¥{campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Brain className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI优化</p>
                <p className="text-xl font-bold text-foreground">
                  {campaigns.filter(c => c.ai_optimized).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-surface">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索广告活动..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Table */}
      <Card className="border-0 bg-surface">
        <CardHeader>
          <CardTitle>活动列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>加载中...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>活动名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>预算</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onSelectCampaign?.(campaign.id)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.created_at}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>¥{campaign.budget?.toLocaleString?.() ?? campaign.budget}</TableCell>
                      <TableCell>{campaign.created_at}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setEditingCampaign(campaign); setEditDialogOpen(true); }}>编辑</Button>
                        {/* 你可以在这里继续添加更多操作按钮 */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>上一页</Button>
                <span className="px-2 py-1 text-sm">第 {page} 页</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={campaigns.length < pageSize}>下一页</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}