"""booking direct fks and status workflow

Revision ID: f1a2b3c4d5e6
Revises: c4d7e9f1a2b3
Create Date: 2026-02-14 16:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "c4d7e9f1a2b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bookings", sa.Column("room_id", sa.Integer(), nullable=True))
    op.add_column("bookings", sa.Column("cabin_id", sa.Integer(), nullable=True))

    # Delete orphan rows that cannot be linked to a real room/cabin.
    op.execute(
        """
        delete from bookings b
        where (b.object_type = 'room' and not exists (select 1 from rooms r where r.id = b.object_id))
           or (b.object_type = 'cabin' and not exists (select 1 from cabins c where c.id = b.object_id))
        """
    )

    op.execute(
        """
        update bookings
        set room_id = object_id
        where object_type = 'room'
        """
    )
    op.execute(
        """
        update bookings
        set cabin_id = object_id
        where object_type = 'cabin'
        """
    )

    op.create_foreign_key(
        "fk_bookings_room_id_rooms",
        "bookings",
        "rooms",
        ["room_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_bookings_cabin_id_cabins",
        "bookings",
        "cabins",
        ["cabin_id"],
        ["id"],
        ondelete="RESTRICT",
    )

    op.create_check_constraint(
        "ck_bookings_one_target",
        "bookings",
        "((room_id is not null)::int + (cabin_id is not null)::int) = 1",
    )
    op.create_check_constraint(
        "ck_bookings_target_consistency",
        "bookings",
        """
        (
            object_type = 'room'
            and room_id is not null
            and cabin_id is null
            and object_id = room_id
        )
        or
        (
            object_type = 'cabin'
            and cabin_id is not null
            and room_id is null
            and object_id = cabin_id
        )
        """,
    )

    op.create_index(
        "ix_bookings_room_dates",
        "bookings",
        ["room_id", "start_date", "end_date"],
        unique=False,
    )
    op.create_index(
        "ix_bookings_cabin_dates",
        "bookings",
        ["cabin_id", "start_date", "end_date"],
        unique=False,
    )

    op.execute(
        "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ex_bookings_no_overlap_active"
    )
    op.execute(
        """
        ALTER TABLE bookings
        ADD CONSTRAINT ex_bookings_room_no_overlap_active
        EXCLUDE USING gist (
            room_id WITH =,
            tstzrange(start_date, end_date, '[)') WITH &&
        )
        WHERE (room_id is not null and status in ('pending', 'confirmed'))
        """
    )
    op.execute(
        """
        ALTER TABLE bookings
        ADD CONSTRAINT ex_bookings_cabin_no_overlap_active
        EXCLUDE USING gist (
            cabin_id WITH =,
            tstzrange(start_date, end_date, '[)') WITH &&
        )
        WHERE (cabin_id is not null and status in ('pending', 'confirmed'))
        """
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ex_bookings_cabin_no_overlap_active"
    )
    op.execute(
        "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ex_bookings_room_no_overlap_active"
    )
    op.execute(
        """
        ALTER TABLE bookings
        ADD CONSTRAINT ex_bookings_no_overlap_active
        EXCLUDE USING gist (
            object_type WITH =,
            object_id WITH =,
            tstzrange(start_date, end_date, '[)') WITH &&
        )
        WHERE (status in ('pending', 'confirmed'))
        """
    )

    op.drop_index("ix_bookings_cabin_dates", table_name="bookings")
    op.drop_index("ix_bookings_room_dates", table_name="bookings")

    op.drop_constraint("ck_bookings_target_consistency", "bookings", type_="check")
    op.drop_constraint("ck_bookings_one_target", "bookings", type_="check")
    op.drop_constraint("fk_bookings_cabin_id_cabins", "bookings", type_="foreignkey")
    op.drop_constraint("fk_bookings_room_id_rooms", "bookings", type_="foreignkey")
    op.drop_column("bookings", "cabin_id")
    op.drop_column("bookings", "room_id")
