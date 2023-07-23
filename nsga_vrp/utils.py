import os
import io
import fnmatch
import pandas as pd
import numpy as np
from json import load, dump
import json
import requests

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def calculate_distance(customer1, customer2):
    # Calculate distance between customer1 and customer 2 given their
    #   euclidean coordinates, returns euclidean distance
    """
    Inputs: customer1 from json object, customer2 from json object
    Outputs: Returns Euclidian distance between these customer locations.
    """
    return ((customer1['coordinates']['x'] - customer2['coordinates']['x']) ** 2 + \
            (customer1['coordinates']['y'] - customer2['coordinates']['y']) ** 2) ** 0.5


def calculate_distance_matrix(customer1, customer2):
    # Calculate distance between customer1 and customer2 using Google Maps Distance Matrix API
    """
    Inputs: customer1 from json object, customer2 from json object
    Outputs: Returns real distance between these customer locations in meters.
    """
    origin = f"{customer1['coordinates']['x']},{customer1['coordinates']['y']}"
    destination = f"{customer2['coordinates']['x']},{customer2['coordinates']['y']}"
    api_key = 'AIzaSyCSecAtIYaUH83SI5m1Eo8__U1tJGTddfU'  
    # AIzaSyCSecAtIYaUH83SI5m1Eo8__U1tJGTddfU

    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)

    # Extract the distance value from the API response
    distance = data['rows'][0]['elements'][0]['distance']['value']
    print(distance/1000)
    return (distance / 1000)

def convertcsv2json():
    """
    Inputs : None
    Outputs: Reads the *.csv file in text directory and converts in to
             *.json file in json directory.
    """
    print(f'base directory is {BASE_DIR}')
    text_dir = os.path.join(BASE_DIR, 'data', 'csv')
    json_dir = os.path.join(BASE_DIR, 'data', 'json')
    print(f'csv_dir is {text_dir}')
    print(f'json_dir is {json_dir}')

    #Initialize depot 
    depot = [2.0439838562244534 , 103.36281663722052]

    #Initialize landfill
    landfill = [1.7802932217578695, 103.87691425955107]
    

    #Initialize max vehicle number allowed 
    max_vehicle_number = 20

    #Initialize max vehicle capacity
    vehicle_capacity = 15000.0

    # Initialize instance name 
    instance_name = 'Test'
        
    data = pd.read_csv("dataset/Data.csv")
    customers_coordinate = data["coordinates"].str.split(",", expand=True).astype(float).to_numpy()
    demand = data["demand"].astype(float).to_numpy()
    
    total_customer = len(customers_coordinate)
    # print(len(customers_coordinate))
    json_data = {}

    json_data['Number_of_customers'] = total_customer

    print(total_customer)

    print(customers_coordinate)

    for i in range (total_customer):
         print(demand[i])
    for i in range (total_customer):
        json_data[f'customer_{i+1}'] = {
                            'coordinates': {
                                'x': customers_coordinate[i][0],
                                'y': customers_coordinate[i][1],
                            },
                            'demand': demand[i],
                            'ready_time': float(0),
                            'due_time': float(0),
                            'service_time': float(10),
                        }

    json_data['depart'] =  {
        'coordinates': {
            'x': depot[0] ,
            'y': depot[1] , 
        },
        'demand' :  0.0,
        'due_time' : 0.0,
        'ready_time' : 0.0 ,
        'service_time' : 0.0,
    }
    json_data['landfill'] =  {
        'coordinates': {
            'x': landfill[0] ,
            'y': landfill[1] , 
        },
        'demand' :  0.0,
        'due_time' : 0.0,
        'ready_time' : 0.0 ,
        'service_time' : 0.0,
    }
    # print(f'Number of customers is {numCustomers}')
    customers = ['depart'] + [f'customer_{x}' for x in range(1, total_customer + 1)] + ['landfill']
    # print(customers)

    # Writing the distance_matrix
    json_data['distance_matrix'] = [[calculate_distance_matrix(json_data[customer1], \
                                                        json_data[customer2]) for customer1 in customers] for
                                    customer2 in customers]

    json_data['instance_name'] = instance_name
    json_data['max_vehicle_number'] = int(max_vehicle_number)
    json_data['vehicle_capacity'] = float(vehicle_capacity)

    # print(json_data)
    # file_path = "data/json/"f{json_data['instance_name']}.json""
    file_path = os.path.join(json_dir, f"{json_data['instance_name']}.json")


    #Calculate distance matrix using google maps distance matrix API.

    with io.open(file_path, "w") as file:
        json_file_name = f"{json_data['instance_name']}.json"
        json_file = os.path.join(json_dir, json_file_name)
        print(f'Write to file: {json_file}')

        json.dump(json_data, file)
        
        print('file updated')

    # print(customers_coordinate)

