import fire
import logging.config

from status_check import settings
from status_check.tasks import endpoints


def run():
    logging.config.dictConfig(settings.LOGGING)

    fire.Fire({
        'endpoints': {
            'list': endpoints.fetch
        }
    })


if __name__ == '__main__':
    run()
