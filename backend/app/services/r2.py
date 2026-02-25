from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path
from uuid import uuid4
from urllib.parse import quote

import boto3
from botocore.config import Config

from app.core.config import settings


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
SAFE_FOLDER_RE = re.compile(r"[^a-zA-Z0-9/_-]+")
SAFE_FILENAME_RE = re.compile(r"[^a-zA-Z0-9._-]+")


def _sanitize_folder(folder: str | None) -> str:
    if not folder:
        return "media"
    cleaned = SAFE_FOLDER_RE.sub("", folder).strip("/")
    return cleaned or "media"


def _sanitize_filename(filename: str) -> str:
    stem = Path(filename).stem[:80]
    safe_stem = SAFE_FILENAME_RE.sub("-", stem).strip("-._")
    return safe_stem or "file"


def _validate_image_input(filename: str, content_type: str, file_size: int | None) -> str:
    extension = Path(filename).suffix.lower()
    if content_type.lower() not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Only jpg/jpeg/png/webp images are allowed")
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError("Unsupported file extension. Use jpg/jpeg/png/webp")
    if file_size is not None and file_size > MAX_IMAGE_SIZE_BYTES:
        raise ValueError("Image is too large. Max size is 10MB")
    return extension


def _build_public_url(file_key: str) -> str:
    if not settings.R2_PUBLIC_BASE_URL:
        raise RuntimeError("R2_PUBLIC_BASE_URL is not configured")
    base_url = settings.R2_PUBLIC_BASE_URL.rstrip("/")
    return f"{base_url}/{quote(file_key, safe='/')}"


def is_r2_configured() -> bool:
    return all(
        [
            settings.R2_ACCOUNT_ID,
            settings.R2_ACCESS_KEY_ID,
            settings.R2_SECRET_ACCESS_KEY,
            settings.R2_BUCKET_NAME,
            settings.R2_PUBLIC_BASE_URL,
        ]
    )


@lru_cache(maxsize=1)
def get_r2_client():
    if not is_r2_configured():
        raise RuntimeError("R2 is not fully configured")

    endpoint_url = f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        region_name=settings.R2_REGION,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
    )


def create_presigned_upload(
    *,
    filename: str,
    content_type: str,
    folder: str | None,
    file_size: int | None,
) -> dict[str, str]:
    if not is_r2_configured():
        raise RuntimeError("R2 storage is not configured")

    extension = _validate_image_input(filename, content_type, file_size)
    safe_folder = _sanitize_folder(folder)
    safe_name = _sanitize_filename(filename)
    file_key = f"{safe_folder}/{uuid4().hex}-{safe_name}{extension}"

    client = get_r2_client()
    upload_url = client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": file_key,
            "ContentType": content_type,
        },
        ExpiresIn=settings.R2_PRESIGN_EXPIRES_SECONDS,
        HttpMethod="PUT",
    )

    return {
        "upload_url": upload_url,
        "file_key": file_key,
        "public_url": _build_public_url(file_key),
        "content_type": content_type,
    }


def delete_file(file_key: str) -> None:
    if not is_r2_configured():
        raise RuntimeError("R2 storage is not configured")
    client = get_r2_client()
    client.delete_object(Bucket=settings.R2_BUCKET_NAME, Key=file_key)
