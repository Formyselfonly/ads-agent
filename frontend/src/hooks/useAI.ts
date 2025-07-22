import { useCallback } from "react";

export function useAI() {
  // 获取AI建议列表
  const fetchAdvices = useCallback(async (campaign_id?: number, status?: string) => {
    let url = "/api/ai/advices";
    const params = [];
    if (campaign_id) params.push(`campaign_id=${campaign_id}`);
    if (status) params.push(`status=${status}`);
    if (params.length) url += `?${params.join("&")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("获取AI建议失败");
    return await res.json();
  }, []);

  // 生成AI建议（修复：参数通过JSON body传递，content不能为空）
  const createAdvice = useCallback(async (data: { campaign_id?: number; type: string; content: string }) => {
    if (!data.content || !data.content.trim()) {
      throw new Error("建议内容不能为空");
    }
    const res = await fetch("/api/ai/advise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "生成AI建议失败");
    }
    return await res.json();
  }, []);

  // 审批AI建议
  const approveAdvice = useCallback(async (advice_id: number, approve: boolean, approved_by?: string) => {
    const res = await fetch(`/api/ai/approve/${advice_id}?approve=${approve}&approved_by=${approved_by || ""}`, { method: "POST" });
    if (!res.ok) throw new Error("审批AI建议失败");
    return await res.json();
  }, []);

  // 执行AI建议
  const executeAdvice = useCallback(async (advice_id: number, result?: string) => {
    const res = await fetch(`/api/ai/execute/${advice_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result })
    });
    if (!res.ok) throw new Error("执行AI建议失败");
    return await res.json();
  }, []);

  // 获取行业快讯
  const fetchDailyBrief = useCallback(async (limit = 7) => {
    const res = await fetch(`/api/ai/daily-brief?limit=${limit}`);
    if (!res.ok) throw new Error("获取行业快讯失败");
    return await res.json();
  }, []);

  return { fetchAdvices, createAdvice, approveAdvice, executeAdvice, fetchDailyBrief };
} 