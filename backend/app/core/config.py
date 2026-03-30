from pydantic_settings import BaseSettings
from typing import List, Union
import json


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 120
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        extra = "ignore"

    # 🔥 This fixes Render CORS parsing issue
    def model_post_init(self, __context):
        if isinstance(self.CORS_ORIGINS, str):
            try:
                self.CORS_ORIGINS = json.loads(self.CORS_ORIGINS)
            except Exception:
                # fallback: convert single string to list
                self.CORS_ORIGINS = [self.CORS_ORIGINS]


settings = Settings()