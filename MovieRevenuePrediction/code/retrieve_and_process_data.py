import requests
import pandas as pd
import json
import config
import os
import categorical_data_encoding as cden

#WORK IN PROGRESS

#this file is to be run on a server every x amount of time to refresh the upcoming movies list

def get_upcoming_movies():

    #connects to the api and retrieves a list of upcoming movies in the US

    #request parameters
    params = {
        'language' : 'en-US',
        'page'     : 1,
        'region'   : 'US',
        'api_key'  : config.api_key
    }
    #create a request
    #TODO add status code check
    req = requests.get(url='https://api.themoviedb.org/3/movie/upcoming', params=params) 

    return(pd.DataFrame(json.loads(req.text)['results']))

def get_upcoming_movies_complete(): 

    #get upcoming movies does not retrieve: budget, production_countries, runtime, spoken_languages
    #this function completes the data set

    upcoming_movies_df = get_upcoming_movies()
    upcoming_movies_df.set_index('id', inplace=True)

    additional_data = pd.DataFrame(columns=['budget', 'production_countries', 'runtime', 'spoken_languages', 'production_companies'])
    for movie_id in upcoming_movies_df.index:

        #TODO add status code check
        req = requests.get(url=f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={config.api_key}') 

        dict = json.loads(req.text)
        df = pd.json_normalize(dict)
        df.set_index('id', inplace=True)
        df = df.loc[:,['budget', 'production_countries', 'runtime', 'spoken_languages', 'production_companies']]
        additional_data = pd.concat([additional_data, df])

    return pd.concat([upcoming_movies_df, additional_data], axis=1)

def encode_retireved_categorical_data(upcoming_movies_df: pd.DataFrame) -> pd.DataFrame:
    with open('.venv\Project\data\common_values.json') as fp:
        common_values_dict = json.load(fp)
    print(upcoming_movies_df.index)
    #retrieve genres
    genres_req = requests.get(url=f'https://api.themoviedb.org/3/genre/movie/list?api_key={config.api_key}')    
    genres = pd.read_json(genres_req.text)
    genres = pd.DataFrame(genres['genres'].to_list(), columns=['id', 'name'])
    genres.set_index('id', inplace=True)

    upcoming_movies_df['genre_ids'] = upcoming_movies_df['genre_ids'].apply(lambda id_list_str: [genres.at[id, 'name'] for id in json.loads(id_list_str)])
    upcoming_movies_df.rename(columns={'genre_ids':'genres'}, inplace=True)
    print(upcoming_movies_df['genres'])

    upcoming_movies_df = cden.binarize('genres', upcoming_movies_df)

    upcoming_movies_df['production_companies'] = extract_from_json_to_list('production_companies', 'name', upcoming_movies_df)
    upcoming_movies_df = cden.group_uncommon('production_companies', 'other_companies', common_values_dict['production_companies'], upcoming_movies_df)

    upcoming_movies_df = cden.binarize('production_companies', upcoming_movies_df)

    upcoming_movies_df['production_countries'] = extract_from_json_to_list('production_countries', 'name', upcoming_movies_df)
    upcoming_movies_df = cden.group_uncommon('production_countries', 'other_countries', common_values_dict['production_countries'], upcoming_movies_df)

    upcoming_movies_df = cden.binarize('production_countries', upcoming_movies_df)

    upcoming_movies_df['spoken_languages'] = extract_from_json_to_list('spoken_languages', 'iso_639_1', upcoming_movies_df)
    upcoming_movies_df = cden.group_uncommon('spoken_languages', 'other_languages', common_values_dict['spoken_languages'], upcoming_movies_df)

    upcoming_movies_df = cden.binarize('spoken_languages', upcoming_movies_df)

    #drop the old genre_ids column
    upcoming_movies_df.drop('genres', inplace=True, axis=1)

    #drop the old production_companies column
    upcoming_movies_df.drop('production_companies', inplace=True, axis=1)

    #drop the old production_countries column
    upcoming_movies_df.drop('production_countries', inplace=True, axis=1)

    #drop the old spoken_languages column
    upcoming_movies_df.drop('spoken_languages', inplace=True, axis=1)

    return upcoming_movies_df

def extract_from_json_to_list(column: str, value: str, data_set: pd.DataFrame):
    """ Extracts a given value from every entry in a json and put it in a list, replaces the json entry with the new list """
    return data_set[column].apply(lambda str: [kv[value] for kv in json.loads(str.replace("'",'"').replace('None', '"None"'))] if str != '[]' else [])

#upcoming_movies_df = get_upcoming_movies_complete()
#upcoming_movies_df.index.name = 'id'
#upcoming_movies_df.to_csv('.venv\Project\data\\upcoming_movies.csv', encoding='utf-8')
upcoming_movies_df = pd.read_csv('.venv\Project\data\\upcoming_movies.csv') #temporary
upcoming_movies_df.set_index('id', inplace=True)

#remove unneccessary columns
required_columns = ['budget', 'genre_ids', 'popularity',
                    'production_companies', 'production_countries', 'release_date',
                    'runtime', 'spoken_languages', 'vote_average', 'vote_count']

for column in upcoming_movies_df.columns: 
    if not required_columns.__contains__(column):
        upcoming_movies_df.drop(column, axis=1, inplace=True)

if(not os.path.exists('.venv\Project\data')):
    os.makedirs('.venv\Project\data')

upcoming_movies_df = encode_retireved_categorical_data(upcoming_movies_df)

upcoming_movies_df['release_date'] = pd.to_datetime(upcoming_movies_df['release_date'])

upcoming_movies_df['release_day_of_week'] = upcoming_movies_df['release_date'].apply(lambda date: date.dayofweek)
upcoming_movies_df['release_month'] = pd.DatetimeIndex(upcoming_movies_df['release_date']).month
upcoming_movies_df['release_year'] = pd.DatetimeIndex(upcoming_movies_df['release_date']).year

upcoming_movies_df.drop('release_date', inplace=True, axis=1)

#write the data to a file
upcoming_movies_df.to_csv('.venv\Project\data\\upcoming_movies_transformed.csv', encoding='utf-8')


#in progress