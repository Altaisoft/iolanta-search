import fire
import logging.config

from status_checker import usecases, settings


def run():
    logging.config.dictConfig(settings.LOGGING)
    fire.Fire({
        'update': usecases.update_endpoints_availability
    })


if __name__ == '__main__':
    run()
