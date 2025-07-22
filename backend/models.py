from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from pydantic import validator, model_validator

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

class AdCampaignUpdate(SQLModel):
    name: Optional[str] = None
    product: Optional[str] = None
    objective: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = None

    @model_validator(mode='after')
    def check_fields(self):
        if self.budget is not None and self.budget < 0:
            raise ValueError('预算必须为正数')
        return self

class AdCampaignCreate(SQLModel):
    name: str
    product: str
    objective: str
    budget: float

    @validator('name', 'product', 'objective')
    def not_empty(cls, v):
        if not v or not str(v).strip():
            raise ValueError('字段不能为空')
        return v

    @validator('budget')
    def budget_positive(cls, v):
        if v < 0:
            raise ValueError('预算必须为正数')
        return v 

class AIAdvice(SQLModel, table=True):
    """AI建议表"""
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: Optional[int] = Field(default=None, foreign_key="adcampaign.id", description="关联广告活动")
    type: str = Field(description="建议类型，如加投/暂停/行业速读等")
    content: str = Field(description="建议内容")
    status: str = Field(default="pending", description="pending/approved/executed/rejected")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    executed_at: Optional[datetime] = None
    approved_by: Optional[str] = None

class AIExecution(SQLModel, table=True):
    """AI建议执行记录表"""
    id: Optional[int] = Field(default=None, primary_key=True)
    advice_id: int = Field(foreign_key="aiadvice.id", description="关联AI建议")
    result: str = Field(description="执行结果/日志")
    executed_at: datetime = Field(default_factory=datetime.utcnow)

class IndustryBrief(SQLModel, table=True):
    """行业快讯/AI摘要表"""
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime = Field(default_factory=datetime.utcnow, description="快讯日期")
    content: str = Field(description="AI生成的行业摘要")
    raw_data: Optional[str] = Field(default=None, description="原始爬取数据(JSON)") 