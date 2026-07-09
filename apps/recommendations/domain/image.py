from pydantic import BaseModel
from .labels import Label

class Image(BaseModel):
    uuid: str
    path: str
    labels: list[Label] = []
