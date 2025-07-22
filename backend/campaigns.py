from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import select
from models import AdCampaign, AdCampaignCreate, AdCampaignUpdate
from db import get_session
from typing import List
from sqlmodel import Session
from pydantic import BaseModel
import logging

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

logger = logging.getLogger("campaigns")

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[AdCampaign])
def list_campaigns(
    session: Session = Depends(get_session),
    limit: int = Query(20, ge=1, le=100, description="每页数量"),
    offset: int = Query(0, ge=0, description="偏移量")
):
    try:
        campaigns = session.exec(
            select(AdCampaign).order_by(AdCampaign.created_at.desc()).offset(offset).limit(limit)
        ).all()
        return campaigns
    except Exception as e:
        logger.exception("获取广告活动列表失败")
        raise HTTPException(status_code=500, detail="服务器内部错误")

@router.get("/{campaign_id}", response_model=AdCampaign)
def get_campaign(campaign_id: int, session: Session = Depends(get_session)):
    try:
        campaign = session.get(AdCampaign, campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("获取广告活动详情失败")
        raise HTTPException(status_code=500, detail="服务器内部错误")

@router.post("/", response_model=AdCampaign)
def create_campaign(campaign: AdCampaignCreate, session: Session = Depends(get_session)):
    try:
        db_campaign = AdCampaign.from_orm(campaign)
        session.add(db_campaign)
        session.commit()
        session.refresh(db_campaign)
        return db_campaign
    except Exception as e:
        logger.exception("创建广告活动失败")
        raise HTTPException(status_code=500, detail="服务器内部错误")

@router.put("/{campaign_id}", response_model=AdCampaign)
def update_campaign(campaign_id: int, campaign_update: AdCampaignUpdate, session: Session = Depends(get_session)):
    try:
        campaign = session.get(AdCampaign, campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        update_data = campaign_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(campaign, key, value)
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("更新广告活动失败")
        raise HTTPException(status_code=500, detail="服务器内部错误")

@router.post("/{campaign_id}/status", response_model=AdCampaign)
def change_campaign_status(campaign_id: int, status_update: StatusUpdate, session: Session = Depends(get_session)):
    try:
        campaign = session.get(AdCampaign, campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        campaign.status = status_update.status
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("变更广告活动状态失败")
        raise HTTPException(status_code=500, detail="服务器内部错误") 