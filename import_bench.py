import pandas as pd
import sqlite3

def import_benchmark_data(excel_file, db_file):
    """
    Reads three blocks of rows from the 'Benchmark Data' sheet:
      - Rows 3 to 9 (Excel terms) → df.iloc[2:9] in Python
      - Rows 12 to 19 (Excel terms) → df.iloc[11:19]
      - Rows 31 to 34 (Excel terms) → df.iloc[30:34 or 35]
    and extracts columns A, B, C → df.iloc[:, [0,1,2]] (title, amount, unit).
    It then concatenates these blocks and writes them to a
    SQLite table named 'benchmark_data'.
    """

    try:
        # Read the entire sheet with no headers (we'll slice rows manually)
        df_full = pd.read_excel(
            excel_file,
            sheet_name='Benchmark Data',
            header=None  # no header row, so columns will be numeric
        )
        # Debugging: see how many rows/cols we have
        print("Benchmark Data sheet shape:", df_full.shape)

        # --- Extract block 1: rows 3–9 (Excel) => iloc[2:9] in 0-based Pandas ---
        df_block1 = df_full.iloc[2:9, [0, 1, 2]]  # columns A, B, C => indices 0,1,2

        # --- Extract block 2: rows 12–19 (Excel) => iloc[11:19] ---
        df_block2 = df_full.iloc[11:19, [0, 1, 2]]

        # --- Extract block 3: rows 31–34 (Excel) => iloc[30:34 or 35] ---
        # If you need up to row 34 inclusive, use iloc[30:34] (excludes 34),
        # or iloc[30:35] (excludes 35). Adjust as needed.
        df_block3 = df_full.iloc[30:34, [0, 1, 2]]

        # Concatenate these blocks
        df_bm = pd.concat([df_block1, df_block2, df_block3], ignore_index=True)

        # Rename columns to something meaningful
        df_bm.columns = ["title", "amount", "unit"]

        # Optional: Convert 'amount' to numeric if needed
        # df_bm["amount"] = pd.to_numeric(df_bm["amount"], errors="coerce")

        # Optional: Filter out any unwanted rows
        # Example: skip the row titled "Adjusted electricity and gas benchmark for UofG spaces"
        # df_bm = df_bm[df_bm["title"] != "Adjusted electricity and gas benchmark for UofG spaces"]

        print("Final Benchmark DataFrame:\n", df_bm.head(10))

    except Exception as e:
        print("Error reading or processing 'Benchmark Data' sheet:", e)
        return

    # Connect to SQLite
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    except Exception as e:
        print("Error connecting to database:", e)
        return

    # Drop any existing table and create a new one
    try:
        cursor.execute("DROP TABLE IF EXISTS benchmark_data")
        cursor.execute('''
            CREATE TABLE benchmark_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                amount REAL,
                unit TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print("Error creating table:", e)
        conn.close()
        return

    # Insert data
    try:
        df_bm.to_sql('benchmark_data', conn, if_exists='append', index=False)
        print("Benchmark Data imported successfully!")
    except Exception as e:
        print("Error inserting data:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    excel_file = 'The_Current_App_2024_Present.xlsx'  # Adjust as needed
    db_file = 'project_data.db'
    import_benchmark_data(excel_file, db_file)
