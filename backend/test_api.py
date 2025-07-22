#!/usr/bin/env python3
"""
API测试脚本 - 测试后端各个功能模块
"""

import json
from datetime import datetime
from sqlmodel import Session, select

# 导入我们的模块
from models import AdCampaign, AdResult, AgentLog
from db import get_session, init_db
from agent_core import ads_agent

def test_database():
    """测试数据库连接和表创建"""
    print("=== 测试数据库 ===")
    try:
        # 初始化数据库
        init_db()
        print("✅ 数据库初始化成功")
        
        # 测试会话
        session = get_session()
        print("✅ 数据库会话创建成功")
        
        # 测试查询
        campaigns = session.exec(select(AdCampaign)).all()
        print(f"✅ 数据库查询成功，当前有 {len(campaigns)} 个广告活动")
        
        session.close()
        return True
    except Exception as e:
        print(f"❌ 数据库测试失败: {e}")
        return False

def test_models():
    """测试数据模型"""
    print("\n=== 测试数据模型 ===")
    try:
        # 测试创建广告活动
        campaign = AdCampaign(
            name="测试广告活动",
            product="测试产品",
            objective="品牌推广",
            budget=10000.0,
            status="created"
        )
        print("✅ 广告活动模型创建成功")
        
        # 测试创建广告效果
        result = AdResult(
            campaign_id=1,
            impressions=100000,
            clicks=3200,
            conversions=288,
            cost=8000.0
        )
        print("✅ 广告效果模型创建成功")
        
        # 测试创建Agent日志
        log = AgentLog(
            campaign_id=1,
            step="test",
            message="测试日志",
            data='{"test": "data"}'
        )
        print("✅ Agent日志模型创建成功")
        
        return True
    except Exception as e:
        print(f"❌ 数据模型测试失败: {e}")
        return False

def test_agent():
    """测试Agent功能"""
    print("\n=== 测试Agent功能 ===")
    try:
        session = get_session()
        
        # 创建测试广告活动
        campaign = AdCampaign(
            name="Agent测试活动",
            product="测试产品",
            objective="转化优化",
            budget=5000.0,
            status="created"
        )
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        
        print(f"✅ 创建测试广告活动，ID: {campaign.id}")
        
        # 测试Agent优化
        result = ads_agent.optimize_campaign(campaign.id, session)
        print(f"✅ Agent优化成功: {result}")
        
        # 查询日志
        logs = session.exec(
            select(AgentLog)
            .where(AgentLog.campaign_id == campaign.id)
            .order_by(AgentLog.created_at.asc())
        ).all()
        
        print(f"✅ 生成 {len(logs)} 条Agent日志")
        for log in logs:
            print(f"  - {log.step}: {log.message}")
        
        session.close()
        return True
    except Exception as e:
        print(f"❌ Agent测试失败: {e}")
        return False

def test_api_endpoints():
    """测试API端点（模拟）"""
    print("\n=== 测试API端点 ===")
    try:
        session = get_session()
        
        # 模拟API调用
        # 1. 获取广告活动列表
        campaigns = session.exec(select(AdCampaign)).all()
        print(f"✅ GET /api/campaigns - 返回 {len(campaigns)} 个活动")
        
        # 2. 获取仪表盘数据
        running_campaigns = session.exec(select(AdCampaign).where(AdCampaign.status == "running")).count()
        print(f"✅ GET /api/dashboard/overview - 运行中活动: {running_campaigns}")
        
        # 3. 获取Agent日志
        logs = session.exec(select(AgentLog)).all()
        print(f"✅ GET /api/campaigns/{1}/logs - 返回 {len(logs)} 条日志")
        
        # 4. 获取决策链路
        decision_logs = session.exec(
            select(AgentLog)
            .where(AgentLog.campaign_id == 1)
            .order_by(AgentLog.created_at.asc())
        ).all()
        print(f"✅ GET /api/campaigns/{1}/decisions - 返回 {len(decision_logs)} 个决策步骤")
        
        session.close()
        return True
    except Exception as e:
        print(f"❌ API端点测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始测试智能广告Agent后端服务")
    print("=" * 50)
    
    # 运行所有测试
    tests = [
        test_database,
        test_models,
        test_agent,
        test_api_endpoints
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ 测试异常: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！后端服务运行正常")
        print("\n📋 可用功能:")
        print("  ✅ 数据库连接和表创建")
        print("  ✅ 数据模型定义")
        print("  ✅ Agent智能优化")
        print("  ✅ API端点模拟")
        print("  ✅ 日志记录和查询")
        print("\n🚀 可以启动服务器: uvicorn main:app --reload")
    else:
        print("⚠️  部分测试失败，请检查错误信息")

if __name__ == "__main__":
    main() 