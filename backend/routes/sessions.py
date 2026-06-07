from uuid import UUID
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, TastingSession
from schemas import TastingSessionResponse, TastingSessionCreateRequest, TastingSessionUpdateRequest
from deps.auth import get_current_user
from services import bottle_service, session_service

router = APIRouter(tags=["Tasting Sessions"])


@router.get("/bottles/{bottle_id}/sessions", response_model=list[TastingSessionResponse])
def list_sessions(
    bottle_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TastingSession]:
    """指定ボトルのテイスティング記録一覧を試飲日時の降順で返す。

    Args:
        bottle_id: 対象ボトルの ID（パスパラメータ）。
    """
    bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)
    return session_service.list_sessions(db, bottle_id)


@router.post("/bottles/{bottle_id}/sessions", response_model=TastingSessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    bottle_id: UUID,
    body: TastingSessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TastingSession:
    """指定ボトルにテイスティング記録を追加する。

    Args:
        bottle_id: 記録を追加するボトルの ID（パスパラメータ）。
        body.tasted_at: 試飲日時（必須）。
        body.rating: 総合評価 1〜5（必須）。
        body.f_smoky 〜 body.f_woody: フレーバースコア 0〜5。
        body.tag_ids: 紐付けるフレーバータグの ID 配列。
    """
    bottle_service.get_bottle_or_404(db, bottle_id, current_user.id)
    return session_service.create_session(db, bottle_id, current_user.id, body)


@router.get("/sessions/{session_id}", response_model=TastingSessionResponse)
def get_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TastingSession:
    """指定テイスティング記録の詳細を取得する。

    Args:
        session_id: 取得するセッションの ID（パスパラメータ）。
    """
    session = session_service.get_session_or_404(db, session_id)
    bottle_service.get_bottle_or_404(db, session.bottle_id, current_user.id)
    return session


@router.put("/sessions/{session_id}", response_model=TastingSessionResponse)
def update_session(
    session_id: UUID,
    body: TastingSessionUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TastingSession:
    """指定テイスティング記録を部分更新する。
    tag_ids を指定した場合は既存の紐付けタグが全置換される。

    Args:
        session_id: 更新するセッションの ID（パスパラメータ）。
        body: 更新したいフィールドだけ指定すれば OK。
    """
    session = session_service.get_session_or_404(db, session_id)
    bottle_service.get_bottle_or_404(db, session.bottle_id, current_user.id)
    return session_service.update_session(db, session, current_user.id, body)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """指定テイスティング記録を削除する。

    Args:
        session_id: 削除するセッションの ID（パスパラメータ）。
    """
    session = session_service.get_session_or_404(db, session_id)
    bottle_service.get_bottle_or_404(db, session.bottle_id, current_user.id)
    session_service.delete_session(db, session)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
