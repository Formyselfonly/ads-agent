# 智能广告Agent后端服务

## 产品定义

本系统是一个集广告活动管理、仪表盘统计、AI智能体于一体的智能广告投放平台。核心能力包括：

1. **广告活动管理**：支持广告活动的创建、编辑、状态变更、历史追溯。
2. **仪表盘统计**：实时统计广告活动核心指标，支持趋势分析和多维度筛选。
3. **AI智能体**：
   - 自动爬取行业/竞品/市场数据，结合历史投放数据，生成AI投放建议。
   - 支持“自动执行”与“用户审批”两种建议落地模式。
   - 每日生成行业快讯/广告投放速读，辅助决策。

所有AI建议、行业快讯、执行记录等均**存储在数据库**，前端渲染的均为真实、可追溯的数据。

---

## 技术栈

- **FastAPI**: 高性能Web框架
- **SQLModel**: 现代化ORM
- **LangChain/OpenAI/DeepSeek**: AI大模型能力
- **SQLite**: 轻量级数据库（开发环境）
- **Docker**: 容器化部署

---

## 数据库结构

- `adcampaign`：广告活动表
- `adresult`：广告效果表
- `agentlog`：Agent日志表
- `ai_advice`：AI建议表
  - id, campaign_id, type, content, status, created_at, executed_at, approved_by
- `ai_execution`：AI建议执行记录表
  - id, advice_id, result, executed_at
- `industry_brief`：行业快讯/AI摘要表
  - id, date, content, raw_data

---

## 核心功能与API

### 1. 广告活动管理
- `GET /api/campaigns` - 获取广告活动列表
- `GET /api/campaigns/{id}` - 获取广告活动详情
- `POST /api/campaigns` - 创建广告活动
- `PUT /api/campaigns/{id}` - 更新广告活动
- `POST /api/campaigns/{id}/status` - 变更广告活动状态

### 2. 仪表盘统计
- `GET /api/dashboard/overview` - 获取仪表盘总览数据

### 3. AI智能体
- `POST /api/campaigns/{id}/agent/analyze` - 爬取行业数据+AI分析，生成投放建议
- `POST /api/campaigns/{id}/agent/optimize` - 基于历史数据自动优化
- `GET /api/campaigns/{id}/decisions` - 获取AI决策链路
- `GET /api/campaigns/{id}/logs` - 获取AI执行日志
- `GET /api/ai/daily-brief` - 获取每日行业快讯/AI摘要（建议定时任务写入industry_brief表）
- `POST /api/ai/advise` - 生成AI建议（多活动/全局）
- `POST /api/ai/execute` - 执行AI建议
- `POST /api/ai/approve` - 用户审批AI建议

---

## 数据流说明

- **AI建议、行业快讯等均写入数据库**，前端所有展示均为真实数据。
- 支持AI建议的“自动执行”与“用户审批”两种落地模式，所有操作均有执行记录。
- 行业快讯/AI摘要每日自动生成，支持历史归档与复盘。

---

## AI能力说明

- 支持OpenAI、DeepSeek等大模型API，自动读取.env配置。
- 可扩展多信息源爬取（新闻、微博、知乎等），AI自动摘要与建议。
- 支持多广告活动批量分析与建议。

---

## 快速开始

1. 安装依赖
```bash
cd backend
pip install -r requirements.txt
```

2. 配置API KEY
```env
# .env 文件
OPENAI_API_KEY=你的OpenAI_API_Key
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
NEWS_API_KEY=你的NewsAPI_Key（可选）
```

3. 初始化数据库
```bash
python init_db.py
```

4. 启动服务
```bash
uvicorn main:app --reload
```

5. 访问API文档
```
http://localhost:8000/docs
```

---

## 部署与扩展

- 支持Docker一键部署，见docker-compose.yml
- 支持多云环境、定时任务、权限扩展等

---

## 联系方式
如有问题，请联系开发团队。 