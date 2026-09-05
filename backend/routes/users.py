from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, RegisterRequest, UserUpdateRequest
from deps.auth import get_token_claims, get_current_user, TokenClaims
from services import user_service

router = APIRouter(tags=["Users"])


@router.post("/auth/me", response_model=UserResponse)
def register_or_get_me(
    body: RegisterRequest,
    response: Response,
    claims: TokenClaims = Depends(get_token_claims),
    db: Session = Depends(get_db),
) -> User:
    """Cognito ログイン後に呼び出す初回登録エンドポイント。
    DB に未登録なら新規作成 (201)、登録済みなら既存ユーザーを返す (200)。

    Args:
        body.username: ユーザー名。省略時はメールアドレスのローカル部分を使用。
        claims: JWT から取得した cognito_sub と email。
    """
    user, created = user_service.get_or_create_user(db, claims, body.username)
    if created:
        response.status_code = status.HTTP_201_CREATED
    return user


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    """ログイン中のユーザー情報を取得する。"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    body: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """ユーザー情報を部分更新する。指定しないフィールドは変更されない。

    Args:
        body.username: 新しいユーザー名。
        body.avatar_url: アバター画像の URL。
    """
    return user_service.update_user(db, current_user, body.username, body.avatar_url)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """ログイン中のユーザーを削除する。関連するボトル・テイスティング記録・フレーバータグも CASCADE 削除される。"""
    user_service.delete_user(db, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
