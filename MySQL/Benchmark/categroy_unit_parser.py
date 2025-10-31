import pandas as pd
import re
import sys

def parse_category_and_unit(category_str):
    """
    Extracts the unit from a category string if it is enclosed in parentheses at the end.
    Returns (clean_category, category_unit).
    If no unit is found, returns the trimmed category and 'count' as a default unit.
    """
    if not isinstance(category_str, str):
        return "", "count"
    category_str = category_str.strip()
    
    # Regex to find parentheses at the very end: e.g. "something (units)"
    match = re.search(r"\(([^)]+)\)$", category_str)
    if match:
        category_unit = match.group(1).strip()
        category_name = re.sub(r"\([^)]*\)$", "", category_str).strip()
    else:
        category_name = category_str
        category_unit = "count"
    return category_name, category_unit

# -----------------------
# MAIN SCRIPT
# -----------------------
try:
    # 1) Read your Excel file
    excel_path = "data.xlsx"  # <-- Replace with your actual file path
    df = pd.read_excel(excel_path, sheet_name="Sheet1", skiprows=10, header=0)
except Exception as e:
    print(f"Error reading Excel file: {e}")
    sys.exit(1)

# 2) Strip whitespace from column headers
df.columns = df.columns.str.strip()

# 3) Check if "Category" column exists
if "Category" not in df.columns:
    print("No exact 'Category' column found in the file.")
    print("Available columns:", df.columns.tolist())
    sys.exit(1)

# 4) Parse out category/unit from the "Category" column
#    Creates two new columns: "clean_category" and "category_unit"
df[["clean_category", "category_unit"]] = df["Category"].apply(
    lambda x: pd.Series(parse_category_and_unit(x))
)

# 5) Optionally drop or rename original "Category" column
# df.drop(columns=["Category"], inplace=True)
# df.rename(columns={"clean_category": "Category"}, inplace=True)

# 6) Write the cleaned DataFrame to a new Excel file
output_path = "data_cleaned.xlsx"
try:
    df.to_excel(output_path, index=False)
    print(f"Cleaning complete. Cleaned file saved as '{output_path}'.")
except Exception as e:
    print(f"Error writing cleaned Excel file: {e}")
    sys.exit(1)
