from .endpoints import fetch, submit_online_status
from .status import get_status, get_all_statuses


async def update():
    endpoints = fetch()

    statuses = await get_all_statuses(endpoints)

    submit_online_status(statuses)
