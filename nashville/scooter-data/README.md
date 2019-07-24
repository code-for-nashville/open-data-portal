# Nashville Shared Urban Mobility Device (SUMD) Parking Compliance

Source:
https://data.nashville.gov/browse?tags=scooter&utf8=%E2%9C%93

CSV columns:
- 'availability_duration': Duration of the parked device's availability (HH:MM:SS)
- 'availability_start_date': Date of the parked device's availability (YYYY-MM-DD)
- 'availability_start_time': Time of the parked device's availability (HH:MM:SS)
- 'company_name': Name of scooter company
- 'company_phone': SUMD vendor local customer service phone number
- 'company_website': SUMD vendor website URL
- 'gps_latitude': Latitude of the parked device
- 'gps_longitude': Longitude of the parked device
- 'real_time_fare': Real-time SUMD fare per unit distance
- 'sumd_group': Group of device, e.g. "bicycle", "tricycle", "scooter", "hoverboard", "skateboard", "pedal car" or "other"
- 'sumd_id': SUMD type and unique identifier for every device, determined by company
- 'sumd_type': Locomotion type of device, e.g. "standard" or "powered"
- 'availability_start_date_cst': availability_start_date converted to CST
- 'availability_start_time_cst': availability_start_time converted to CST
- 'extract_date': extract_date CST
- 'extract_time': extract_time CST
- 'availability_duration_seconds': difference in seconds between availability start date/time and extract date/time 

## Extraction
This data represents 15 minute extracts from https://data.nashville.gov 
* Some times may not exists due to extraction errors

## Sample Import Script

```python
import pandas as pd
import sqlite3

df = pd.read_csv('scooter_extract_2017-07-22.csv')
conn = sqlite3.connect("scooters.db")
df.to_sql('scooters',conn, index=False, if_exists='replace')
conn.commit()
conn.close()
```