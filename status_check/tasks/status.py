import logging
from datetime import datetime

import aiohttp
from aiohttp import ClientConnectorError

from status_check import models

logger = logging.getLogger(__name__)


async def get_status(endpoint: models.Endpoint) -> models.Status:
    logger.info('Sending request to: %s', endpoint.url)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint.url) as response:
                is_online = (response.status == 200)

    except ClientConnectorError:
        is_online = False

    return models.Status(
        endpoint=endpoint,
        is_online=is_online,
        time=datetime.now()
    )
