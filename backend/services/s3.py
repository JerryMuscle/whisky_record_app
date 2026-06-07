import uuid
import boto3
from config import settings


def generate_presigned_upload_url(content_type: str) -> dict:
    """ボトル写真アップロード用の S3 署名付き URL を発行する（有効期限5分）"""
    s3 = boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    bucket = settings.AWS_S3_BUCKET
    key = f"bottles/{uuid.uuid4()}"

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=300,
    )

    if settings.CLOUDFRONT_DOMAIN:
        photo_url = f"https://{settings.CLOUDFRONT_DOMAIN}/{key}"
    else:
        photo_url = f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    return {"upload_url": upload_url, "photo_url": photo_url}
