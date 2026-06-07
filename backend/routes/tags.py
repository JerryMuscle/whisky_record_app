from uuid import UUID
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, FlavorTag
from schemas import FlavorTagResponse, FlavorTagCreateRequest
from deps.auth import get_current_user
from services import tag_service

router = APIRouter(tags=["Flavor Tags"])


@router.get("/tags", response_model=list[FlavorTagResponse])
def list_tags(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FlavorTag]:
    """ログインユーザーのフレーバータグ一覧を名前のアルファベット順で返す。"""
    return tag_service.list_tags(db, current_user.id)


@router.post("/tags", response_model=FlavorTagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    body: FlavorTagCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlavorTag:
    """新しいフレーバータグを作成する。ユーザー内で名前が重複する場合は 409。

    Args:
        body.name: タグ名（1〜50文字）。
    """
    return tag_service.create_tag(db, current_user.id, body.name)


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    tag_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """指定フレーバータグを削除する。

    Args:
        tag_id: 削除するタグの ID（パスパラメータ）。
    """
    tag = tag_service.get_tag_or_404(db, tag_id, current_user.id)
    tag_service.delete_tag(db, tag)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
