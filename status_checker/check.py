from datetime import datetime

import pandas as pd
import datadotworld as dw
import requests

from status_checker import models, settings, usecases
from status_checker.usecases import update_endpoints_availability


def get_dataframe() -> pd.DataFrame:
    dataframe = dw.load_dataset(
        settings.DATADOTWORLD['dataset']
    ).dataframes[
        settings.DATADOTWORLD['dataframe']
    ]

    return dataframe


def check_online_status(row: pd.Series) -> bool:
    response = requests.get(row.url)
    return response.status_code == 200


def ping(dataframe: pd.DataFrame) -> pd.DataFrame:
    """Check online status for each of the data sources."""
    dataframe['is_online'] = dataframe.apply(
        check_online_status,
        axis=1
    )
    return dataframe


def check():
    print(update_endpoints_availability())