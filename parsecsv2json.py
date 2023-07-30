import argparse
from nsga_vrp.utils import *

def main(csv_path):
    convertcsv2json(csv_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert CSV to JSON.")
    parser.add_argument("csv_path", help="Path to the CSV file.")
    args = parser.parse_args()

    main(args.csv_path)