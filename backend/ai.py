from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from models import AIAdvice, AIExecution, IndustryBrief, AdCampaign
from db import get_session
from sqlmodel import Session
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["AI"])

# 生成AI建议（可批量/全局）
@router.post("/advise", response_model=AIAdvice)
def create_ai_advice(
    campaign_id: Optional[int] = None,
    type: str = "general",
    content: str = "",
    session: Session = Depends(get_session)
):
    if not content:
        raise HTTPException(status_code=400, detail="建议内容不能为空")
    advice = AIAdvice(
        campaign_id=campaign_id,
        type=type,
        content=content,
        status="pending",
        created_at=datetime.utcnow()
    )
    session.add(advice)
    session.commit()
    session.refresh(advice)
    return advice

# 查询AI建议列表
@router.get("/advices", response_model=List[AIAdvice])
def list_ai_advices(
    campaign_id: Optional[int] = None,
    status: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(AIAdvice)
    if campaign_id:
        query = query.where(AIAdvice.campaign_id == campaign_id)
    if status:
        query = query.where(AIAdvice.status == status)
    advices = session.exec(query.order_by(AIAdvice.created_at.desc())).all()
    return advices

# 审批AI建议
@router.post("/approve/{advice_id}", response_model=AIAdvice)
def approve_ai_advice(
    advice_id: int,
    approve: bool,
    approved_by: Optional[str] = None,
    session: Session = Depends(get_session)
):
    advice = session.get(AIAdvice, advice_id)
    if not advice:
        raise HTTPException(status_code=404, detail="AI建议不存在")
    advice.status = "approved" if approve else "rejected"
    advice.approved_by = approved_by
    session.add(advice)
    session.commit()
    session.refresh(advice)
    return advice

# 执行AI建议
@router.post("/execute/{advice_id}", response_model=AIExecution)
def execute_ai_advice(
    advice_id: int,
    result: str = "",
    session: Session = Depends(get_session)
):
    advice = session.get(AIAdvice, advice_id)
    if not advice:
        raise HTTPException(status_code=404, detail="AI建议不存在")
    advice.status = "executed"
    advice.executed_at = datetime.utcnow()
    session.add(advice)
    execution = AIExecution(
        advice_id=advice_id,
        result=result or f"AI建议已执行: {advice.content}",
        executed_at=datetime.utcnow()
    )
    session.add(execution)
    session.commit()
    session.refresh(execution)
    return execution

# 查询行业快讯
@router.get("/daily-brief", response_model=List[IndustryBrief])
def get_daily_brief(
    limit: int = 7,
    session: Session = Depends(get_session)
):
    briefs = session.exec(select(IndustryBrief).order_by(IndustryBrief.date.desc()).limit(limit)).all()
    return briefs

# 新增行业快讯
@router.post("/daily-brief", response_model=IndustryBrief)
def create_daily_brief(
    content: str,
    raw_data: Optional[str] = None,
    session: Session = Depends(get_session)
):
    brief = IndustryBrief(
        content=content,
        raw_data=raw_data,
        date=datetime.utcnow()
    )
    session.add(brief)
    session.commit()
    session.refresh(brief)
    return brief 