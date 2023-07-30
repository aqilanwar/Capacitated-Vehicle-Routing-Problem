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

def convertcsv2json(csv_path):
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
    address_depot = "SWM Environment, Lot 4836MK, Jalan Padang Tembak, 86000 Kluang, Johor"

    #Initialize landfill
    landfill = [1.7802932217578695, 103.87691425955107]
    address_landfill = "Tapak Pelupusan Sisa Pepejal, 91, Mukim, 81900 Kota Tinggi, Johor"
    

    #Initialize max vehicle number allowed 
    max_vehicle_number = 20

    #Initialize max vehicle capacity
    vehicle_capacity = 15000.0

    # Initialize instance name 
    instance_name = 'Input_Data'
        
    # data = pd.read_csv("dataset/Data.csv")
    data = pd.read_csv(csv_path)
    customers_coordinate = data["coordinates"].str.split(",", expand=True).astype(float).to_numpy()
    demand = data["demand"].astype(float).to_numpy()
    address = data["address"] 

    total_customer = len(customers_coordinate)
    # print(len(customers_coordinate))
    json_data = {}

    json_data['Number_of_customers'] = total_customer

    print(total_customer)

    print(customers_coordinate)

    # for i in range (total_customer):
    #      print(demand[i])
    for i in range (total_customer):
        json_data[f'customer_{i+1}'] = {
                            'coordinates': {
                                'x': customers_coordinate[i][0],
                                'y': customers_coordinate[i][1],
                            },
                            'demand': demand[i],
                            'ready_time': float(0),
                            'due_time': float(0),
                            'service_time': float(0),
                            'address': address[i],
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
        'address': address_depot
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
        'address': address_landfill
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
        # Save the printed details to a JSON file

    with open("static/Input_Data.json", "w") as file:
        json.dump(json_data, file, indent=4)


if __name__ == "__main__":
    convertcsv2json()
