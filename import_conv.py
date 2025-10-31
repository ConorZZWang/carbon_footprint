import pandas as pd
import sqlite3

def import_conversion_factors(excel_file, db_file):
    """
    Reads the 'Conversion Factors' sheet from the Excel file,
    skips the first row (which contains a large heading),
    renames the two columns to 'Activity' and 'kg CO2e',
    filters out the row where 'Activity' is literally "Activity",
    and writes them to a SQLite table named 'conversion_factors'.
    """
    try:
        # Read columns A and B, skip the first row, no header
        df_cf = pd.read_excel(
            excel_file,
            sheet_name='Conversion Factors',
            skiprows=1,
            header=None,
            usecols=[0, 1]
        )

        # Rename columns
        df_cf.columns = ["Activity", "kg CO2e"]

        # Drop any fully empty rows
        df_cf.dropna(how="all", inplace=True)

        # --- FILTER OUT THE HEADER-LIKE ROW ---
        # Remove the row that literally has "Activity" in the first column
        df_cf = df_cf[df_cf["Activity"] != "Activity"]

        print("Conversion Factors columns:", df_cf.columns.tolist())
        print("Conversion Factors shape:", df_cf.shape)
        print(df_cf.head(5))  # Debug

    except Exception as e:
        print("Error reading 'Conversion Factors' sheet:", e)
        return

    # Connect (or create) the SQLite database
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    except Exception as e:
        print("Error connecting to database:", e)
        return

    # Drop and recreate the conversion_factors table
    try:
        cursor.execute("DROP TABLE IF EXISTS conversion_factors")
        cursor.execute('''
            CREATE TABLE conversion_factors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                "Activity" TEXT,
                "kg CO2e" TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print("Error creating table:", e)
        conn.close()
        return

    # Insert data
    try:
        df_cf.to_sql('conversion_factors', conn, if_exists='append', index=False)
        print("Conversion Factors data imported successfully!")
    except Exception as e:
        print("Error inserting data:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'
    db_file = 'project_data.db'
    import_conversion_factors(excel_file, db_file)
