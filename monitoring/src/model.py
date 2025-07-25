from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
import time


class BaseDynamoModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

    def to_dynamo(self) -> dict:
        return self.model_dump(mode="json")


class Session(BaseModel):
    sessionId: str
    start: int
    end: Optional[int] = None


class UserActivity(BaseDynamoModel):
    USER_ID: str
    firstSeen: int = Field(default_factory=lambda: int(time.time()))
    lastSeen: int = Field(default_factory=lambda: int(time.time()))
    sessions: List[Session] = Field(default_factory=list)
