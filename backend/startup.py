from fastapi import FastAPI
from db import init_db

def register_startup(app: FastAPI):
    @app.on_event("startup")
    def on_startup():
        init_db() 