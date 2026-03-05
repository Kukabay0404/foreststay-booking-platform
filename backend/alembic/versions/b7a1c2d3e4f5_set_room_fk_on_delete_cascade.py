"""set room fk on delete cascade

Revision ID: b7a1c2d3e4f5
Revises: 8c9d7e6f5a4b
Create Date: 2026-02-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "b7a1c2d3e4f5"
down_revision: Union[str, Sequence[str], None] = "8c9d7e6f5a4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("fk_bookings_room_id_rooms", "bookings", type_="foreignkey")
    op.create_foreign_key(
        "fk_bookings_room_id_rooms",
        "bookings",
        "rooms",
        ["room_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_bookings_room_id_rooms", "bookings", type_="foreignkey")
    op.create_foreign_key(
        "fk_bookings_room_id_rooms",
        "bookings",
        "rooms",
        ["room_id"],
        ["id"],
        ondelete="RESTRICT",
    )
