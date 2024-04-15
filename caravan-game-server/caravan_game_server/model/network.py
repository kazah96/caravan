from pydantic import BaseModel


class NetworkPayload(BaseModel):
    name: str
    data: dict
