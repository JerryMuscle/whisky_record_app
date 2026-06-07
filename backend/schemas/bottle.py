from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional, Literal


class BottleResponse(BaseModel):
    """API レスポンス用ボトル情報"""
    id: UUID
    user_id: UUID
    name: str
    distillery: str
    region: str
    bottle_type: Optional[str] = None
    abv: Optional[Decimal] = None
    price: Optional[int] = None
    photo_url: Optional[str] = None
    is_public: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BottleCreateRequest(BaseModel):
    """POST /bottles のリクエストボディ"""
    name: str                           # ボトル名（必須・1文字以上）
    distillery: str                     # 蒸留所名（必須・1文字以上）
    region: str                         # 産地・地域（必須・1文字以上）
    bottle_type: Optional[str] = None   # ボトルの種類
    abv: Optional[Decimal] = None       # アルコール度数
    price: Optional[int] = None         # 価格（円）
    photo_url: Optional[str] = None     # 写真 URL
    is_public: bool = False             # 公開フラグ

    @field_validator("name", "distillery", "region")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("空文字は許可されていません")
        return v


class BottleUpdateRequest(BaseModel):
    """PUT /bottles/{id} のリクエストボディ（指定フィールドのみ更新）"""
    name: Optional[str] = None
    distillery: Optional[str] = None
    region: Optional[str] = None
    bottle_type: Optional[str] = None
    abv: Optional[Decimal] = None
    price: Optional[int] = None
    photo_url: Optional[str] = None
    is_public: Optional[bool] = None


class PhotoUploadRequest(BaseModel):
    """POST /bottles/{id}/photo のリクエストボディ"""
    content_type: Literal["image/jpeg", "image/png"] = "image/jpeg"  # JPEG/PNG のみ対応


class PhotoUploadResponse(BaseModel):
    upload_url: str   # S3 署名付きアップロード URL（有効期限5分）
    photo_url: str    # アップロード後の公開 URL（photo_url フィールドに保存する）
