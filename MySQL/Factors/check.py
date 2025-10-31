import pandas as pd
import warnings

warnings.simplefilter("ignore", UserWarning)

excel_file_path = "/root/Factors/2021.xlsx"
xlsx = pd.ExcelFile(excel_file_path)
print(xlsx.sheet_names)
