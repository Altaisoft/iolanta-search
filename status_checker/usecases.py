import asyncio

from cleany.injection import backend
from status_checker.models import EndpointList, Endpoint, StatusList

from status_checker.backend.datadotworld_backend import (
    fetch_endpoint_list_from_datadotworld,
    submit_status_list_to_datadotworld_stream
)

from status_checker.backend.asyncio_get_status import get_status


@backend(EndpointList)
class EndpointListBackend:
    CHUNK_SIZE = 3

    @classmethod
    def fetch(cls):
        return fetch_endpoint_list_from_datadotworld()

    @classmethod
    async def get_status_list(cls, endpoint_list: EndpointList):
        rest = endpoint_list
        status_list = StatusList()

        while rest:
            chunk, rest = (
                rest[:cls.CHUNK_SIZE],
                rest[cls.CHUNK_SIZE:]
            )

            status_list.extend(await asyncio.gather(*[
                endpoint.get_status()
                for endpoint in chunk
            ]))

        return status_list


# Fetch online status from the web
Endpoint.backend = get_status

# Oh damn it.
StatusList.__backend__ = submit_status_list_to_datadotworld_stream


async def async_update_endpoints_availability():
    endpoint_list = EndpointList.fetch()
    status_list = await endpoint_list.get_status_list()
    return await status_list.submit()


def update_endpoints_availability():
    """
    Fetch a list of SPARQL endpoints, get availability status
    for each of them and store it somewhere.
    """

    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(
        async_update_endpoints_availability()
    )
    loop.close()

    return result
