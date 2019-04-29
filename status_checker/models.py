from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Tuple
import pandas as pd


@dataclass
class Endpoint:
    # Name of the endpoint
    name: str

    # Human language description
    description: str

    # Endpoint URL is required, too
    url: str

    # Extra arguments
    extra: Optional[dict] = None

    @classmethod
    def fields(cls):
        return cls.__annotations__.keys()

    @classmethod
    def create(cls, **kwargs) -> 'Endpoint':
        keys = kwargs.keys()
        
        extra_keys = set(keys) - set(cls.fields())
        extra = {key: kwargs.pop(key) for key in extra_keys}
        
        kwargs.update(extra=extra)
        return cls(**kwargs)

    @classmethod
    def from_series(cls, series: pd.Series) -> 'Endpoint':
        """Create a new instance from a Pandas dataframe row."""
        return cls.create(**series.to_dict())

    async def get_status(self) -> 'EndpointStatus':
        return await self.backend()


@dataclass
class EndpointStatus:
    # Endpoint in question
    endpoint: Endpoint

    # Is that endpoint currently accessible?
    is_online: bool

    # When was the availability checked?
    time: datetime


class EndpointList(tuple):
    """Immutable collection of SPARQL endpoints."""

    @classmethod
    def fetch(cls):
        return cls.backend()
