import pandas as pd
import sqlite3

def import_he311(excel_file, db_file):
    """
    Reads the 'HE 311 Concord' sheet from the Excel file,
    skips the first two rows,
    selects only columns A, B, and D (which correspond to indices 0, 1, and 3),
    assigns the columns: 'Proc-HE Code', 'Description', and 'Categories',
    and writes the data to a SQLite table named 'he311_concord' using 'Proc-HE Code' as the primary key.
    """
    try:
        # Read only columns A, B, and D, skipping the first two rows
        df_he311 = pd.read_excel(
            excel_file,
            sheet_name='HE 311 Concord',
            skiprows=2,         # Skip the first two rows that are not needed
            header=None,        # Do not use any row as header
            usecols=[0, 1, 3]   # Use columns A (0), B (1) and D (3)
        )
        # Assign the desired column names
        df_he311.columns = ['Proc-HE Code', 'Description', 'Categories']
        print("HE 311 Concord data loaded. Shape:", df_he311.shape)
    except Exception as e:
        print("Error reading HE 311 Concord sheet:", e)
        return

    # Connect to the SQLite database (or create it if it doesn't exist)
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    except Exception as e:
        print("Error connecting to database:", e)
        return

    # Drop any existing table and create a new one with "Proc-HE Code" as primary key
    try:
        cursor.execute("DROP TABLE IF EXISTS he311_concord")
        cursor.execute('''
            CREATE TABLE he311_concord (
                "Proc-HE Code" TEXT PRIMARY KEY,
                "Description" TEXT,
                "Categories" TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print("Error creating table:", e)
        conn.close()
        return

    # Insert data into the table
    try:
        df_he311.to_sql('he311_concord', conn, if_exists='append', index=False)
        print("HE 311 Concord data imported successfully!")
    except Exception as e:
        print("Error inserting data:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'  # Update if needed
    db_file = 'project_data.db'
    import_he311(excel_file, db_file)
