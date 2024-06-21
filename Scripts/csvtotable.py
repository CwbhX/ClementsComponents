## TY GPT4o
import os
import pandas as pd
import mysql.connector
from mysql.connector import Error
import argparse

# Setup argparse to handle command line arguments
parser = argparse.ArgumentParser(description="Create a MySQL table from a CSV file.")
parser.add_argument('--host', type=str, required=True, help='Database host IP address')
parser.add_argument('--database', type=str, required=True, help='Database name')
parser.add_argument('--user', type=str, required=True, help='Database user')
parser.add_argument('--password', type=str, required=True, help='Database password')
parser.add_argument('--csv', type=str, required=True, help='Path to the CSV file')

args = parser.parse_args()

# Load the CSV file into a DataFrame
csv_file_path = args.csv
df = pd.read_csv(csv_file_path)

# Extract the table name from the CSV file name (without the extension)
table_name = os.path.splitext(os.path.basename(csv_file_path))[0].replace(" ", "_")

# Remove non-numeric entries from the `id` column
if 'id' in df.columns:
    df = df[pd.to_numeric(df['id'], errors='coerce').notnull()]

# Infer data types and create a table schema
def infer_sql_dtype(value):
    if isinstance(value, int):
        return 'INT'
    elif isinstance(value, float):
        return 'FLOAT'
    elif isinstance(value, bool):
        return 'BOOLEAN'
    else:
        return 'TEXT'

# Use the first valid data row to infer the data types if the DataFrame is not empty
if not df.empty:
    first_valid_row = df.iloc[0]
    column_defs = ", ".join([f"`{col}` {infer_sql_dtype(first_valid_row[col])}" for col in df.columns if col != 'id'])
else:
    column_defs = ", ".join([f"`{col}` TEXT" for col in df.columns if col != 'id'])  # Default to TEXT if no data rows


# Create the table creation query based on whether 'id' column exists

create_table_query = f"""
CREATE TABLE IF NOT EXISTS `{table_name}` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    {column_defs}
);
"""

# Log the SQL query
print(f"Executing SQL query: {create_table_query}")

# Create a connection to the MySQL database
try:
    connection = mysql.connector.connect(
        host=args.host,
        user=args.user,
        password=args.password,
        database=args.database
    )

    if connection.is_connected():
        cursor = connection.cursor()

        # Execute the query to create the table
        cursor.execute(create_table_query)
        connection.commit()

        print(f"Table '{table_name}' created successfully in the database '{args.database}'")

except Error as e:
    print(f"Error: {e}")
finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
        print("MySQL connection is closed")


