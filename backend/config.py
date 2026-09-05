from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    COGNITO_REGION: str = "ap-northeast-1"
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET: str = ""
    AWS_REGION: str = "ap-northeast-1"
    CLOUDFRONT_DOMAIN: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
