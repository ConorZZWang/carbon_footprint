import pandas as pd
import sqlite3

def import_defra(excel_file, db_file):
    """
    Reads the 'DEFRA Categories' sheet from the Excel file,
    selects columns 'Index', 'Product category', and 'GHG',
    and writes them to a SQLite table named 'defra_categories'.
    """
    try:
        # Read the entire 'DEFRA Categories' sheet
        df_defra = pd.read_excel(excel_file, sheet_name='DEFRA Categories')
        print("DEFRA Categories columns:", df_defra.columns.tolist())
        print("DEFRA Categories shape:", df_defra.shape)

        # Keep only these three columns
        df_defra = df_defra[['Index', 'Product category', 'GHG']]

        # Optional: If you want to drop the row where Index is NaN (row 0 with 'kgCO2e'):
        # df_defra = df_defra[df_defra['Index'].notna()]

        # Rename columns to something SQL-friendly (optional)
        df_defra.columns = ['index_value', 'product_category', 'ghg']

    except Exception as e:
        print(f"Error reading or processing 'DEFRA Categories' sheet: {e}")
        return

    # Connect (or create) the SQLite database
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return

    # Create the 'defra_categories' table
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS defra_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                index_value TEXT,
                product_category TEXT,
                ghg TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
        conn.close()
        return

    # Insert data
    try:
        df_defra.to_sql('defra_categories', conn, if_exists='append', index=False)
        print("DEFRA data imported successfully!")
    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'  # Adjust if needed
    db_file = 'project_data.db'
    import_defra(excel_file, db_file)
