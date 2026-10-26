from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KittStudio API"
    DATABASE_URL: str = "postgresql+psycopg2://kittstudio:password@localhost:5432/kittstudio_db"

    class Config:
        env_file = ".env"

settings = Settings()
