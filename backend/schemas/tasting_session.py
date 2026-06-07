from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from .flavor_tag import FlavorTagResponse


class TastingSessionResponse(BaseModel):
    """API レスポンス用テイスティング記録"""
    id: UUID
    bottle_id: UUID
    tasted_at: datetime
    rating: int
    serving_style: Optional[str] = None
    location: Optional[str] = None
    situation: Optional[str] = None
    memo: Optional[str] = None
    want_again: Optional[bool] = None
    f_smoky: Optional[int] = None
    f_fruity: Optional[int] = None
    f_floral: Optional[int] = None
    f_spicy: Optional[int] = None
    f_woody: Optional[int] = None
    flavor_tags: List[FlavorTagResponse] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TastingSessionCreateRequest(BaseModel):
    """POST /bottles/{id}/sessions のリクエストボディ"""
    tasted_at: datetime                                         # 試飲日時（必須・ISO 8601）
    rating: int = Field(..., ge=1, le=5)                        # 総合評価（必須・1〜5）
    serving_style: Optional[str] = None                        # 飲み方（ストレート・ロックなど）
    location: Optional[str] = None                             # 場所
    situation: Optional[str] = None                            # シチュエーション
    memo: Optional[str] = None                                 # メモ
    want_again: Optional[bool] = None                          # また飲みたいか
    f_smoky: Optional[int] = Field(None, ge=0, le=5)           # スモーキー (0〜5)
    f_fruity: Optional[int] = Field(None, ge=0, le=5)          # フルーティー (0〜5)
    f_floral: Optional[int] = Field(None, ge=0, le=5)          # フローラル (0〜5)
    f_spicy: Optional[int] = Field(None, ge=0, le=5)           # スパイシー (0〜5)
    f_woody: Optional[int] = Field(None, ge=0, le=5)           # ウッディー (0〜5)
    tag_ids: List[UUID] = []                                   # 紐付けるフレーバータグの ID 配列


class TastingSessionUpdateRequest(BaseModel):
    """PUT /sessions/{id} のリクエストボディ（指定フィールドのみ更新）"""
    tasted_at: Optional[datetime] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    serving_style: Optional[str] = None
    location: Optional[str] = None
    situation: Optional[str] = None
    memo: Optional[str] = None
    want_again: Optional[bool] = None
    f_smoky: Optional[int] = Field(None, ge=0, le=5)
    f_fruity: Optional[int] = Field(None, ge=0, le=5)
    f_floral: Optional[int] = Field(None, ge=0, le=5)
    f_spicy: Optional[int] = Field(None, ge=0, le=5)
    f_woody: Optional[int] = Field(None, ge=0, le=5)
    tag_ids: Optional[List[UUID]] = None  # 指定時は既存タグを全置換
