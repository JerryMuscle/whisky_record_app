import uuid
from datetime import datetime, timezone
from sqlalchemy import Text, DateTime, Boolean, SmallInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from . import Base


class TastingSession(Base):
    __tablename__ = "tasting_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bottle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("bottles.id", ondelete="CASCADE"), nullable=False
    )
    tasted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    serving_style: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)
    situation: Mapped[str | None] = mapped_column(Text, nullable=True)
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    want_again: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    f_smoky: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    f_fruity: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    f_floral: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    f_spicy: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    f_woody: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    bottle = relationship("Bottle", back_populates="sessions")
    flavor_tags = relationship("FlavorTag", secondary="session_flavor_tags", back_populates="sessions")
