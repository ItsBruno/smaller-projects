import requests
import config
import pandas as pd
import json


""" genres_req = requests.get(url=f'https://api.themoviedb.org/3/genre/movie/list?api_key={config.api_key}')
df = pd.read_json(genres_req.text)
df = pd.DataFrame(df['genres'].to_list(), columns=['id', 'name'])
df.set_index('id', inplace=True)
print(type(df['name'])) """
