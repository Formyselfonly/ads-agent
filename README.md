# 智能广告Agent原型系统

## 项目简介

本项目是一个基于大语言模型的智能广告Agent原型系统，旨在自动化广告活动的创建、投放、效果追踪与智能优化，并可视化展示Agent的决策链路和日志。项目采用全栈架构，前端基于 Next.js，后端基于 FastAPI + LangChain/LangGraph，支持一键部署到 AWS，突出工程化与AI能力。

---

## 核心功能

1. **广告活动智能创建**  
   用户输入产品、目标、预算等信息，Agent自动生成广告文案和投放策略。

2. **广告投放模拟与效果追踪**  
   Agent自动投放广告（模拟API），并返回曝光、点击等效果数据。

3. **智能优化与自动迭代**  
   Agent根据效果数据自动调整策略（如修改文案、调整预算），形成优化闭环。

4. **决策链路与日志可视化**  
   前端可视化展示Agent每一步决策、工具调用、优化过程和日志，便于调试和复盘。

---

## 技术栈

- **前端**：Next.js (React, TypeScript, Tailwind CSS)
- **后端**：FastAPI, LangChain, LangGraph（或自研Agent编排）
- **数据库**：Postgres/SQLite（本地开发），可选 Redis
- **部署**：Docker + AWS（EC2/ECS/S3/CloudFront）
- **日志/追踪**：自定义日志系统，前端可视化

---

## 项目结构

```
frontend/   # Next.js 前端，决策链路与日志可视化
backend/    # FastAPI + LangChain/LangGraph 后端，Agent逻辑与API
Dockerfile  # 一键部署脚本
README.md   # 项目说明
```

---

## 快速开始

1. 克隆项目

```bash
git clone <your-repo-url>
cd ads-agent
```

2. 安装依赖

```bash
# 前端
cd frontend && npm install
# 后端
cd ../backend && pip install -r requirements.txt
```

3. 启动服务

```bash
# 启动后端
cd backend && uvicorn main:app --reload
# 启动前端
cd ../frontend && npm run dev
```

4. 访问系统

浏览器打开：http://localhost:3000

---

## 部署到 AWS

1. 构建 Docker 镜像
2. 推送到 ECR 或 Docker Hub
3. 使用 EC2/ECS/S3/CloudFront 部署

---

## 展示亮点

- 多Agent协作与工具调用
- 智能优化闭环与自我反思
- 决策链路与日志可视化
- 全栈工程化与一键部署

---

## 联系方式

如需交流或合作，欢迎联系：your.email@example.com 