#!/usr/bin/env python3
"""Creates a KiCAD DB Lib file from an Excel Template"""

# Imports
import os
import sys
import json
import copy
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

def ask_preferences(libraryName, fieldName):
    questions = [
        f'For {libraryName}, is \'{fieldName}\'s value visable on the schematic? (y/n)',
        f'For {libraryName}, is \'{fieldName}\' visable in the part chooser column? (y/n)',
        f'For {libraryName}, is \'{fieldName} also visable on the schematic? (y/n)'
    ]

    responses = []

    for question in questions:
        ## If I answered No to the first question, the 3rd question is redudant
        if responses:
            if responses[0] == False and len(responses) >= 2:
                responses.append(False)
                continue
                
        response = input(question)
        boolean_response = response_to_bool(response)
        responses.append(boolean_response)

    return responses

def ask_value_field(libraryName, libraryFields):
    question = f'For {libraryName}, enter which library field index should be the part\'s value: '
    print(f"--------{libraryName} Fields --------")
    for idx, field in enumerate(libraryFields):
        print(f"{idx}: {field}")
    
    while True:
        response = input(question)
        if not response:
            print("Defaulting to MPN!")
            return 3 ## AKA the MPN
        elif response.isdigit() and int(response) > 0:
            return int(response)
        else:
            print(f"{response} is not a valid answer, please enter the index of the {libraryName}\'s value.")


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
    libraryData["key"]        = tableData["fields"][3] ## How it indexes in the KiCAD viewer. It should be MPN instead of an incrementing int
    libraryData["symbols"]    = tableData["fields"][1]
    libraryData["footprints"] = tableData["fields"][2] ## Will need to support multiple footprints at somepoint
    
    fields = []

    ## Define the value field
    valueFieldData = {}
    valueFieldData["column"] = tableData["fields"][ask_value_field(tableData["name"], tableData["fields"])] ## Returns the index of the field we want to be the value and then gets that value from the fields dict
    valueFieldData["name"] = "Value"

    valueFieldData["visible_on_add"]     = True
    valueFieldData["visible_in_chooser"] = True
    valueFieldData["show_name"]          = False

    fields.append(valueFieldData) ## Add the Value field to the fields first!


    for field in tableData["fields"]:
        ## Ignore non-field data
        if field in ["id", "Symbol", "Footprint", "Description", "Footprint Filters", "Keywords", "No BOM", "Schematic Only", "Datasheet"]:
            continue

        fieldData = {}
        fieldData["column"] = field
        fieldData["name"] = field
        
        if field == valueFieldData["column"]: ## Ignore the case where we are asking about the set Value, since we don't want to show it on the schematic twice
            fieldData["visible_on_add"]     = False
            fieldData["visible_in_chooser"] = True
            fieldData["show_name"]          = False
        
        elif field in ["Distributer PN", "Price"]: ## We never want these on the schematic tbh
            fieldData["visible_on_add"]     = False
            fieldData["visible_in_chooser"] = False
            fieldData["show_name"]          = False

        else: ## If the Value field is not MPN, then ask about it OR if we are not asking about MPN field
            field_preferences = ask_preferences(tableData["name"], field)
            fieldData["visible_on_add"]     = field_preferences[0]
            fieldData["visible_in_chooser"] = field_preferences[1]
            fieldData["show_name"]          = field_preferences[2]


        fields.append(fieldData) ## Add all the newly created fields of this library

    libraryData["fields"] = fields ## Add it to the libraryData

    ## Hard coding this because it's not worth the effort right now to not to
    libraryProperties = {
        "description": "Description",
        "footprint_filters": "Footprint Filters",
        "keywords": "Keywords",
        "exclude_from_bom": "No BOM",
        "exclude_from_board": "Schematic Only"
    }

    libraryData["properties"] = libraryProperties

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
    dblib_json = load_initial_dblib()            ## Load the initial JSON file that we will append to
    template = load_template(excelTemplatePath)  ## Load the excel file into a Pandas dataframe
    parsed_tables = parse_tables(template)       ## Returns the tables in a dictionary with the table names being the key

    print("Loaded Template")
    print("")

    parsed_libraries = []
    for library in parsed_tables:
        libName = library
        libData = parsed_tables[library]

        generatedLib = generate_library({
            "name": libName,
            "fields": libData
        })

        parsed_libraries.append(generatedLib)
        print("")
        print(f'Added {library}!')
        print("")


    jsonData = copy.deepcopy(dblib_json)
    jsonData['libraries'].clear() ## Clear the list of libraries, probably dont need this tbh
    jsonData['libraries'] = parsed_libraries

    finishedFilePath = "config_test.json"

    with open(finishedFilePath, 'w') as jsonfile:
        json.dump(jsonData, jsonfile, indent=4)
        print("Dumped a phat JSON")


# Main guard
if __name__ == "__main__":
    main()