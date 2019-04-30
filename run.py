import fire

from status_checker import usecases


def run():
    fire.Fire({
        'update': usecases.update_endpoints_availability
    })


if __name__ == '__main__':
    run()
