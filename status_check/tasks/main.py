from .endpoints import fetch, submit_online_status
from .status import get_status


async def update():
    endpoints = fetch()

    # FIXME this is synchronous, need to optimize
    statuses = [
        await get_status(endpoint=endpoint)
        for endpoint in endpoints
    ]

    submit_online_status(statuses)
