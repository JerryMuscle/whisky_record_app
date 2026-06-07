from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID
from datetime import datetime


class FlavorTagResponse(BaseModel):
    """API レスポンス用フレーバータグ情報"""
    id: UUID
    user_id: UUID
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FlavorTagCreateRequest(BaseModel):
    """POST /tags のリクエストボディ"""
    name: str  # タグ名（1〜50文字）

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("タグ名は必須です")
        if len(v) > 50:
            raise ValueError("タグ名は50文字以内です")
        return v
