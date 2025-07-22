from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime

class AdCampaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    product: str
    objective: str
    budget: float
    status: str = "created"  # created, running, paused, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="adcampaign.id")
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0
    cost: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="adcampaign.id")
    step: str  # e.g. "create", "generate_ad", "optimize", "deploy"
    message: str
    data: Optional[str] = None  # 可存储JSON字符串
    created_at: datetime = Field(default_factory=datetime.utcnow) 