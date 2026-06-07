from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Bottle, User
from schemas import BottleCreateRequest, BottleUpdateRequest


def get_bottle_or_404(db: Session, bottle_id: UUID, user_id: UUID) -> Bottle:
    """bottle_id と user_id でボトルを取得する。
    存在しない・他ユーザーのボトルの場合は 404 を返す（情報漏洩防止）。
    """
    bottle = db.query(Bottle).filter(Bottle.id == bottle_id, Bottle.user_id == user_id).first()
    if not bottle:
        raise HTTPException(status_code=404, detail="Bottle not found")
    return bottle


def list_bottles(db: Session, user_id: UUID) -> list[Bottle]:
    """ユーザーのボトル一覧を作成日時の降順で返す。"""
    return db.query(Bottle).filter(Bottle.user_id == user_id).order_by(Bottle.created_at.desc()).all()


def create_bottle(db: Session, user_id: UUID, data: BottleCreateRequest) -> Bottle:
    """新しいボトルを作成して返す。"""
    bottle = Bottle(user_id=user_id, **data.model_dump())
    db.add(bottle)
    db.commit()
    db.refresh(bottle)
    return bottle


def update_bottle(db: Session, bottle: Bottle, data: BottleUpdateRequest) -> Bottle:
    """ボトルを部分更新する。None のフィールドは変更しない。"""
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(bottle, field, value)
    db.commit()
    db.refresh(bottle)
    return bottle


def delete_bottle(db: Session, bottle: Bottle) -> None:
    """ボトルを削除する。関連するテイスティング記録も CASCADE 削除される。"""
    db.delete(bottle)
    db.commit()
