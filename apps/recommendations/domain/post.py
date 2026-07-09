from pydantic import BaseModel
from datetime import datetime
from .image import Image
from .labels import Label

class Post(BaseModel):
    uuid: str
    creatorUuid: str
    creatorUsername: str
    message: str
    date: datetime
    userUuidExcludeList: list[str] = []
    images :list[Image] = [],
    labels: list[Label] = []
