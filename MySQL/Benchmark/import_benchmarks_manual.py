import os
import re
import sys
import pandas as pd
import mysql.connector
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get connection details from .env
db_user = os.getenv("username")
db_password = os.getenv("password")
db_host = os.getenv("host")
db_port = int(os.getenv("port", 25060))
db_database = os.getenv("database")
ssl_verify_cert = os.getenv("ssl_verify_cert", "True").strip().lower() == "true"
ssl_ca = os.getenv("ssl_ca")

# Path to your cleaned Excel file
excel_file_path = '/root/Benchmark/data_cleaned.xlsx'

# Connect to MySQL using credentials
try:
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

def parse_category_and_unit(category_str):
    """
    Extract the unit from a category string if enclosed in parentheses at the end.
    Returns (clean_category, category_unit).
    If no unit is found, defaults to 'count'.
    """
    if not isinstance(category_str, str):
        return "", "count"
    category_str = category_str.strip()
    match = re.search(r"\(([^)]+)\)$", category_str)
    if match:
        category_unit = match.group(1).strip()
        category_name = re.sub(r"\([^)]*\)$", "", category_str).strip()
    else:
        category_name = category_str
        category_unit = "count"
    return category_name, category_unit

# Read the cleaned Excel file
try:
    df = pd.read_excel(excel_file_path, sheet_name="Sheet1")
except Exception as e:
    print(f"Error reading Excel file: {e}")
    sys.exit(1)

# Strip whitespace from column headers
df.columns = df.columns.str.strip()

# Verify required columns
required_cols = [
    "UKPRN", "HE Provider", "Academic Year",
    "Country of HE provider", "Region of HE provider",
    "Category marker", "clean_category", "category_unit", "Value"
]
missing = [col for col in required_cols if col not in df.columns]
if missing:
    print("Missing required columns:", missing)
    print("Available columns:", df.columns.tolist())
    sys.exit(1)

# Build dimension lookup dictionaries
cursor.execute("SELECT UKPRN FROM dim_institution")
institution_map = {row["UKPRN"]: row["UKPRN"] for row in cursor.fetchall()}

cursor.execute("SELECT year_id, academic_year FROM dim_year")
year_map = {row["academic_year"]: row["year_id"] for row in cursor.fetchall()}

cursor.execute("SELECT marker_id, marker_name FROM dim_estates_marker")
marker_map = {row["marker_name"]: row["marker_id"] for row in cursor.fetchall()}

cursor.execute("SELECT category_id, category_name, category_unit FROM dim_estates_category")
category_map = {}
for row in cursor.fetchall():
    key = (row["category_name"], row["category_unit"])
    category_map[key] = row["category_id"]

# Helper functions for upserts
def get_or_create_institution(ukprn, name, country, region):
    ukprn_int = int(ukprn)
    if ukprn_int in institution_map:
        return ukprn_int
    sql = """
        INSERT INTO dim_institution (UKPRN, institution_name, country, region)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (ukprn_int, name.strip(), country.strip(), region.strip()))
    connection.commit()
    institution_map[ukprn_int] = ukprn_int
    return ukprn_int

def get_or_create_year(academic_year):
    academic_year = academic_year.strip()
    if academic_year in year_map:
        return year_map[academic_year]
    cursor.execute("INSERT INTO dim_year (academic_year) VALUES (%s)", (academic_year,))
    connection.commit()
    new_id = cursor.lastrowid
    year_map[academic_year] = new_id
    return new_id

def get_or_create_marker(marker_name):
    marker_name = marker_name.strip()
    if marker_name in marker_map:
        return marker_map[marker_name]
    cursor.execute("INSERT INTO dim_estates_marker (marker_name) VALUES (%s)", (marker_name,))
    connection.commit()
    new_id = cursor.lastrowid
    marker_map[marker_name] = new_id
    return new_id

def get_or_create_category(cat_name, cat_unit):
    key = (cat_name.strip(), cat_unit.strip())
    if key in category_map:
        return category_map[key]
    cursor.execute("INSERT INTO dim_estates_category (category_name, category_unit) VALUES (%s, %s)", key)
    connection.commit()
    new_id = cursor.lastrowid
    category_map[key] = new_id
    return new_id

# Insert fact rows
inserted_count = 0
for idx, row in df.iterrows():
    # Validate UKPRN
    try:
        ukprn = int(row["UKPRN"])
    except:
        continue  # skip invalid UKPRN

    institution = row["HE Provider"].strip()
    academic_year = row["Academic Year"].strip()
    country = row["Country of HE provider"].strip()
    region = row["Region of HE provider"].strip()
    marker_raw = row["Category marker"].strip()
    clean_category = row["clean_category"].strip()
    category_unit = row["category_unit"].strip()

    # Determine value. If it's empty or invalid, store NULL
    val = row["Value"]
    if pd.isna(val) or str(val).strip() == "":
        val = None
    else:
        try:
            val = float(val)
        except ValueError:
            val = None

    # Upsert dimensions
    get_or_create_institution(ukprn, institution, country, region)
    year_id = get_or_create_year(academic_year)
    marker_id = get_or_create_marker(marker_raw)
    category_id = get_or_create_category(clean_category, category_unit)

    # Insert row into fact_estates, storing val as NULL if it's None
    cursor.execute("""
        INSERT INTO fact_estates (UKPRN, year_id, marker_id, category_id, value)
        VALUES (%s, %s, %s, %s, %s)
    """, (ukprn, year_id, marker_id, category_id, val))
    inserted_count += 1

connection.commit()
cursor.close()
connection.close()

print(f"Inserted {inserted_count} rows into fact_estates.")
