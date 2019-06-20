from status_check import commands, settings
import logging.config


def lambda_handler(event, context):
    logging.config.dictConfig(settings.LOGGING)

    commands.update()
