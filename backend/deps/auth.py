from dataclasses import dataclass
from typing import Optional
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
import requests as http_requests
from config import settings
from database import get_db
from models import User

security = HTTPBearer(auto_error=False)
_jwks_cache: dict = {}

DEV_SUB = "dev-user-sub"
DEV_EMAIL = "dev@example.com"
DEV_USERNAME = "開発ユーザー"


@dataclass
class TokenClaims:
    """JWT から取り出した認証情報"""
    sub: str
    email: str


def _get_jwks(region: str, user_pool_id: str) -> dict:
    cache_key = f"{region}:{user_pool_id}"
    if cache_key not in _jwks_cache:
        url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"
        resp = http_requests.get(url, timeout=5)
        resp.raise_for_status()
        _jwks_cache[cache_key] = {k["kid"]: k for k in resp.json()["keys"]}
    return _jwks_cache[cache_key]


def _verify_token(token: str) -> dict:
    header = jwt.get_unverified_header(token)
    jwks = _get_jwks(settings.COGNITO_REGION, settings.COGNITO_USER_POOL_ID)
    if header["kid"] not in jwks:
        raise ValueError("Unknown kid")
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks[header["kid"]])
    return jwt.decode(
        token,
        public_key,
        algorithms=["RS256"],
        audience=settings.COGNITO_CLIENT_ID,
    )


def get_token_claims(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> TokenClaims:
    if settings.DEV_MODE:
        return TokenClaims(sub=DEV_SUB, email=DEV_EMAIL)
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = _verify_token(credentials.credentials)
        return TokenClaims(sub=payload["sub"], email=payload.get("email", ""))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    claims: TokenClaims = Depends(get_token_claims),
    db: Session = Depends(get_db),
) -> User:
    user = db.query(User).filter(User.cognito_sub == claims.sub).first()
    if user:
        return user
    if settings.DEV_MODE:
        user = User(cognito_sub=DEV_SUB, email=DEV_EMAIL, username=DEV_USERNAME)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    raise HTTPException(status_code=404, detail="User not found")
