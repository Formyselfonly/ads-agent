import { useCallback } from "react";

const API_BASE = "/api/campaigns";

export function useCampaigns() {
  // 获取活动列表
  const fetchCampaigns = useCallback(async () => {
    const res = await fetch(`${API_BASE}/`);
    if (!res.ok) throw new Error("获取活动列表失败");
    return await res.json();
  }, []);

  // 创建活动
  const createCampaign = useCallback(async (data: { name: string; product: string; objective: string; budget: number; }) => {
    const res = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("创建活动失败");
    return await res.json();
  }, []);

  // 编辑活动
  const updateCampaign = useCallback(async (id: number, data: Partial<{ name: string; product: string; objective: string; budget: number; status: string; }>) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("编辑活动失败");
    return await res.json();
  }, []);

  return { fetchCampaigns, createCampaign, updateCampaign };
} 