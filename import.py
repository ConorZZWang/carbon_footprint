import pandas as pd
import sqlite3

def import_data_to_sqlite(excel_file, db_file):
    """
    Reads data from the Excel file and populates four tables in a SQLite database:
    
    1. he311_concord:
       - Columns [C, D, E] → indexes [2,3,4]
       - Renamed to ['Proc-HE Code', 'Description', 'Categories']

    2. defra_categories:
       - Columns [A, C] → indexes [0,2]
       - Renamed to ['Product category', 'GHG']

    3. conversion_factors:
       - Columns [B, C] → indexes [1,2]
       - Renamed to ['Activity', 'kg CO2e']

    4. benchmark_data:
       - Columns [B, L, AD] → indexes [1,11,30]
       - Renamed to ['title', 'Amount', 'Unit']
       - Excludes rows where title == "Adjusted electricity and gas benchmark for UofG spaces".
    """

    # 1) Open the Excel workbook
    try:
        xl = pd.ExcelFile(excel_file)
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return

    # 2) Read the sheets by their names, selecting specific columns
    try:
        # HE 311 Concord: columns C, D, E (indexes [2,3,4])
        df_he311 = pd.read_excel(
            xl,
            sheet_name='HE 311 Concord',
            usecols=[2,3,4]
        )
        df_he311.columns = ['Proc-HE Code', 'Description', 'Categories']

        # DEFRA Categories: columns A, C (indexes [0,2])
        df_defra = pd.read_excel(
            xl,
            sheet_name='DEFRA Categories',
            usecols=[0,2]
        )
        df_defra.columns = ['Product category', 'GHG']

        # Conversion factors: columns B, C (indexes [1,2])
        df_conversion = pd.read_excel(
            xl,
            sheet_name='Conversion Factors',
            usecols=[1,2]
        )
        df_conversion.columns = ['Activity', 'kg CO2e']

        # Benchmark Data: columns B, L, AD (indexes [1,11,30])
        df_benchmark = pd.read_excel(
            xl,
            sheet_name='Benchmark Data',
            usecols=[1,11,30]
        )
        df_benchmark.columns = ['title', 'Amount', 'Unit']

        # Exclude rows where title == "Adjusted electricity and gas benchmark for UofG spaces"
        df_benchmark = df_benchmark[df_benchmark['title'] != "Adjusted electricity and gas benchmark for UofG spaces"]

    except Exception as e:
        print(f"Error loading or processing sheets: {e}")
        return

    # 3) Connect to the SQLite database (creates the file if it doesn't exist)
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return

    # 4) Create tables if they do not exist
    try:
        cursor.execute('''CREATE TABLE IF NOT EXISTS he311_concord (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            proc_he_code TEXT,
                            description TEXT,
                            categories TEXT
                          )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS defra_categories (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            product_category TEXT,
                            ghg TEXT
                          )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS conversion_factors (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            activity TEXT,
                            kg_CO2e REAL
                          )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS benchmark_data (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT,
                            amount REAL,
                            unit TEXT
                          )''')
        conn.commit()
    except Exception as e:
        print(f"Error creating tables: {e}")
        conn.close()
        return

    # 5) Insert data into the tables using pandas' to_sql
    try:
        df_he311.to_sql('he311_concord', conn, if_exists='append', index=False)
        df_defra.to_sql('defra_categories', conn, if_exists='append', index=False)
        df_conversion.to_sql('conversion_factors', conn, if_exists='append', index=False)
        df_benchmark.to_sql('benchmark_data', conn, if_exists='append', index=False)
        print("Data imported successfully into the SQLite database!")
    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'  # Update if needed
    db_file = 'project_data.db'
    import_data_to_sqlite(excel_file, db_file)
