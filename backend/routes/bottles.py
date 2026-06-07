from uuid import UUID
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Bottle
from schemas import BottleResponse, BottleCreateRequest, BottleUpdateRequest, PhotoUploadRequest, PhotoUploadResponse
from deps.auth import get_current_user
from services import bottle_service
from services.s3 import generate_presigned_upload_url

router = APIRouter(tags=["Bottles"])


@router.get("/bottles", response_model=list[BottleResponse])
def list_bottles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Bottle]:
    """ログインユーザーのボトル一覧を作成日時の降順で返す。"""
    return bottle_service.list_bottles(db, current_user.id)


@router.post("/bottles", response_model=BottleResponse, status_code=status.HTTP_201_CREATED)
def create_bottle(
    body: BottleCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Bottle:
    """新しいボトルを登録する。

    Args:
        body.name: ボトル名（必須）。
        body.distillery: 蒸留所名（必須）。
        body.region: 産地・地域（必須）。
        body.abv: アルコール度数。
        body.price: 価格（円）。
        body.is_public: 公開フラグ（デフォルト false）。
    """
    return bottle_service.create_bottle(db, current_user.id, body)


@router.get("/bottles/{bottle_id}", response_model=BottleResponse)
def get_bottle(
    bottle_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Bottle:
    """指定ボトルの詳細を取得する。

    Args:
        bottle_id: 取得するボトルの ID（パスパラメータ）。
    """
    return bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)


@router.put("/bottles/{bottle_id}", response_model=BottleResponse)
def update_bottle(
    bottle_id: UUID,
    body: BottleUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Bottle:
    """指定ボトルを部分更新する。指定しないフィールドは変更されない。

    Args:
        bottle_id: 更新するボトルの ID（パスパラメータ）。
        body: 更新したいフィールドだけ指定すれば OK。
    """
    bottle = bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)
    return bottle_service.update_bottle(db, bottle, body)


@router.delete("/bottles/{bottle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bottle(
    bottle_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """指定ボトルを削除する。関連するテイスティング記録も CASCADE 削除される。

    Args:
        bottle_id: 削除するボトルの ID（パスパラメータ）。
    """
    bottle = bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)
    bottle_service.delete_bottle(db, bottle)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/bottles/{bottle_id}/photo", response_model=PhotoUploadResponse)
def get_photo_upload_url(
    bottle_id: UUID,
    body: PhotoUploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """S3 への写真アップロード用の署名付き URL を発行する（有効期限5分）。
    フロントはこの URL に直接 PUT して写真をアップロードし、
    返却された photo_url を PUT /bottles/{id} で保存する。

    Args:
        bottle_id: 写真を登録するボトルの ID（パスパラメータ）。
        body.content_type: "image/jpeg" または "image/png"。
    """
    bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)
    return generate_presigned_upload_url(body.content_type)
