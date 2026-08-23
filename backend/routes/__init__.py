from fastapi import FastAPI
from .users import router as users_router
from .bottles import router as bottles_router
from .sessions import router as sessions_router
from .tags import router as tags_router


def register_routes(app: FastAPI) -> None:
    app.include_router(users_router)
    app.include_router(bottles_router)
    app.include_router(sessions_router)
    app.include_router(tags_router)
