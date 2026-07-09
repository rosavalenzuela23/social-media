from pydantic import BaseModel

class Label(BaseModel):
    uuid: str
    name: str