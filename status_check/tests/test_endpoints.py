import pandas as pd

from status_check import models
from status_check.tasks.endpoints import decode_dataframe


def test_decode_dataframe():
    df = pd.DataFrame(
        columns=['url', 'name', 'foo'],
        data=[
            ('https://example.com/sparql/', 'Example', 'boo')
        ]
    )

    (endpoint, ) = decode_dataframe(df)

    assert endpoint == models.Endpoint(
        url='https://example.com/sparql/',
        name='Example',
        description=''
    )
