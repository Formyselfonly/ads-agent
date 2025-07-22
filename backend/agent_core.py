import json
from datetime import datetime
from models import AgentLog
import os
import requests
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# 简化的Agent核心类（不依赖LangChain）
class AdsAgent:
    def __init__(self):
        pass
    
    def optimize_campaign(self, campaign_id: int, session) -> dict:
        """执行广告活动优化（简化版本）"""
        # 记录开始日志
        self._log_step(session, campaign_id, "start", "开始广告活动优化", {})
        
        try:
            # 模拟Agent优化流程
            # 1. 数据分析
            self._log_step(session, campaign_id, "analysis", "分析广告活动表现数据", {
                "ctr": "3.2%",
                "conversions": 3312,
                "cost_per_conversion": "¥18.8"
            })
            
            # 2. 决策制定
            self._log_step(session, campaign_id, "decision", "制定优化策略", {
                "action": "increase_budget",
                "budget_increase": "30%",
                "new_keywords": ["春季新品", "时尚潮流", "优质好物"],
                "reasoning": "CTR表现优异，建议扩大投放规模"
            })
            
            # 3. 执行优化
            self._log_step(session, campaign_id, "execution", "执行优化措施", {
                "status": "executed",
                "changes_applied": {
                    "budget_increase": "30%",
                    "new_keywords": ["春季新品", "时尚潮流", "优质好物"],
                    "creative_variants": 3
                }
            })
            
            # 4. 监控效果
            self._log_step(session, campaign_id, "monitoring", "开始监控优化效果", {})
            
            # 记录完成日志
            self._log_step(session, campaign_id, "complete", "广告活动优化完成", {
                "result": "优化成功，预计CTR提升15%"
            })
            
            return {
                "status": "completed",
                "result": "优化成功，预计CTR提升15%",
                "campaign_id": campaign_id
            }
        except Exception as e:
            # 记录错误日志
            self._log_step(session, campaign_id, "error", f"优化失败: {str(e)}", {})
            raise e
    
    def _log_step(self, session, campaign_id: int, step: str, message: str, data: dict):
        """记录Agent执行步骤"""
        log = AgentLog(
            campaign_id=campaign_id,
            step=step,
            message=message,
            data=json.dumps(data)
        )
        session.add(log)
        session.commit()

    def analyze_campaign(self, campaign, info_list: list) -> str:
        """用大模型分析信息和活动，生成广告投放建议"""
        prompt = self._build_prompt(campaign, info_list)
        # 优先用OpenAI
        if OPENAI_API_KEY:
            return self._call_openai(prompt)
        elif DEEPSEEK_API_KEY:
            return self._call_deepseek(prompt)
        else:
            return "未配置AI API KEY，无法生成建议。"

    def _build_prompt(self, campaign, info_list):
        info_text = "\n".join([f"- {item['title']}: {item['summary']}" for item in info_list])
        return f"你是一名广告投放专家。请根据以下最新行业信息和广告活动数据，给出详细的广告投放建议。\n\n【行业信息】\n{info_text}\n\n【广告活动】\n名称: {campaign.name}\n产品: {campaign.product}\n目标: {campaign.objective}\n预算: {campaign.budget}\n\n请用简洁明了的语言输出建议。"

    def _call_openai(self, prompt):
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 512
        }
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

    def _call_deepseek(self, prompt):
        url = "https://api.deepseek.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
        data = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 512
        }
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

# 全局Agent实例
ads_agent = AdsAgent() 