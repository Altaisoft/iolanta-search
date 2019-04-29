import fire
from status_checker import check


def run():
    fire.Fire({
        'check': check.check
    })


if __name__ == '__main__':
    run()
