import os
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

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
    return ensure_postgres_ssl(normalize_postgres_url(url))


def normalize_postgres_url(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def ensure_postgres_ssl(url: str) -> str:
    if not url.startswith("postgresql"):
        return url

    parsed = urlparse(url)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    if "sslmode" not in query:
        query["sslmode"] = "require"
    return urlunparse(parsed._replace(query=urlencode(query)))


def _build_engine(url: str):
    if url.startswith("sqlite"):
        return create_engine(
            url,
            connect_args={"check_same_thread": False},
        )
    return create_engine(url, pool_pre_ping=True)


def create_engine_with_fallback():
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return _build_engine(SQLITE_FALLBACK_URL)

    candidates = []
    for candidate in (raw_url, normalize_postgres_url(raw_url)):
        candidates.append(ensure_postgres_ssl(normalize_postgres_url(candidate)))

    last_error = None
    seen = set()
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)

        try:
            engine = _build_engine(candidate)
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return engine
        except OperationalError as exc:
            last_error = exc

    if last_error is not None:
        raise last_error
    raise RuntimeError("Failed to create database engine.")


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
