# 智能广告 Agent 项目

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
- **React + Vite**: 现代前端开发
- **Docker**: 容器化部署

---

## 数据库结构

- `adcampaign`：广告活动表
- `adresult`：广告效果表
- `agentlog`：Agent日志表
- `ai_advice`：AI建议表
- `ai_execution`：AI建议执行记录表
- `industry_brief`：行业快讯/AI摘要表

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
- `GET /api/ai/daily-brief` - 获取每日行业快讯/AI摘要
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

## 本地启动与运行

### 1. 启动后端（FastAPI）

1. 进入后端目录
   ```sh
   cd backend
   ```
2. （可选）创建并激活虚拟环境
   - Windows:
     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```
3. 安装依赖
   ```sh
   pip install -r requirements.txt
   ```
4. 配置API KEY（在 backend/.env 文件中填写 OpenAI/DeepSeek/NewsAPI Key）
5. 初始化数据库（首次启动或表结构有变动时）
   ```sh
   python init_db.py
   ```
6. 启动 FastAPI 服务
   ```sh
   uvicorn main:app --reload
   ```
   - 默认访问地址：[http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Swagger 文档：[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2. 启动前端（Vite/React）

1. 进入前端目录
   ```sh
   cd frontend
   ```
2. 安装依赖
   ```sh
   npm install
   ```
3. 启动前端开发服务器
   ```sh
   npm run dev
   ```
   - 默认访问地址：[http://localhost:5173](http://localhost:5173)

---

### 3. 联调与验证

1. 确保后端（8000端口）和前端（5173端口）都已启动。
2. 在浏览器访问前端页面 [http://localhost:5173](http://localhost:5173)
3. 进行如下操作：
   - 查看广告活动列表（数据来自后端）
   - 创建/编辑广告活动（数据实时写入后端数据库）
   - 体验AI建议、审批、自动执行、行业快讯等功能
   - 如遇问题，查看终端输出的错误日志

---

### 4. 一键启动（可选 Docker）

如你已配置好 docker-compose.yml，可在项目根目录运行：
```sh
docker-compose up --build
```
- 会自动启动前后端服务。

---

## 联系方式

如有任何报错或疑问，把错误信息发给我，我会帮你快速定位和解决！ 