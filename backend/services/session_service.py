from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import TastingSession, FlavorTag
from schemas import TastingSessionCreateRequest, TastingSessionUpdateRequest


def _resolve_tags(db: Session, user_id: UUID, tag_ids: list[UUID]) -> list[FlavorTag]:
    """tag_ids からユーザー所有のタグを取得する。他ユーザーのタグは除外される。"""
    if not tag_ids:
        return []
    return db.query(FlavorTag).filter(FlavorTag.id.in_(tag_ids), FlavorTag.user_id == user_id).all()


def get_session_or_404(db: Session, session_id: UUID) -> TastingSession:
    """session_id でテイスティング記録を取得する。存在しない場合は 404。"""
    session = db.query(TastingSession).filter(TastingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


def list_sessions(db: Session, bottle_id: UUID) -> list[TastingSession]:
    """指定ボトルのテイスティング記録一覧を試飲日時の降順で返す。"""
    return db.query(TastingSession).filter(TastingSession.bottle_id == bottle_id).order_by(TastingSession.tasted_at.desc()).all()


def create_session(db: Session, bottle_id: UUID, user_id: UUID, data: TastingSessionCreateRequest) -> TastingSession:
    """テイスティング記録を作成して返す。tag_ids があればフレーバータグを紐付ける。"""
    raw = data.model_dump()
    tag_ids = raw.pop("tag_ids", [])
    session = TastingSession(bottle_id=bottle_id, **raw)
    session.flavor_tags = _resolve_tags(db, user_id, tag_ids)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def update_session(db: Session, session: TastingSession, user_id: UUID, data: TastingSessionUpdateRequest) -> TastingSession:
    """テイスティング記録を部分更新する。tag_ids を指定した場合は既存タグを全置換する。"""
    raw = data.model_dump(exclude_none=True)
    tag_ids = raw.pop("tag_ids", None)
    for field, value in raw.items():
        setattr(session, field, value)
    if tag_ids is not None:
        session.flavor_tags = _resolve_tags(db, user_id, tag_ids)
    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, session: TastingSession) -> None:
    """テイスティング記録を削除する。"""
    db.delete(session)
    db.commit()
