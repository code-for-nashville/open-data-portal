# Nashville Shared Urban Mobility Device (SUMD) Parking Compliance

Source:
https://data.nashville.gov/browse?tags=scooter&utf8=%E2%9C%93

CSV columns:
- 'availability_duration': From original, duration of the parked device's availability (HH:MM:SS) UTC
- 'availability_start_date': From original, date of the parked device's availability (YYYY-MM-DD) UTC
- 'availability_start_time': From original, time of the parked device's availability (HH:MM:SS) UTC
- 'company_name': Modification, name of scooter company
- 'company_phone': From original, SUMD vendor local customer service phone number
- 'company_website': From original, SUMD vendor website URL
- 'gps_latitude': From original, latitude of the parked device
- 'gps_longitude': From original, longitude of the parked device
- 'real_time_fare': From original, Real-time SUMD fare per unit distance
- 'sumd_group': Grom original, group of device, e.g. "bicycle", "tricycle", "scooter", "hoverboard", "skateboard", "pedal car" or "other"
- 'sumd_id': From original, SUMD type and unique identifier for every device, determined by company
- 'sumd_type': From original, locomotion type of device, e.g. "standard" or "powered"
- 'availability_start_date_cst': Modified, availability_start_date converted to CST
- 'availability_start_time_cst': Modified, availability_start_time converted to CST
- 'extract_date_cst': Modified, extract_date CST
- 'extract_time_cst': Modified, extract_time CST
- 'availability_duration_seconds': Modified, difference in seconds between availability start date/time and extract date/time 
- 'extract_date_utc': Modified, extract_date UTC
- 'extract_time_utc': Modified, extract_time UTC

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

## Extraction Process
This data represents 15 minute extracts from https://data.nashville.gov 
* Some times may not exists due to extraction errors

### Extaction Script
The script below uses an app_token per https://dev.socrata.com/consumers/getting-started.html. However, 
you can make a certain number of requests without an application token. 

It is recommended that you install dependencies with [Pipenv](https://docs.pipenv.org/en/latest/).
You can run it from this directory with `python ./script/extract`.

This will extract current data into a scooters.db sqlite database.
From there, you could you use it via python or sqlite.

