def json_to_list_genres(data_set: pd.DataFrame):
    #transforms the json type data in the dataset to a list type that can be used in a MultiLabelBinarizer

    #extract genre_ids from a json type list of dictionaries in the shape of: [{""id"" : value, ""name"" : ""value""},...]
    data_set['genres'] = extract_from_json_to_list('genres', 'id', data_set)
    #rename the genres column to better describe the data
    data_set.rename(columns={'genres' : 'genre_ids'}, inplace=True)
    return data_set

def json_to_list_companies(data_set: pd.DataFrame):    
    #change format from json to list

    #data_set['production_companies'] = data_set['production_companies'].apply(lambda jsonstr: [kv['name'] for kv in json.loads(jsonstr)] if jsonstr != '[]' else [])
    data_set['production_companies'] = extract_from_json_to_list('production_companies', 'name', data_set)
   
    #handle infrequent companies
    common_companies = find_common_values('production_companies', 0.75, data_set)

    
    """ company_occurance = {}
    #create a company_name - company occurance in data set: dictionary
    for companies in data_set['production_companies']:
        for company in companies:
            if not company in company_occurance.keys():
                company_occurance[company] = 0
            company_occurance[company] += 1

    common_companies = []
    
    #find companies that occur more commonly
    for key in company_occurance.keys():
        occurance = (company_occurance[key]/len(data_set.index))*100
        #given the occurance limit of 0.75% the coverage of the data set by the selected production companies is just under 70%
        #THIS PERCENTAGE SHOULD BE EXPERIMENTED WITH TO INCREASE MODEL PREFORMANCE
        if(occurance > 0.75):
            common_companies.append(key)
            #print(key + ': ' + str(company_occurance[key]) + ' - ' + str(occurance))
            #num_of_companies += 1
            #coverage += occurance """

    #group uncommon companies into a single category named 'other_companies'
    for companies in data_set['production_companies']:
        copy_companies = copy.deepcopy(companies)
        for company in copy_companies:
            if company not in common_companies:
                companies.remove(company)
                if 'other_companies' not in companies:
                    companies.append('other_companies')
    return data_set

def json_to_list_countries(data_set: pd.DataFrame):

    #change format from json to list
    data_set['production_countries'] = data_set['production_countries'].apply(lambda jsonstr: [kv['name'] for kv in json.loads(jsonstr)] if jsonstr != '[]' else [])

    #handle infrequent countries
  
    country_occurance = {}
    #create a countries_name - company occurance in data set: dictionary
    for countries in data_set['production_countries']:
        for country in countries:
            if not country in country_occurance.keys():
                country_occurance[country] = 0
            country_occurance[country] += 1

    common_countries = []
      
    #find countries that occur more commonly
    for key in country_occurance.keys():
        occurance = (country_occurance[key]/len(data_set.index))*100

        #THIS PERCENTAGE SHOULD BE EXPERIMENTED WITH TO INCREASE MODEL PREFORMANCE
        if(occurance > 0.5):
            common_countries.append(key)

    #group uncommon countries into a single category named 'other_countries'
    for countries in data_set['production_countries']:
        copy_countries = copy.deepcopy(countries)
        for country in copy_countries:
            if country not in common_countries:
                countries.remove(country)
                if 'other_countries' not in countries:
                    countries.append('other_countries')
    return data_set

def json_to_list_spoken_languages(data_set: pd.DataFrame):
    #change format from json to list
    data_set['spoken_languages'] = data_set['spoken_languages'].apply(lambda jsonstr: [kv['iso_639_1'] for kv in json.loads(jsonstr)] if jsonstr != '[]' else [])

    #handle infrequent languages
    language_occurance = {}
    #create a languages_ISO - language occurance in data set: dictionary
    for languages in data_set['spoken_languages']:
        for language in languages:
            if not language in language_occurance.keys():
                language_occurance[language] = 0
            language_occurance[language] += 1

    common_languages = []
    
    #find languages that occur more commonly
    for key in language_occurance.keys():
        occurance = (language_occurance[key]/len(data_set.index))*100

        #THIS PERCENTAGE SHOULD BE EXPERIMENTED WITH TO INCREASE MODEL PREFORMANCE
        if(occurance > 0.5):
            common_languages.append(key)

    #group uncommon languages into a single category named 'other_languages'
    for languages in data_set['spoken_languages']:
        copy_languages = copy.deepcopy(languages)
        for language in copy_languages:
            if language not in common_languages:
                languages.remove(language)
                if 'other_languages' not in languages:
                    languages.append('other_languages')
    return data_set

""" def json_to_list(data_set):
    data_set = json_to_list_genres(data_set)
    data_set = json_to_list_companies(data_set)
    data_set = json_to_list_countries(data_set)
    data_set = json_to_list_spoken_languages(data_set)
    return data_set """

""" data_set = pd.read_csv('.venv\Project\data\\tmdb_5000_movies.csv')
data_set.set_index('id', inplace=True)

#select only the wanted features from the data_set
feature_names = ['budget', 'revenue', 'genres', 'popularity', 
                'production_companies', 'production_countries', 'release_date', 'runtime', 
                'spoken_languages', 'vote_average', 'vote_count',
                'title_num_of_words']

for column in data_set.columns:
    if not feature_names.__contains__(column):
        data_set.drop(column, axis=1, inplace=True)

#retrieve the list of all possible genres

genres_req = requests.get(url=f'https://api.themoviedb.org/3/genre/movie/list?api_key={config.api_key}')
genres = pd.read_json(genres_req.text)
genres = pd.DataFrame(genres['genres'].to_list(), columns=['id', 'name'])

data_set = json_to_list(data_set)
data_set = process_data(data_set) """