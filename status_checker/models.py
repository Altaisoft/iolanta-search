from datetime import datetime
from typing import Optional, List

import pandas as pd
from dataclasses import dataclass

from cleany import Backend


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

    def to_dict(self) -> dict:
        return {
            'url': self.endpoint.url,
            'is_online': self.is_online,
            'time': str(self.time)
        }


class StatusList(list):
    __backend__ = Backend()

    async def submit(self):
        return self.__backend__()


class EndpointList(list):
    """Immutable collection of SPARQL endpoints."""
    __backend__ = Backend()

    @classmethod
    def fetch(cls):
        return cls.__backend__.fetch()

    async def get_status_list(self) -> List[EndpointStatus]:
        """
        Check the status of every endpoint in this list
        and return a list of statuses for them
        """

        return await self.__backend__.get_status_list(self)

