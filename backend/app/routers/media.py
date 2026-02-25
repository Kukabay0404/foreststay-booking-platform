from fastapi import APIRouter, Depends, HTTPException, status

from app import models
from app.auth.deps import get_current_admin
from app.schemas.media import (
    DeleteMediaRequest,
    DeleteMediaResponse,
    PresignUploadRequest,
    PresignUploadResponse,
)
from app.services import r2


router = APIRouter(prefix="/media", tags=["Media"])


@router.post("/presign-upload", response_model=PresignUploadResponse)
async def presign_upload(
    payload: PresignUploadRequest,
    _admin: models.User = Depends(get_current_admin),
):
    try:
        data = r2.create_presigned_upload(
            filename=payload.filename,
            content_type=payload.content_type,
            folder=payload.folder,
            file_size=payload.file_size,
        )
        return PresignUploadResponse(
            upload_url=data["upload_url"],
            file_key=data["file_key"],
            public_url=data["public_url"],
            required_headers={"Content-Type": data["content_type"]},
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Media storage is not configured",
        ) from exc


@router.post("/delete", response_model=DeleteMediaResponse)
async def delete_media(
    payload: DeleteMediaRequest,
    _admin: models.User = Depends(get_current_admin),
):
    try:
        r2.delete_file(payload.key)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Media storage is not configured",
        ) from exc
    return DeleteMediaResponse(success=True)
