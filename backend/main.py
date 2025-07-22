from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .startup import register_startup

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

@app.get("/health", tags=["Health"])
def health_check():
    """健康检查接口"""
    return {"status": "ok"}

# 后续将在此处添加广告Agent相关API 