#!/usr/bin/env python3
"""Creates a KiCAD DB Lib file from an Excel Template"""

# Imports
import os
import sys
import json
from pathlib import Path
import pandas as pd

currentFilePath = Path(__file__)
currentDirectory = currentFilePath.parent
parentDirectory = currentDirectory.parent


excelTemplateName = "Structure.xlsx"
excelTemplatePath = parentDirectory / "DB Table Layout CSVs" / excelTemplateName
base_dblib_name = "clement-components.kicad_dbl"
base_dblib_path = parentDirectory / base_dblib_name
# C:\Users\Clement Hathaway\GitHub\ClementsComponents\clement-components.kicad_dbl

# Function Definitions
def load_template(excelPath):
    """Load the Excel Template for the database"""
    # Function implementation
    if excelPath.exists():
        print(f'Reading excel file: {excelPath}')
        all_sheets_dict = pd.read_excel(excelPath, sheet_name=None)
        print(f'Read {len(all_sheets_dict.keys())} tables: ')
        for tableName in all_sheets_dict.keys():
            print(tableName)

        return all_sheets_dict
    else:
        print(excelPath)
        print("File doesn't exist")

        return None

# Function to convert response to boolean
def response_to_bool(response):
    return response.strip().lower() in ['yes', 'y', 'true', 't']

def ask_preferences(name):
    questions = [
        f'Is {name} value visable on adding to the schematic? (y/n)',
        f'Is {name} visable in the part chooser column? (y/n)',
        f'Is {name} name visable on adding to the schematic? (y/n)'
    ]

    responses = []

    for question in questions:
        response = input(question)
        boolean_response = response_to_bool(response)
        responses.append(boolean_response)

    return responses

def parse_table(table):
    return table.columns.tolist()

def parse_tables(template):
    table_dict = {}
    for tableName in template.keys():
        table_dict[tableName] = parse_table(template[tableName])

    return table_dict

def generate_field(tableValue):
    pass

def generate_library(tableData):
    libraryData = {}
    libraryData["name"]       = tableData["name"]
    libraryData["table"]      = tableData["name"]
    libraryData["key"]        = tableData["fields"][0]
    libraryData["symbols"]    = tableData["fields"][1]
    libraryData["footprints"] = tableData["fields"][2]
    
    fields = []
    for field in tableData["fields"]:
        if field in ["id", "Symbol", "Footprint"]:
            continue

        fieldData = {}
        fieldData["column"] = field
        fieldData["MPN"] = field
        
        field_preferences = ask_preferences(field)
        fieldData["visible_on_add"]     = field_preferences[0]
        fieldData["visible_in_chooser"] = field_preferences[1]
        fieldData["show_name"]          = field_preferences[2]

        fields.append(fieldData)

    libraryData["fields"] = fields
    
    return libraryData

        



def load_initial_dblib():
    """Load Initial JSON File"""
    with open(base_dblib_path, 'r') as dblib_json:
        dblib_data = json.load(dblib_json)
    
    return dblib_data



# Main function
def main():
    """Do the thing"""
    # Main script logic
    print(base_dblib_path)
    dblib_json = load_initial_dblib()
    template = load_template(excelTemplatePath)
    parsed_template = parse_tables(template)

    print("Loaded Template")
    print("")

    
    firstLibName = list(parsed_template.keys())[0]
    firstLibData = parsed_template[firstLibName]
    firstLibDict = {"name": firstLibName, "fields": firstLibData}
    firstLib = generate_library(firstLibDict)
    print(firstLib)




# Main guard
if __name__ == "__main__":
    main()