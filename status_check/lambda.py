from .commands import update


def lambda_handler(event, context):
    update()
