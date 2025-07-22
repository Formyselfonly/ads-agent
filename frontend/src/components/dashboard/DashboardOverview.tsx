import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  DollarSign,
  Brain,
  BarChart3,
  Plus,
  ArrowUpRight,
  Activity
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

export function DashboardOverview() {
  const stats = [
    {
      title: "活跃广告活动",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "今日投放预算",
      value: "¥24,680",
      change: "+12.5%",
      trend: "up", 
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "点击率(CTR)",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      icon: Target,
      color: "text-warning"
    },
    {
      title: "转化率",
      value: "8.6%",
      change: "+1.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-secondary"
    }
  ];

  const recentCampaigns = [
    {
      name: "春季新品推广",
      status: "运行中",
      budget: "¥8,000",
      performance: 85,
      ai_optimized: true
    },
    {
      name: "品牌知名度提升",
      status: "优化中",
      budget: "¥12,000",
      performance: 72,
      ai_optimized: true
    },
    {
      name: "用户留存促活",
      status: "暂停",
      budget: "¥5,000",
      performance: 58,
      ai_optimized: false
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">智能广告助手</h1>
              <p className="text-lg text-blue-100 mb-4">
                AI驱动的广告投放与优化平台
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                创建新活动
              </Button>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 animate-glow-pulse" />
                <span className="text-sm text-blue-100">AI 状态</span>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/20">
                优化运行中
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-medium transition-all duration-300 border-0 bg-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-success mr-1" />
                    <span className="text-sm text-success font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-accent`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2 border-0 bg-surface">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>近期广告活动</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                查看全部
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div key={index} className="p-4 rounded-xl border border-border bg-background/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-foreground">{campaign.name}</h3>
                    <Badge 
                      variant={campaign.status === "运行中" ? "default" : 
                              campaign.status === "优化中" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {campaign.status}
                    </Badge>
                    {campaign.ai_optimized && (
                      <Badge variant="outline" className="text-xs border-primary text-primary">
                        <Brain className="w-3 h-3 mr-1" />
                        AI优化
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {campaign.budget}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">表现评分</span>
                    <span className="font-medium">{campaign.performance}%</span>
                  </div>
                  <Progress 
                    value={campaign.performance} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-0 bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary animate-glow-pulse" />
              <span>AI 智能洞察</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-accent border border-primary/20">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    建议提高移动端出价
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    检测到移动端转化率比桌面端高15%，建议调整出价策略。
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    应用建议
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-accent border border-warning/20">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2 animate-pulse"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    预算分配优化
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    "春季新品推广"活动表现优异，建议增加30%预算。
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    查看详情
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-accent border border-success/20">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2 animate-pulse"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    创意素材更新
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    AI生成了3个新的广告创意，预计可提升CTR 0.6%。
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    预览创意
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}