import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

SQLITE_FALLBACK_URL = "sqlite:///./memory_wall.db"


def get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        return SQLITE_FALLBACK_URL
    return normalize_postgres_url(url)


def normalize_postgres_url(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1) # the first occur. 
    return url


def _build_engine(url: str):
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=connect_args)


def create_engine_with_fallback():
    url = get_database_url()

    try:
        engine = _build_engine(url)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return engine
    except OperationalError:
        if url.startswith("postgres://"):
            fixed_url = normalize_postgres_url(url)
            return _build_engine(fixed_url)
        raise


engine = create_engine_with_fallback()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
