from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Endpoint:
    # Endpoint URL is the unique value that identifies it
    url: str

    # Name
    name: str

    # Human language description
    description: str = ''


@dataclass(frozen=True)
class Stats:
    # Endpoint in question
    url: str

    # Is that endpoint currently accessible?
    is_online: bool

    # When was the availability checked?
    time: datetime
