from sqlalchemy.orm import Session
from models import User
from deps.auth import TokenClaims


def get_or_create_user(db: Session, claims: TokenClaims, username: str | None) -> tuple[User, bool]:
    """cognito_sub でユーザーを検索し、存在しなければ新規作成する。
    戻り値は (user, created) のタプル。created=True なら新規作成。
    """
    user = db.query(User).filter(User.cognito_sub == claims.sub).first()
    if user:
        return user, False

    resolved_name = username or claims.email.split("@")[0]
    user = User(email=claims.email, username=resolved_name, cognito_sub=claims.sub)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, True


def update_user(db: Session, user: User, username: str | None, avatar_url: str | None) -> User:
    """ユーザー情報を部分更新する。None のフィールドは変更しない。"""
    if username is not None:
        user.username = username
    if avatar_url is not None:
        user.avatar_url = avatar_url
    db.commit()
    db.refresh(user)
    return user
