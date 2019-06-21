import asyncio

from status_check import tasks


def update():
    loop = asyncio.get_event_loop()

    if loop.is_closed():
        loop = asyncio.new_event_loop()

    loop.run_until_complete(tasks.update())
    loop.close()
