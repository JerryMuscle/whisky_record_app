from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from .user import User
from .bottle import Bottle
from .tasting_session import TastingSession
from .flavor_tag import FlavorTag, SessionFlavorTag
