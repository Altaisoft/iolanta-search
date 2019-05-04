import json

import datadotworld as dw
import time
from datadotworld.client.api import RestApiClient

from status_checker import models, settings
from status_checker.models import StatusList


class Backend:
    model_class: type


def fetch_endpoint_list_from_datadotworld():
    dataframe = dw.load_dataset(
        settings.DATADOTWORLD['dataset'],
        auto_update=True
    ).dataframes[
        settings.DATADOTWORLD['dataframe']
    ]

    return models.EndpointList([
        models.Endpoint.from_series(row)
        for _, row in dataframe.iterrows()
    ])


def submit_status_list_to_datadotworld_stream(status_list: StatusList):
    api_client: RestApiClient = dw.api_client()

    for status in status_list:
        # FIXME we get error 429 here and I haven't found a way to send
        # multiple records at a time.
        time.sleep(1)
        api_client.append_records(
            dataset_key=settings.DATADOTWORLD['dataset'],
            stream_id=settings.DATADOTWORLD['status-stream'],
            body=status.to_dict()
        )

    return status_list