# def converttext2json():
#     """
#     Inputs : None
#     Outputs: Reads the *.txt file in text directory and converts in to
#              *.json file in json directory.
#     """
#     print(f'base directory is {BASE_DIR}')
#     text_dir = os.path.join(BASE_DIR, 'data', 'text')
#     json_dir = os.path.join(BASE_DIR, 'data', 'json')
#     print(f'text_dir is {text_dir}')
#     print(f'json_dir is {json_dir}')

#     for text_file in map(lambda text_filename: os.path.join(text_dir, text_filename), \
#                          fnmatch.filter(os.listdir(text_dir), '*.txt')):
#         print(text_file)
#         json_data = {}
#         numCustomers = 0
#         with io.open(text_file, 'rt', newline='') as file_object:
#             for line_count, line in enumerate(file_object, start=1):
#                 # print(f'line_count is {line_count}')
#                 # print(f'line is {line}')

#                 if line_count in [2, 3, 4, 6, 7, 8, 9]:
#                     pass

#                 # Instance name details, input text file name
#                 elif line_count == 1:
#                     json_data['instance_name'] = line.strip()

#                 # Vehicle capacity and max vehicles details
#                 elif line_count == 5:
#                     values = line.strip().split()
#                     json_data['max_vehicle_number'] = int(values[0])
#                     json_data['vehicle_capacity'] = float(values[1])

#                 # Depot details
#                 elif line_count == 10:
#                     # This is depot
#                     values = line.strip().split()
#                     json_data['depart'] = {
#                         'coordinates': {
#                             'x': float(values[1]),
#                             'y': float(values[2]),
#                         },
#                         'demand': float(values[3]),
#                         'ready_time': float(values[4]),
#                         'due_time': float(values[5]),
#                         'service_time': float(values[6]),
#                     }

#                 # Customer details
#                 else:
#                     # Rest all are customers
#                     # print(f'line_count is {line_count}')
#                     # print(f'line is {line}')
#                     # Adding customer to number of customers
#                     numCustomers += 1
#                     values = line.strip().split()
#                     json_data[f'customer_{values[0]}'] = {
#                         'coordinates': {
#                             'x': float(values[1]),
#                             'y': float(values[2]),
#                         },
#                         'demand': float(values[3]),
#                         'ready_time': float(values[4]),
#                         'due_time': float(values[5]),
#                         'service_time': float(values[6]),
#                     }

#         # print(f'Number of customers is {numCustomers}')
#         customers = ['depart'] + [f'customer_{x}' for x in range(1, numCustomers + 1) ] + ['landfill']
#         # print(customers)

#         # Writing the distance_matrix
#         json_data['distance_matrix'] = [[calculate_distance(json_data[customer1], \
#                                                             json_data[customer2]) for customer1 in customers] for
#                                         customer2 in customers]

#         # Writing the number of customers details
#         json_data['Number_of_customers'] = numCustomers

#         # Giving filename as instance name, which is input text file name
#         json_file_name = f"{json_data['instance_name']}.json"
#         json_file = os.path.join(json_dir, json_file_name)
#         print(f'Write to file: {json_file}')

#         # Writing the json file to disk and saving it under json_customize directory
#         with io.open(json_file, 'wt', newline='') as file_object:
#             dump(json_data, file_object, sort_keys=True, indent=4, separators=(',', ': '))


if __name__ == "__main__":
    converttext2json()
