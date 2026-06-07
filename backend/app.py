from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import register_routes

app = FastAPI(
    title="Whisky Record API",
    version="1.0.0",
    description="ウイスキー記録アプリのバックエンド API。/docs で Swagger UI を確認できる。",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_routes(app)
