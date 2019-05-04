import logging

from aiohttp import ClientConnectorError

from status_checker.models import Endpoint, EndpointStatus
from datetime import datetime
import aiohttp


logger = logging.getLogger(__name__)


async def get_status(endpoint: Endpoint) -> EndpointStatus:
    logger.info('Sending request to: %s', endpoint.url)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint.url) as response:
                is_online = (response.status == 200)

    except ClientConnectorError:
        is_online = False

    return EndpointStatus(
        endpoint=endpoint,
        is_online=is_online,
        time=datetime.now()
    )
