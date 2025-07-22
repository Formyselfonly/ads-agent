from fastapi import APIRouter, Depends
from sqlmodel import select
from models import AdCampaign
from db import get_session
from sqlmodel import Session
from typing import Any

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/overview")
def dashboard_overview(session: Session = Depends(get_session)) -> Any:
    # 统计数据（可根据实际业务调整）
    total_campaigns = session.exec(select(AdCampaign)).count()
    running_campaigns = session.exec(select(AdCampaign).where(AdCampaign.status == "running")).count()
    today_budget = session.exec(select(AdCampaign.budget)).all()
    today_budget_sum = sum(today_budget) if today_budget else 0
    # mock数据，后续可接入真实效果
    stats = [
        {"title": "活跃广告活动", "value": str(running_campaigns), "change": "+2", "trend": "up", "icon": "Zap", "color": "text-primary"},
        {"title": "今日投放预算", "value": f"¥{today_budget_sum}", "change": "+12.5%", "trend": "up", "icon": "DollarSign", "color": "text-success"},
        {"title": "点击率(CTR)", "value": "3.2%", "change": "+0.8%", "trend": "up", "icon": "Target", "color": "text-warning"},
        {"title": "转化率", "value": "8.6%", "change": "+1.2%", "trend": "up", "icon": "TrendingUp", "color": "text-secondary"}
    ]
    recent_campaigns = session.exec(select(AdCampaign).order_by(AdCampaign.created_at.desc()).limit(3)).all()
    recent_campaigns_data = [
        {"name": c.name, "status": c.status, "budget": f"¥{c.budget}", "performance": 80, "ai_optimized": True} for c in recent_campaigns
    ]
    return {"stats": stats, "recentCampaigns": recent_campaigns_data} 