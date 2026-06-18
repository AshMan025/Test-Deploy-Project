from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MemoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100) # ... required 
    message: str = Field(..., min_length=1)


class MemoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    message: str
    created_at: datetime
