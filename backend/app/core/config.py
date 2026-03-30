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

    @property
    def cors_list(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS == "*":
            return ["*"]
        if isinstance(self.CORS_ORIGINS, str) and self.CORS_ORIGINS.startswith("[") and self.CORS_ORIGINS.endswith("]"):
            try:
                import json
                return json.loads(self.CORS_ORIGINS)
            except Exception:
                pass
        if isinstance(self.CORS_ORIGINS, str) and "," in self.CORS_ORIGINS:
            return [x.strip() for x in self.CORS_ORIGINS.split(",") if x.strip()]
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [self.CORS_ORIGINS]


settings = Settings()