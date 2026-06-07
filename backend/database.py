from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI の Depends で注入する DB セッション。リクエスト終了時に自動クローズ。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
