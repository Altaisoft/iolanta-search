import asyncio
import logging
from datetime import datetime
from typing import List

import aiohttp
from aiohttp import ClientConnectorError

from status_check import models

logger = logging.getLogger(__name__)


CONCURRENCY = 10


async def get_status(endpoint: models.Endpoint) -> models.Status:
    logger.info('Sending request to: %s', endpoint.url)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint.url) as response:
                is_online = (response.status == 200)

    except ClientConnectorError:
        is_online = False

    return models.Status(
        url=endpoint.url,
        is_online=is_online,
        time=datetime.now()
    )


async def get_all_statuses(endpoints: List[models.Endpoint]):
    """Update all endpoints in parallel"""

    # TODO split endpoints into chunks by CONCURRENCY.

    return await asyncio.gather(*[
        get_status(endpoint)
        for endpoint in endpoints
    ])
