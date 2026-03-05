"""set cabin fk on delete cascade

Revision ID: 8c9d7e6f5a4b
Revises: 4e0fcf7c84af
Create Date: 2026-02-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "8c9d7e6f5a4b"
down_revision: Union[str, Sequence[str], None] = "4e0fcf7c84af"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("fk_bookings_cabin_id_cabins", "bookings", type_="foreignkey")
    op.create_foreign_key(
        "fk_bookings_cabin_id_cabins",
        "bookings",
        "cabins",
        ["cabin_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_bookings_cabin_id_cabins", "bookings", type_="foreignkey")
    op.create_foreign_key(
        "fk_bookings_cabin_id_cabins",
        "bookings",
        "cabins",
        ["cabin_id"],
        ["id"],
        ondelete="RESTRICT",
    )
