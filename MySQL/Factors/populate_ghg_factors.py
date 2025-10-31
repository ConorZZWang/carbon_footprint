import os
import sys
import pandas as pd
import mysql.connector
from dotenv import load_dotenv

# 1. Load environment variables from .env
load_dotenv()

db_user = os.getenv("username")
db_password = os.getenv("password")
db_host = os.getenv("host")
db_port = int(os.getenv("port", 25060))
db_database = os.getenv("database")
ssl_verify_cert = os.getenv("ssl_verify_cert", "True").strip().lower() == "true"
ssl_ca = os.getenv("ssl_ca")

# Path to your GHG Excel file
excel_file_path = "/root/Factors/conversion-factors-2021-flat-file-automatic-processing.xls"

# Default year if the sheet is for 2021
DEFAULT_YEAR = 2021

try:
    # 2. Connect to MySQL
    connection = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database,
        port=db_port,
        ssl_verify_cert=ssl_verify_cert,
        ssl_ca=ssl_ca
    )
    cursor = connection.cursor(dictionary=True)
    print("Successfully connected to the database.")
except Exception as e:
    print(f"Database connection error: {e}")
    sys.exit(1)

try:
    # 3. Read the Excel, skipping the first 5 rows so row 6 is the header
    df = pd.read_excel(excel_file_path, engine='xlrd', skiprows=5, header=0)
except Exception as e:
    print(f"Error reading Excel file: {e}")
    sys.exit(1)

# Strip whitespace from column headers
df.columns = df.columns.str.strip()
print("First few rows (post-skip):")
print(df.head(5))
print("Columns:", df.columns.tolist())

# 4. Insert each row into ghg_factors
inserted_count = 0
for idx, row in df.iterrows():
    # Extract fields, defaulting to empty strings if missing
    scope = str(row.get("Scope", "")).strip()
    category = str(row.get("Level 1", "")).strip()
    subcategory = str(row.get("Level 2", "")).strip()
    type_ = str(row.get("Level 3", "")).strip()
    type_info = str(row.get("Level 4", "")).strip()
    subtype = str(row.get("Column Text", "")).strip()
    metric = str(row.get("UOM", "")).strip()
    ghg_metric = str(row.get("GHG", "")).strip()

    # Convert factor to float (or 0 if invalid)
    factor_str = row.get("GHG Conversion Factor 2021", "")
    try:
        factor_val = float(str(factor_str).replace(",", ""))  # handle "12,345" format
    except:
        factor_val = 0.0  # or skip if you prefer

    # 5. Insert into ghg_factors
    sql = """
    INSERT INTO ghg_factors (
      scope, category, subcategory, type, type_info, 
      subtype, metric, ghg_metric, ghg_conversion_factor, year
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        scope, category, subcategory, type_, type_info,
        subtype, metric, ghg_metric, factor_val, DEFAULT_YEAR
    ))
    inserted_count += 1

connection.commit()
cursor.close()
connection.close()

print(f"Inserted {inserted_count} rows into ghg_factors.")
