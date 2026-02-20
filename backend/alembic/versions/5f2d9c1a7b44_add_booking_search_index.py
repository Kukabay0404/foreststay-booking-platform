"""add booking search index

Revision ID: 5f2d9c1a7b44
Revises: 727013148706
Create Date: 2026-02-13 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "5f2d9c1a7b44"
down_revision: Union[str, Sequence[str], None] = "727013148706"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_bookings_object_dates",
        "bookings",
        ["object_type", "object_id", "start_date", "end_date"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_bookings_object_dates", table_name="bookings")
