from unittest import mock

from status_check import commands


async def fake_update():
    pass


def test_update_event_loop_persistence():
    """Confirm that, if run twice, commands.update() will not crash."""
    # This is important for AWS Lambda environment.

    with mock.patch('status_check.tasks.update', fake_update):
        commands.update()
        commands.update()
