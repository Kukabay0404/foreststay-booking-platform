"""add integrity constraints

Revision ID: c4d7e9f1a2b3
Revises: a2b6c8d9e1f0
Create Date: 2026-02-14 12:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c4d7e9f1a2b3"
down_revision: Union[str, Sequence[str], None] = "a2b6c8d9e1f0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "uq_users_email_lower",
        "users",
        [sa.text("lower(email)")],
        unique=True,
    )

    op.create_check_constraint(
        "ck_rooms_rooms_positive",
        "rooms",
        "rooms > 0",
    )
    op.create_check_constraint(
        "ck_rooms_beds_positive",
        "rooms",
        "beds > 0",
    )
    op.create_check_constraint(
        "ck_rooms_price_weekdays_nonnegative",
        "rooms",
        "price_weekdays >= 0",
    )
    op.create_check_constraint(
        "ck_rooms_price_weekend_nonnegative",
        "rooms",
        "price_weekend >= 0",
    )
    op.create_check_constraint(
        "ck_rooms_capacity_positive",
        "rooms",
        "capacity is null or capacity > 0",
    )

    op.create_check_constraint(
        "ck_cabins_rooms_positive",
        "cabins",
        "rooms > 0",
    )
    op.create_check_constraint(
        "ck_cabins_floors_positive",
        "cabins",
        "floors > 0",
    )
    op.create_check_constraint(
        "ck_cabins_beds_positive",
        "cabins",
        "beds > 0",
    )
    op.create_check_constraint(
        "ck_cabins_price_weekdays_nonnegative",
        "cabins",
        "price_weekdays >= 0",
    )
    op.create_check_constraint(
        "ck_cabins_price_weekend_nonnegative",
        "cabins",
        "price_weekend >= 0",
    )

    op.execute(
        """
        with ranked as (
            select
                id,
                start_date,
                row_number() over (
                    partition by object_type, object_id, start_date
                    order by created_at, id
                ) as rn
            from bookings
            where end_date <= start_date
        )
        update bookings b
        set start_date = ranked.start_date + (ranked.rn - 1) * interval '1 day',
            end_date = ranked.start_date + ranked.rn * interval '1 day'
        from ranked
        where b.id = ranked.id
        """
    )

    op.create_check_constraint(
        "ck_bookings_object_type_values",
        "bookings",
        "object_type in ('room', 'cabin')",
    )
    op.create_check_constraint(
        "ck_bookings_date_range",
        "bookings",
        "start_date < end_date",
    )

    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
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


def downgrade() -> None:
    op.execute(
        "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ex_bookings_no_overlap_active"
    )
    op.drop_constraint("ck_bookings_date_range", "bookings", type_="check")
    op.drop_constraint("ck_bookings_object_type_values", "bookings", type_="check")

    op.drop_constraint("ck_cabins_price_weekend_nonnegative", "cabins", type_="check")
    op.drop_constraint("ck_cabins_price_weekdays_nonnegative", "cabins", type_="check")
    op.drop_constraint("ck_cabins_beds_positive", "cabins", type_="check")
    op.drop_constraint("ck_cabins_floors_positive", "cabins", type_="check")
    op.drop_constraint("ck_cabins_rooms_positive", "cabins", type_="check")

    op.drop_constraint("ck_rooms_capacity_positive", "rooms", type_="check")
    op.drop_constraint("ck_rooms_price_weekend_nonnegative", "rooms", type_="check")
    op.drop_constraint("ck_rooms_price_weekdays_nonnegative", "rooms", type_="check")
    op.drop_constraint("ck_rooms_beds_positive", "rooms", type_="check")
    op.drop_constraint("ck_rooms_rooms_positive", "rooms", type_="check")

    op.drop_index("uq_users_email_lower", table_name="users")
