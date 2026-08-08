import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class TeamMemberCreate(BaseModel):
    pokemon_name: str = Field(min_length=1)
    slot_number: int = Field(ge=1, le=6)


class TeamMemberRead(BaseModel):
    id: uuid.UUID
    pokemon_id: int
    pokemon_name: str
    sprite_url: str | None
    slot_number: int

    model_config = {"from_attributes": True}


class TeamRead(BaseModel):
    id: uuid.UUID
    name: str
    created_at: datetime
    updated_at: datetime
    members: list[TeamMemberRead] = []

    model_config = {"from_attributes": True}