import { useEffect, useState } from "react";
import { useAI } from "@/hooks/useAI";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function AIAdvicePanel({ campaignId }: { campaignId?: number }) {
  const { fetchAdvices, createAdvice, approveAdvice, executeAdvice } = useAI();
  const [advices, setAdvices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newContent, setNewContent] = useState("");
  const { toast } = useToast();

  const reload = () => {
    setLoading(true);
    fetchAdvices(campaignId)
      .then(setAdvices)
      .catch(e => toast({ title: e.message || "获取AI建议失败" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [campaignId]);

  const handleCreate = async () => {
    if (!newContent.trim()) {
      toast({ title: "建议内容不能为空" });
      return;
    }
    setCreating(true);
    try {
      await createAdvice({ campaign_id: campaignId, type: "custom", content: newContent });
      setNewContent("");
      toast({ title: "AI建议已生成" });
      reload();
    } catch (e: any) {
      toast({ title: e.message || "生成AI建议失败" });
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    try {
      await approveAdvice(id, approve);
      toast({ title: approve ? "已审批通过" : "已拒绝" });
      reload();
    } catch (e: any) {
      toast({ title: e.message || "审批失败" });
    }
  };

  const handleExecute = async (id: number) => {
    try {
      await executeAdvice(id);
      toast({ title: "AI建议已执行" });
      reload();
    } catch (e: any) {
      toast({ title: e.message || "执行失败" });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>AI建议</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="输入建议内容（如：建议加投、暂停等）"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            disabled={creating}
          />
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "生成中..." : "生成AI建议"}
          </Button>
        </div>
        {loading ? (
          <div>加载中...</div>
        ) : advices.length === 0 ? (
          <div className="text-muted-foreground">暂无AI建议</div>
        ) : (
          <ul className="space-y-3">
            {advices.map(advice => (
              <li key={advice.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium mb-1">{advice.content}</div>
                  <div className="text-xs text-muted-foreground mb-1">类型: {advice.type} | 状态: {advice.status}</div>
                  <div className="text-xs text-muted-foreground">创建时间: {advice.created_at?.replace("T", " ").slice(0, 19)}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  {advice.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(advice.id, true)}>审批通过</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApprove(advice.id, false)}>拒绝</Button>
                    </>
                  )}
                  {advice.status === "approved" && (
                    <Button size="sm" onClick={() => handleExecute(advice.id)}>自动执行</Button>
                  )}
                  {advice.status === "executed" && (
                    <span className="text-success text-xs">已执行</span>
                  )}
                  {advice.status === "rejected" && (
                    <span className="text-destructive text-xs">已拒绝</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 