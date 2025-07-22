from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from startup import register_startup
from campaigns import router as campaigns_router
from dashboard import router as dashboard_router
from agent import router as agent_router
from ai import router as ai_router

app = FastAPI(title="Adsgency AI Agent Backend", description="智能广告Agent后端API服务", version="0.1.0")

register_startup(app)

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(campaigns_router)
app.include_router(dashboard_router)
app.include_router(agent_router)
app.include_router(ai_router)

@app.get("/health", tags=["Health"])
def health_check():
    """健康检查接口"""
    return {"status": "ok"} 