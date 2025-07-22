import { useState } from "react";
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

export function CampaignList() {
  const [searchTerm, setSearchTerm] = useState("");

  const campaigns = [
    {
      id: 1,
      name: "春季新品推广",
      status: "running",
      budget: 8000,
      spent: 6240,
      impressions: "1.2M",
      clicks: 38400,
      ctr: "3.2%",
      conversions: 3312,
      conversionRate: "8.6%",
      ai_optimized: true,
      created_at: "2024-03-15"
    },
    {
      id: 2,
      name: "品牌知名度提升",
      status: "optimizing",
      budget: 12000,
      spent: 8640,
      impressions: "2.1M",
      clicks: 51240,
      ctr: "2.4%",
      conversions: 3686,
      conversionRate: "7.2%",
      ai_optimized: true,
      created_at: "2024-03-10"
    },
    {
      id: 3,
      name: "用户留存促活",
      status: "paused",
      budget: 5000,
      spent: 2900,
      impressions: "680K",
      clicks: 19040,
      ctr: "2.8%",
      conversions: 1104,
      conversionRate: "5.8%",
      ai_optimized: false,
      created_at: "2024-03-08"
    },
    {
      id: 4,
      name: "夏季促销预热",
      status: "draft",
      budget: 15000,
      spent: 0,
      impressions: "0",
      clicks: 0,
      ctr: "0%",
      conversions: 0,
      conversionRate: "0%",
      ai_optimized: true,
      created_at: "2024-03-20"
    }
  ];

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
        <Button className="bg-gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          创建新活动
        </Button>
      </div>

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>预算/花费</TableHead>
                <TableHead>曝光量</TableHead>
                <TableHead>点击率</TableHead>
                <TableHead>转化率</TableHead>
                <TableHead>AI优化</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.created_at}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(campaign.status)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">¥{campaign.spent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">/ ¥{campaign.budget.toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.impressions}</p>
                      <p className="text-sm text-muted-foreground">{campaign.clicks.toLocaleString()} 点击</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{campaign.ctr}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.conversionRate}</p>
                      <p className="text-sm text-muted-foreground">{campaign.conversions} 转化</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.ai_optimized ? (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Brain className="w-3 h-3 mr-1" />
                        已启用
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        未启用
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {campaign.status === 'running' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              暂停活动
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              启动活动
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Brain className="w-4 h-4 mr-2" />
                          AI优化设置
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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