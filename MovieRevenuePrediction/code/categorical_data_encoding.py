import pandas as pd
import json
import copy
from sklearn.preprocessing import MultiLabelBinarizer

common_values_dict = {}

def encode_data(data_set : pd.DataFrame):
    """ processes the data into a shape usable in an ml model """

    data_set['genres'] = extract_from_json_to_list('genres', 'name', data_set)
    #print(data_set['genres'])

    data_set = binarize('genres', data_set)

    data_set['production_companies'] = extract_from_json_to_list('production_companies', 'name', data_set)
    common_companies = find_common_values('production_companies', 1, data_set)
    data_set = group_uncommon('production_companies', 'other_companies', common_companies, data_set)

    data_set = binarize('production_companies', data_set)
    count_instances('other_companies', 1, data_set)

    data_set['production_countries'] = extract_from_json_to_list('production_countries', 'name', data_set)
    common_countries = find_common_values('production_countries', 0.6, data_set)
    data_set = group_uncommon('production_countries', 'other_countries', common_countries, data_set)

    data_set = binarize('production_countries', data_set)
    count_instances('other_countries', 1, data_set)

    data_set['spoken_languages'] = extract_from_json_to_list('spoken_languages', 'iso_639_1', data_set)
    common_languages = find_common_values('spoken_languages', 0.6, data_set)
    data_set = group_uncommon('spoken_languages', 'other_languages', common_languages, data_set)

    data_set = binarize('spoken_languages', data_set)
    count_instances('other_languages', 1, data_set)

    #drop the old genre_ids column
    data_set.drop('genres', inplace=True, axis=1)

    #drop the old production_companies column
    data_set.drop('production_companies', inplace=True, axis=1)

    #drop the old production_countries column
    data_set.drop('production_countries', inplace=True, axis=1)

    #drop the old spoken_languages column
    data_set.drop('spoken_languages', inplace=True, axis=1)

    data_set['release_date'] = pd.to_datetime(data_set['release_date'])

    data_set['release_day_of_week'] = data_set['release_date'].apply(lambda date: date.dayofweek)
    data_set['release_month'] = pd.DatetimeIndex(data_set['release_date']).month
    data_set['release_year'] = pd.DatetimeIndex(data_set['release_date']).year

    data_set.drop('release_date', inplace=True, axis=1)
    print(len(data_set.columns))
    print("Ratio of features to samples = 1 : " + str(len(data_set.index)/len(data_set.columns)))
    commonValuesToJson()
    return data_set


def commonValuesToJson():
    with open('C:\Python\Project\Project\data\common_values.json', 'w') as fp:
        json.dump(common_values_dict, fp)

def binarize(column: str, data_set: pd.DataFrame):
    '''One hot encode the categorical data'''

    mlb = MultiLabelBinarizer()
    #use MultiLabelBinarizer to one hot encode the feature
    bin = mlb.fit_transform([x for x in data_set[column]])
    #merge the data_set with the newly encoded fetures
    return pd.concat([data_set, pd.DataFrame(bin, index = data_set.index, columns=mlb.classes_)], axis=1)
    

def extract_from_json_to_list(column: str, value: str, data_set: pd.DataFrame):
    """ Extracts a given value from every entry in a json and put it in a list, replaces the json entry with the new list """
    print(type(data_set[column]))
    return data_set[column].apply(lambda str: [kv[value] for kv in json.loads(str)] if str != '[]' else [])

def find_common_values(column: str, occurance_threshold: int, data_set: pd.DataFrame) -> list:
    """ Finds values that satisfy a certain level of occurance in the data set\n
    Assumes that a value can appear only once in a given row """

    value_occurance = {}

    #create a (value) : (value occurance in data set) dictionary
    for value_list in data_set[column]:
        for value in value_list:
            if not value in value_occurance.keys():
                value_occurance[value] = 0
            value_occurance[value] += 1

    common_values = []
    
    #find values that occur more commonly
    for key in value_occurance.keys():
        occurance = (value_occurance[key]/len(data_set.index))*100
        #occurance_threshold SHOULD BE EXPERIMENTED WITH TO INCREASE MODEL PREFORMANCE
        if(occurance > occurance_threshold):
            common_values.append(key)
            #print(key + ': ' + str(company_occurance[key]) + ' - ' + str(occurance))
            #num_of_companies += 1
            #coverage += occurance
        
    common_values_dict[column] = common_values

    return common_values

def group_uncommon(column: str, grouped_column_name: str, common_values: list, data_set: pd.DataFrame):
    '''Replaces all values of the dataset that are present in the common_values list with the value specified in grouped_column_name'''

    for values in data_set[column]:
        copy_values = copy.deepcopy(values)
        for value in copy_values:
            if value not in common_values:
                values.remove(value)
                if grouped_column_name not in values:
                    values.append(grouped_column_name)
    
    return data_set

def count_instances(column: str, value, data_set: pd.DataFrame):
    '''Counts the instances of a given value in a column'''

    print(f"Number of occurances of the value {value} in column {column}: " + str((data_set[column] == value).sum()))
    print(f"Number of occurances of the value 0 in column {column}: " + str((data_set[column] == 0).sum()) + '\n')
    
