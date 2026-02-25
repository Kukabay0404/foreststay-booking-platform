from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel


class PresignUploadRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(alias="contentType")
    folder: str | None = Field(default="media", max_length=120)
    file_size: int | None = Field(default=None, alias="fileSize", ge=1)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    @field_validator("filename", "content_type")
    @classmethod
    def strip_values(cls, value: str) -> str:
        return value.strip()


class PresignUploadResponse(BaseModel):
    upload_url: str = Field(alias="uploadUrl")
    file_key: str = Field(alias="fileKey")
    public_url: str = Field(alias="publicUrl")
    required_headers: dict[str, str] = Field(alias="requiredHeaders")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class DeleteMediaRequest(BaseModel):
    key: str = Field(min_length=1)


class DeleteMediaResponse(BaseModel):
    success: bool
