import pandas as pd
import sqlite3

def import_defra(excel_file, db_file):
    """
    Reads the 'DEFRA Categories' sheet from the Excel file,
    selects the columns 'Index', 'Product category', and 'GHG',
    drops rows where 'Product category' is empty or NaN,
    then drops the 'Index' column,
    and writes the remaining data (Product category and GHG)
    to a SQLite table named 'defra_categories'.
    """
    try:
        # Read the entire 'DEFRA Categories' sheet
        df_defra = pd.read_excel(excel_file, sheet_name='DEFRA Categories')
        print("DEFRA Categories columns:", df_defra.columns.tolist())
        print("DEFRA Categories shape:", df_defra.shape)

        # Select only the relevant three columns
        df_defra = df_defra[['Index', 'Product category', 'GHG']]

        # Drop rows where 'Product category' is empty or NaN
        df_defra = df_defra.dropna(subset=['Product category'])
        df_defra = df_defra[df_defra['Product category'].astype(str).str.strip() != '']

        # Drop the 'Index' column as it's not needed
        df_defra = df_defra.drop(columns=['Index'])

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

    # Drop any existing table and create a new one with only two columns
    try:
        cursor.execute("DROP TABLE IF EXISTS defra_categories")
        cursor.execute('''
            CREATE TABLE defra_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                "Product category" TEXT,
                "GHG" TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
        conn.close()
        return

    # Insert the filtered data into the table
    try:
        df_defra.to_sql('defra_categories', conn, if_exists='append', index=False)
        print("DEFRA data imported successfully!")
    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'  # Adjust as needed
    db_file = 'project_data.db'
    import_defra(excel_file, db_file)
