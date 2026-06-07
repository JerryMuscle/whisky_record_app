from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserResponse(BaseModel):
    """API レスポンス用ユーザー情報"""
    id: UUID
    email: EmailStr
    username: str
    cognito_sub: str
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RegisterRequest(BaseModel):
    """POST /auth/me のリクエストボディ"""
    username: Optional[str] = None  # 省略時はメールのローカル部分を使用


class UserUpdateRequest(BaseModel):
    """PUT /me のリクエストボディ（指定フィールドのみ更新）"""
    username: Optional[str] = None
    avatar_url: Optional[str] = None
