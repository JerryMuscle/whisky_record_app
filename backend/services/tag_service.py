from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import FlavorTag


def get_tag_or_404(db: Session, tag_id: UUID, user_id: UUID) -> FlavorTag:
    """tag_id と user_id でタグを取得する。存在しない・他ユーザーのタグは 404。"""
    tag = db.query(FlavorTag).filter(FlavorTag.id == tag_id, FlavorTag.user_id == user_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag


def list_tags(db: Session, user_id: UUID) -> list[FlavorTag]:
    """ユーザーのフレーバータグ一覧を名前のアルファベット順で返す。"""
    return db.query(FlavorTag).filter(FlavorTag.user_id == user_id).order_by(FlavorTag.name).all()


def create_tag(db: Session, user_id: UUID, name: str) -> FlavorTag:
    """フレーバータグを作成して返す。ユーザー内で名前が重複する場合は 409。"""
    tag = FlavorTag(user_id=user_id, name=name)
    db.add(tag)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="同名のタグが既に存在します")
    db.refresh(tag)
    return tag


def delete_tag(db: Session, tag: FlavorTag) -> None:
    """フレーバータグを削除する。"""
    db.delete(tag)
    db.commit()
