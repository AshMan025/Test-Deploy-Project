import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Memory
from app.schemas import MemoryCreate, MemoryRead

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Memory Wall API", version="1.0.0")

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/memories", response_model=list[MemoryRead])
def list_memories(db: Session = Depends(get_db)):
    return db.query(Memory).order_by(Memory.created_at.desc()).all()


@app.post("/api/memories", response_model=MemoryRead, status_code=201)
def create_memory(payload: MemoryCreate, db: Session = Depends(get_db)):
    memory = Memory(name=payload.name.strip(), message=payload.message.strip())
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory
