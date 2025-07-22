from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from models import AdCampaign, AgentLog
from db import get_session
from sqlmodel import Session
from typing import List, Any
from datetime import datetime
from agent_core import ads_agent
import json
import os
import requests
from dotenv import load_dotenv

router = APIRouter(prefix="/api/campaigns", tags=["Agent"])

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")  # 可选，若有新闻API

# 获取决策链路（从数据库查询真实数据）
@router.get("/{campaign_id}/decisions")
def get_decision_chain(campaign_id: int, session: Session = Depends(get_session)) -> Any:
    # 从AgentLog表查询决策链路
    logs = session.exec(
        select(AgentLog)
        .where(AgentLog.campaign_id == campaign_id)
        .order_by(AgentLog.created_at.asc())
    ).all()
    
    # 构建决策链路
    decision_flow = []
    for i, log in enumerate(logs):
        decision_flow.append({
            "id": i + 1,
            "type": log.step,
            "title": log.step.title(),
            "description": log.message,
            "status": "completed" if log.step != "error" else "error",
            "timestamp": log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "input": json.loads(log.data) if log.data else {},
            "output": {"message": log.message}
        })
    
    # 如果没有日志，返回mock数据
    if not decision_flow:
        decision_flow = [
            {
                "id": 1,
                "type": "analysis",
                "title": "数据分析",
                "description": "分析广告活动表现数据",
                "status": "completed",
                "timestamp": "2024-03-22 14:30:15",
                "input": {"campaign": "春季新品推广", "metrics": {"ctr": "3.2%", "conversions": 3312, "cost_per_conversion": "¥18.8"}},
                "output": {"insight": "CTR表现优异，转化成本合理", "confidence": 0.92}
            },
            {
                "id": 2,
                "type": "decision",
                "title": "决策判断",
                "description": "基于分析结果制定优化策略",
                "status": "completed",
                "timestamp": "2024-03-22 14:30:45",
                "input": {"performance_score": 0.85, "budget_utilization": 0.78, "market_trends": "positive"},
                "output": {"decision": "增加预算投入", "reasoning": "活动表现优异，建议扩大投放规模", "action_items": ["增加30%预算", "扩展关键词", "测试新创意"]}
            },
            {
                "id": 3,
                "type": "execution",
                "title": "执行优化",
                "description": "实施AI建议的优化措施",
                "status": "in_progress",
                "timestamp": "2024-03-22 14:31:00",
                "input": {"budget_increase": "30%", "new_keywords": ["春季新品", "时尚潮流", "优质好物"], "creative_variants": 3},
                "output": {"status": "执行中", "estimated_completion": "2024-03-22 15:00:00"}
            },
            {
                "id": 4,
                "type": "monitoring",
                "title": "效果监控",
                "description": "监控优化后的广告效果",
                "status": "pending",
                "timestamp": "预计 2024-03-22 15:00:00",
                "input": {},
                "output": {}
            }
        ]
    
    return {"decisionFlow": decision_flow}

# 获取Agent日志（从数据库查询真实数据）
@router.get("/{campaign_id}/logs")
def get_agent_logs(campaign_id: int, session: Session = Depends(get_session)) -> Any:
    # 从AgentLog表查询日志
    logs = session.exec(
        select(AgentLog)
        .where(AgentLog.campaign_id == campaign_id)
        .order_by(AgentLog.created_at.desc())
    ).all()
    
    # 构建日志数据
    agent_logs = []
    for log in logs:
        agent_logs.append({
            "timestamp": log.created_at.strftime("%H:%M:%S"),
            "level": "info" if log.step != "error" else "error",
            "component": log.step.title(),
            "message": log.message,
            "data": json.loads(log.data) if log.data else {}
        })
    
    # 如果没有日志，返回mock数据
    if not agent_logs:
        agent_logs = [
            {"timestamp": "14:30:15", "level": "info", "component": "DataAnalyzer", "message": "开始分析活动 '春季新品推广' 的表现数据", "data": {"campaign_id": "camp_001", "metrics_count": 12}},
            {"timestamp": "14:30:18", "level": "info", "component": "DataAnalyzer", "message": "CTR: 3.2%, 转化: 3312, 成本: ¥18.8", "data": {}},
            {"timestamp": "14:30:45", "level": "info", "component": "DecisionMaker", "message": "决策: 增加预算投入，理由: 活动表现优异，建议扩大投放规模", "data": {}},
            {"timestamp": "14:31:00", "level": "info", "component": "Executor", "message": "执行优化: 增加30%预算，扩展关键词，测试新创意", "data": {}},
            {"timestamp": "14:31:05", "level": "info", "component": "Monitor", "message": "开始监控优化后的广告效果", "data": {}}
        ]
    
    return {"agentLogs": agent_logs}

# 触发Agent优化（集成真实Agent逻辑）
@router.post("/{campaign_id}/agent/optimize")
def trigger_agent_optimize(campaign_id: int, session: Session = Depends(get_session)):
    campaign = session.get(AdCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    try:
        # 调用真实Agent进行优化
        result = ads_agent.optimize_campaign(campaign_id, session)
        return {
            "message": f"Agent optimization completed for campaign {campaign_id}",
            "status": "completed",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent optimization failed: {str(e)}") 

@router.post("/{campaign_id}/agent/analyze")
def analyze_campaign(campaign_id: int, session: Session = Depends(get_session)):
    campaign = session.get(AdCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    # 1. 抓取行业新闻（可扩展为微博、知乎等）
    info_list = []
    try:
        # 示例：用NewsAPI抓取“广告投放”相关新闻
        if NEWS_API_KEY:
            url = f"https://newsapi.org/v2/everything?q=广告投放&language=zh&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            articles = resp.json().get("articles", [])[:5]
            for art in articles:
                info_list.append({
                    "title": art.get("title", ""),
                    "summary": art.get("description", "") or art.get("content", "") or ""
                })
        else:
            # 没有API Key时，抓取百度新闻（简单爬虫，仅示例）
            r = requests.get("https://news.baidu.com/widget?id=adnews&ajax=json", timeout=10)
            if r.ok:
                data = r.json()
                for item in data.get("data", {}).get("adnews", {}).get("items", [])[:5]:
                    info_list.append({
                        "title": item.get("title", ""),
                        "summary": item.get("abs", "")
                    })
    except Exception as e:
        info_list.append({"title": "信息抓取失败", "summary": str(e)})
    if not info_list:
        info_list = [{"title": "暂无最新行业信息", "summary": ""}]
    # 2. 用AI分析
    try:
        suggestion = ads_agent.analyze_campaign(campaign, info_list)
    except Exception as e:
        suggestion = f"AI分析失败: {e}"
    return {"info": info_list, "suggestion": suggestion} 