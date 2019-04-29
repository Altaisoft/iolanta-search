import asyncio

from status_checker.models import EndpointList, Endpoint

from status_checker.backend.datadotworld_backend import (
    fetch_endpoint_list_from_datadotworld
)
from status_checker.backend.asyncio_get_status import get_status


# The list of endpoints is sourced from a data.world dataset
# TODO I believe that's where dataset settings should be
EndpointList.backend = fetch_endpoint_list_from_datadotworld

# Fetch online status from the web
Endpoint.backend = get_status


async def get_status_values(endpoint_list: EndpointList):
    for endpoint in endpoint_list:
        return await endpoint.get_status()


def get_status_list():
    endpoint_list = EndpointList.fetch()

    loop = asyncio.get_event_loop()
    status_list = loop.run_until_complete(
        get_status_values(endpoint_list)
    )
    loop.close()

    return status_list
