import os
import re
import sys
import pandas as pd
import mysql.connector
from dotenv import load_dotenv

# -----------------------
# 1. Load environment variables from .env
# -----------------------
load_dotenv()

db_user = os.getenv("username")
db_password = os.getenv("password")
db_host = os.getenv("host")
db_port = int(os.getenv("port", 25060))
db_database = os.getenv("database")
ssl_verify_cert = os.getenv("ssl_verify_cert", "True").strip().lower() == "true"
ssl_ca = os.getenv("ssl_ca")

# -----------------------
# 2. CSV File Path and Default Values
# -----------------------
csv_path = "/root/Benchmark/dt042-table-2.csv"

# Defaults for missing columns in the CSV:
default_academic_year = "2021/22"
default_building_type = "Total"       # or "All"
default_country = "UK"                # adjust as needed
default_region = "Unknown"            # adjust as needed

# -----------------------
# 3. Connect to MySQL
# -----------------------
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

# -----------------------
# 4. Read the CSV, skipping the first 14 metadata rows
# -----------------------
try:
    # skiprows=14: ignore the first 14 rows; line 15 becomes the header.
    df = pd.read_csv(csv_path, skiprows=14, header=0)
except Exception as e:
    print(f"Error reading CSV file: {e}")
    sys.exit(1)

# Clean column headers
df.columns = df.columns.str.strip()
print("First few rows after skipping 14 lines:")
print(df.head(5))
print("Columns:", df.columns.tolist())

# -----------------------
# 5. Verify required columns in CSV
# -----------------------
required_cols = [
    "UKPRN", "HE provider",
    "Total energy consumption (kWh)",
    "Total fuel used in HE provider owned vehicles (litres)",
    "Total generation of electricity exported to grid (kWh)",
    "Total water consumption (m3)",
    "Total renewable energy generated onsite or offsite (kWh)"
]
missing = [col for col in required_cols if col not in df.columns]
if missing:
    print("Missing required columns in CSV:", missing)
    print("Available columns:", df.columns.tolist())
    sys.exit(1)

# -----------------------
# 6. Build in-memory lookup dictionaries for dimensions
# -----------------------
cursor.execute("SELECT UKPRN FROM dim_institution")
institution_map = {row["UKPRN"]: row["UKPRN"] for row in cursor.fetchall()}

cursor.execute("SELECT year_id, academic_year FROM dim_year")
year_map = {row["academic_year"]: row["year_id"] for row in cursor.fetchall()}

cursor.execute("SELECT building_type_id, building_type_name FROM dim_building_type")
btype_map = {row["building_type_name"]: row["building_type_id"] for row in cursor.fetchall()}

cursor.execute("SELECT metric_id, metric_name, metric_unit FROM dim_metric")
metric_map = {}
for row in cursor.fetchall():
    key = (row["metric_name"], row["metric_unit"])
    metric_map[key] = row["metric_id"]

# -----------------------
# 7. Helper functions for dimension upserts
# -----------------------
def get_or_create_institution(ukprn, inst_name, country, region):
    ukprn_int = int(ukprn)
    if ukprn_int in institution_map:
        return ukprn_int
    sql = """
        INSERT INTO dim_institution (UKPRN, institution_name, country, region)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (ukprn_int, inst_name.strip(), country.strip(), region.strip()))
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

def get_or_create_building_type(bt_name):
    bt_name = bt_name.strip()
    if bt_name in btype_map:
        return btype_map[bt_name]
    cursor.execute("INSERT INTO dim_building_type (building_type_name) VALUES (%s)", (bt_name,))
    connection.commit()
    new_id = cursor.lastrowid
    btype_map[bt_name] = new_id
    return new_id

def get_or_create_metric(metric_name, metric_unit):
    # Clean and potentially truncate metric_name to fit the column definition.
    metric_name = metric_name.strip()
    metric_unit = metric_unit.strip()
    # If the metric_name is longer than, say, 100 characters, truncate it.
    if len(metric_name) > 100:
        metric_name = metric_name[:100]
    key = (metric_name, metric_unit)
    if key in metric_map:
        return metric_map[key]
    cursor.execute("INSERT INTO dim_metric (metric_name, metric_unit) VALUES (%s, %s)", key)
    connection.commit()
    new_id = cursor.lastrowid
    metric_map[key] = new_id
    return new_id

# -----------------------
# 8. Define Expected Metrics from the CSV and their units
# -----------------------
expected_metrics = [
    ("Total energy consumption (kWh)", "kWh"),
    ("Total fuel used in HE provider owned vehicles (litres)", "litres"),
    ("Total generation of electricity exported to grid (kWh)", "kWh"),
    ("Total water consumption (m3)", "m^3"),
    ("Total renewable energy generated onsite or offsite (kWh)", "kWh")
]

# -----------------------
# 9. Iterate over CSV rows and insert fact rows
# -----------------------
inserted_count = 0
for idx, row in df.iterrows():
    # Extract basic fields from the row
    try:
        ukprn_val = int(row["UKPRN"])
    except:
        continue

    # Use column "HE provider" (case-sensitive) for institution name.
    inst_name = row["HE provider"].strip()
    # For academic year and building type, we use defaults since they're missing
    academic_year = default_academic_year
    building_type = default_building_type
    country = default_country
    region = default_region

    # Upsert dimensions
    get_or_create_institution(ukprn_val, inst_name, country, region)
    year_id = get_or_create_year(academic_year)
    btype_id = get_or_create_building_type(building_type)

    # For each expected metric, insert a fact row
    for metric_col, metric_unit in expected_metrics:
        val = row.get(metric_col, None)
        if pd.isna(val) or str(val).strip() == "":
            val = None
        else:
            try:
                val = float(val)
            except:
                val = None
        
        m_id = get_or_create_metric(metric_col, metric_unit)
        cursor.execute("""
            INSERT INTO fact_hesa_benchmarks (UKPRN, year_id, building_type_id, metric_id, value)
            VALUES (%s, %s, %s, %s, %s)
        """, (ukprn_val, year_id, btype_id, m_id, val))
        inserted_count += 1

connection.commit()
cursor.close()
connection.close()

print(f"Inserted {inserted_count} metric rows into fact_hesa_benchmarks.")
