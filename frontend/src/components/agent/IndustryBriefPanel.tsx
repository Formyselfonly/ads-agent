import { useEffect, useState } from "react";
import { useAI } from "@/hooks/useAI";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function IndustryBriefPanel() {
  const { fetchDailyBrief } = useAI();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchDailyBrief()
      .then(setBriefs)
      .catch(e => toast({ title: e.message || "获取行业快讯失败" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>行业快讯 / AI摘要</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>加载中...</div>
        ) : briefs.length === 0 ? (
          <div className="text-muted-foreground">暂无快讯</div>
        ) : (
          <ul className="space-y-4">
            {briefs.map(brief => (
              <li key={brief.id} className="border rounded p-3">
                <div className="font-medium mb-1">{brief.content}</div>
                <div className="text-xs text-muted-foreground mb-1">日期: {brief.date?.replace("T", " ").slice(0, 19)}</div>
                {brief.raw_data && (
                  <details className="text-xs text-muted-foreground">
                    <summary>原始数据</summary>
                    <pre className="whitespace-pre-wrap break-all">{brief.raw_data}</pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 