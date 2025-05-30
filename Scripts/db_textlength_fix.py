## Written by GPT-4 don't judge me, I just needed to fix the db error lol
## Run like: python db_textlength_fix.py --host YourIP --database YourDatabaseName --user YourUsername --password YourPassword

import argparse
import mysql.connector
from mysql.connector import Error

def modify_tables(database_name, user, password, host):
    try:
        # Connect to the database
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database_name
        )

        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"Connected to MySQL Server version {db_info}")
            cursor = connection.cursor()
            
            # Retrieve all table names in the database
            cursor.execute(f"SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '{database_name}';")
            tables = cursor.fetchall()
            
            # Loop through all tables and modify the 'Datasheet' and 'Description' columns
            for (table_name,) in tables:
                for column in ['Datasheet', 'Description', 'Footprint', 'Keywords']:
                    try:
                        # Check if the column exists in the table
                        cursor.execute(f"SHOW COLUMNS FROM `{table_name}` LIKE '{column}';")
                        result = cursor.fetchone()
                        if result:
                            if column == 'Footprint':
                                alter_query = f"ALTER TABLE `{table_name}` MODIFY COLUMN `{column}` VARCHAR(255);"
                            else:
                                alter_query = f"ALTER TABLE `{table_name}` MODIFY COLUMN `{column}` TEXT;"
                            cursor.execute(alter_query)
                            connection.commit()
                            print(f"Column {column} in table {table_name} modified successfully.")
                    except Error as e:
                        print(f"Error occurred while modifying column {column} in table {table_name}: {e}")

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def main():
    parser = argparse.ArgumentParser(description="Modify 'Datasheet' and 'Description' columns in all tables to TEXT type.")
    parser.add_argument('--host', type=str, required=True, help='Database host IP address')
    parser.add_argument('--database', type=str, required=True, help='Database name')
    parser.add_argument('--user', type=str, required=True, help='Database user')
    parser.add_argument('--password', type=str, required=True, help='Database password')
    
    args = parser.parse_args()

    modify_tables(args.database, args.user, args.password, args.host)

if __name__ == "__main__":
    main()
