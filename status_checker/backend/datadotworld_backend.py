import datadotworld as dw
from status_checker import models, settings


class Backend:
    model_class: type


def fetch_endpoint_list_from_datadotworld():
    dataframe = dw.load_dataset(
        settings.DATADOTWORLD['dataset']
    ).dataframes[
        settings.DATADOTWORLD['dataframe']
    ]

    return models.EndpointList([
        models.Endpoint.from_series(row)
        for _, row in dataframe.iterrows()
    ])
