"""harden bookings schema

Revision ID: a2b6c8d9e1f0
Revises: 5f2d9c1a7b44
Create Date: 2026-02-14 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a2b6c8d9e1f0"
down_revision: Union[str, Sequence[str], None] = "5f2d9c1a7b44"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bookings", sa.Column("user_id", sa.Integer(), nullable=True))
    op.add_column(
        "bookings",
        sa.Column("status", sa.String(length=20), server_default="pending", nullable=False),
    )
    op.create_foreign_key(
        "fk_bookings_user_id_users",
        "bookings",
        "users",
        ["user_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_check_constraint(
        "ck_bookings_status_values",
        "bookings",
        "status in ('pending', 'confirmed', 'cancelled')",
    )

    op.execute(
        """
        update bookings b
        set user_id = u.id
        from users u
        where lower(u.email) = lower(b.email)
          and b.user_id is null
        """
    )

    op.execute("update bookings set start_date = created_at where start_date is null")
    op.execute(
        "update bookings set end_date = (created_at + interval '1 day') where end_date is null"
    )
    op.alter_column("bookings", "start_date", nullable=False)
    op.alter_column("bookings", "end_date", nullable=False)

    op.create_index(
        "ix_bookings_user_created",
        "bookings",
        ["user_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_bookings_user_created", table_name="bookings")
    op.alter_column("bookings", "end_date", nullable=True)
    op.alter_column("bookings", "start_date", nullable=True)
    op.drop_constraint("ck_bookings_status_values", "bookings", type_="check")
    op.drop_constraint("fk_bookings_user_id_users", "bookings", type_="foreignkey")
    op.drop_column("bookings", "status")
    op.drop_column("bookings", "user_id")
