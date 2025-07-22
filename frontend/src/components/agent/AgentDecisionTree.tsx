import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

export function AgentDecisionTree({ campaignId }: { campaignId: number }) {
  const [decisionFlow, setDecisionFlow] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const { toast } = useToast();

  const fetchDecisionFlow = () => {
    setLoading(true);
    fetch(`/api/campaigns/${campaignId}/decisions`)
      .then(res => {
        if (!res.ok) throw new Error("获取决策链路失败");
        return res.json();
      })
      .then(data => {
        setDecisionFlow(data.decisionFlow || []);
        setError(null);
      })
      .catch(err => {
        setError(err.message || "未知错误");
        setDecisionFlow([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchDecisionFlow();
  }, [campaignId]);

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/agent/optimize`, { method: "POST" });
      if (!res.ok) throw new Error("AI优化失败");
      const data = await res.json();
      toast({ title: "AI优化完成", description: data.result?.result || data.message });
      fetchDecisionFlow();
    } catch (err: any) {
      toast({ title: err.message || "AI优化失败" });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">AI Agent 决策链路</h2>
        <Button onClick={handleOptimize} disabled={optimizing} className="bg-gradient-primary text-white">
          {optimizing ? "优化中..." : "触发AI优化"}
        </Button>
      </div>
      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {decisionFlow.map((step, idx) => (
            <Card key={step.id || idx} className="border-0 bg-surface">
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={step.status === "completed" ? "default" : step.status === "error" ? "destructive" : "secondary"}>
                    {step.status === "completed" ? "已完成" : step.status === "error" ? "错误" : "进行中"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{step.timestamp}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 font-medium">{step.description}</div>
                {step.input && Object.keys(step.input).length > 0 && (
                  <div className="text-sm text-muted-foreground mb-1">输入: {JSON.stringify(step.input)}</div>
                )}
                {step.output && Object.keys(step.output).length > 0 && (
                  <div className="text-sm text-muted-foreground">输出: {JSON.stringify(step.output)}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}