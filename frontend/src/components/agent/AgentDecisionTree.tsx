import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  RefreshCw,
  BarChart3
} from "lucide-react";

export function AgentDecisionTree() {
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);

  const decisionFlow = [
    {
      id: 1,
      type: "analysis",
      title: "数据分析",
      description: "分析广告活动表现数据",
      status: "completed",
      timestamp: "2024-03-22 14:30:15",
      input: {
        campaign: "春季新品推广",
        metrics: {
          ctr: "3.2%",
          conversions: 3312,
          cost_per_conversion: "¥18.8"
        }
      },
      output: {
        insight: "CTR表现优异，转化成本合理",
        confidence: 0.92
      }
    },
    {
      id: 2,
      type: "decision",
      title: "决策判断",
      description: "基于数据分析结果制定优化策略",
      status: "completed",
      timestamp: "2024-03-22 14:30:45",
      input: {
        performance_score: 0.85,
        budget_utilization: 0.78,
        market_trends: "positive"
      },
      output: {
        decision: "增加预算投入",
        reasoning: "活动表现优异，建议扩大投放规模",
        action_items: ["增加30%预算", "扩展关键词", "测试新创意"]
      }
    },
    {
      id: 3,
      type: "execution",
      title: "执行优化",
      description: "实施AI建议的优化措施",
      status: "in_progress",
      timestamp: "2024-03-22 14:31:00",
      input: {
        budget_increase: "30%",
        new_keywords: ["春季新品", "时尚潮流", "优质好物"],
        creative_variants: 3
      },
      output: {
        status: "执行中",
        estimated_completion: "2024-03-22 15:00:00"
      }
    },
    {
      id: 4,
      type: "monitoring",
      title: "效果监控",
      description: "监控优化后的广告效果",
      status: "pending",
      timestamp: "预计 2024-03-22 15:00:00",
      input: {},
      output: {}
    }
  ];

  const agentLogs = [
    {
      timestamp: "14:30:15",
      level: "info",
      component: "DataAnalyzer",
      message: "开始分析活动 '春季新品推广' 的表现数据",
      data: { campaign_id: "camp_001", metrics_count: 12 }
    },
    {
      timestamp: "14:30:18",
      level: "success",
      component: "DataAnalyzer", 
      message: "数据分析完成，发现CTR表现优异(3.2%)",
      data: { ctr: 0.032, benchmark: 0.024 }
    },
    {
      timestamp: "14:30:45",
      level: "info",
      component: "DecisionEngine",
      message: "基于分析结果，决定增加预算投入",
      data: { confidence: 0.92, action: "budget_increase" }
    },
    {
      timestamp: "14:31:00",
      level: "warning",
      component: "Optimizer",
      message: "开始执行预算调整，请注意监控花费",
      data: { budget_change: "+30%", estimated_impact: "+25% reach" }
    },
    {
      timestamp: "14:31:02",
      level: "info",
      component: "Optimizer",
      message: "添加新关键词: 春季新品, 时尚潮流, 优质好物",
      data: { new_keywords: 3, total_keywords: 48 }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-primary animate-spin" />;
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center space-x-3">
            <Brain className="w-7 h-7 text-primary animate-glow-pulse" />
            <span>AI 决策链路</span>
          </h1>
          <p className="text-muted-foreground">可视化展示AI Agent的决策过程和执行日志</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            实时运行中
          </Badge>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      <Tabs defaultValue="flow" className="space-y-6">
        <TabsList className="bg-surface">
          <TabsTrigger value="flow" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>决策流程</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>实时日志</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-6">
          {/* Decision Flow */}
          <Card className="border-0 bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>智能决策流程</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decisionFlow.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connection Line */}
                    {index < decisionFlow.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                    )}
                    
                    <div 
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        selectedDecision === step.id 
                          ? 'border-primary bg-primary/5 shadow-medium' 
                          : 'border-border bg-background/50 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDecision(selectedDecision === step.id ? null : step.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                            {getStatusIcon(step.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">{step.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={step.status === 'completed' ? 'default' : 
                                        step.status === 'in_progress' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {step.status === 'completed' ? '已完成' :
                                 step.status === 'in_progress' ? '进行中' : '等待中'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{step.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                          
                          {selectedDecision === step.id && (
                            <div className="space-y-3 animate-fade-in">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-muted rounded-lg">
                                  <h4 className="font-medium text-sm mb-2 text-foreground">输入数据</h4>
                                  <pre className="text-xs text-muted-foreground overflow-auto">
                                    {JSON.stringify(step.input, null, 2)}
                                  </pre>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                  <h4 className="font-medium text-sm mb-2 text-foreground">输出结果</h4>
                                  <pre className="text-xs text-muted-foreground overflow-auto">
                                    {JSON.stringify(step.output, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Real-time Logs */}
          <Card className="border-0 bg-surface">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary animate-glow-pulse" />
                  <span>实时执行日志</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/90 rounded-xl p-4 font-mono text-sm max-h-96 overflow-auto">
                {agentLogs.map((log, index) => (
                  <div key={index} className="mb-2 flex">
                    <span className="text-muted-foreground mr-2">[{log.timestamp}]</span>
                    <span className={`mr-2 font-medium ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-accent mr-2">{log.component}:</span>
                    <span className="text-foreground">{log.message}</span>
                  </div>
                ))}
                <div className="flex items-center text-primary">
                  <span className="mr-2 animate-pulse">▋</span>
                  <span>等待新的日志输入...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 bg-surface">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">决策准确率</p>
                    <p className="text-xl font-bold text-foreground">92.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Zap className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">响应时间</p>
                    <p className="text-xl font-bold text-foreground">1.2s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">优化提升</p>
                    <p className="text-xl font-bold text-foreground">+18.6%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}