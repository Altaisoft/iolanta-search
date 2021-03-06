import dataclasses
import logging
import os
import time
from typing import List

import datadotworld as dw
import pandas as pd
from datadotworld.client.api import RestApiClient

from status_check import models, settings

logger = logging.getLogger(__name__)


REQUIRED_FIELDS = ['url']


def is_aws_lambda():
    """Determine if we're running in AWS Lambda"""
    return os.environ.get("AWS_EXECUTION_ENV") is not None


def server() -> dw.DataDotWorld:
    # Default FileConfig does not work in AWS because the user's home directory
    # is not writeable. FileConfig() is also not lazy, and ~/.dw is being
    # created even if the required credentials were successfully obtained
    # from EnvConfig. This might deserve a PR to datadotworld library.

    return dw.DataDotWorld(
        config=dw.EnvConfig() if is_aws_lambda() else None
    )


def fetch_dataframe() -> pd.DataFrame:
    """
    Fetch the raw endpoints dataset as Pandas dataframe and validate it
    for the required fields.
    """

    dataframe = dw.load_dataset(
        settings.DATADOTWORLD['dataset'],
        auto_update=True
    ).dataframes[
        settings.DATADOTWORLD['dataframe']
    ]

    supplied_fields = list(dataframe)

    missing_fields = set(REQUIRED_FIELDS) - set(supplied_fields)

    if missing_fields:
        raise ValueError(
            f'The provided endpoints dataset does not include required fields: '
            f'{", ".join(missing_fields)}. '
            f'Fields provided: {", ".join(supplied_fields)}'
        )

    return dataframe.fillna('')


def decode_dataframe(dataframe: pd.DataFrame) -> List[models.Endpoint]:
    """Convert raw dataframe to a list of Endpoint objects for analysis."""

    supported_fields = [
        field.name
        for field in dataclasses.fields(models.Endpoint)
    ]

    supplied_fields = list(dataframe)

    dataframe = dataframe[list(set(supported_fields) & set(supplied_fields))]

    # noinspection PyProtectedMember
    return list(
        models.Endpoint(**row._asdict())
        for row in dataframe.itertuples(index=False)
    )


def fetch() -> List[models.Endpoint]:
    """Get endpoints list"""
    return decode_dataframe(fetch_dataframe())


def submit_online_status(status_list: List[models.Status]):
    """
    After online status per every endpoint has been ascertained, submit that
    information to data.world Stream API.
    """
    logger.info('Submitting results of check to data.world...')

    api_client: RestApiClient = dw.api_client()

    for status in status_list:
        # FIXME we get error 429 here and I haven't found a way to send
        #   multiple records at a time.
        time.sleep(1)

        api_client.append_records(
            dataset_key=settings.DATADOTWORLD['dataset'],
            stream_id=settings.DATADOTWORLD['status-stream'],
            body=dataclasses.asdict(status)
        )

    return status_list
