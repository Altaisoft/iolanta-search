import logging.config

import fire

from status_check import settings, commands
from status_check.tasks import endpoints


def run():
    logging.config.dictConfig(settings.LOGGING)

    fire.Fire({
        'endpoints': {
            'list': endpoints.fetch
        },
        'update': commands.update
    })


if __name__ == '__main__':
    run()
