from status_checker.models import Endpoint, EndpointStatus
from datetime import datetime
import aiohttp


async def get_status(endpoint: Endpoint) -> EndpointStatus:
    async with aiohttp.ClientSession() as session:
        async with session.get(endpoint.url) as response:
            is_online = (response.status == 200)

    return EndpointStatus(
        endpoint=endpoint,
        is_online=is_online,
        time=datetime.now()
    )
