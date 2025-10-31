This folder contains the 'backup.sql' which is a dump of the 'CTF' database from Digital Ocean's managed database.

To restore, you should have MySQL 8.0 installed in your environment.
1. Create a database:
mysql -u 'user' -p -e "CREATE DATABASE 'the_name_of_your_db_without_quotes';"
2. Import the backup:
mysql -u 'user' -p 'the_name_of_your_db_without_quotes' < backup.sql
3. mysql -u 'user' -p -e "USE 'the_name_of_your_db_without_quotes'; SHOW TABLES;"

The two separate folders contain some of the population files accessed from:
Benchmarks - Data file canonical link on site: https://www.hesa.ac.uk/data-and-analysis/estates/table-2
Factors - https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2021
