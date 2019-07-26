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

## Extraction Process
This data represents 15 minute extracts from https://data.nashville.gov 
* Some times may not exists due to extraction errors

To make the data more intuitive to work with, I'm capturing time values in two timezones: CST and UTC.
There are two values of primary interest.
1. __Extraction__ dates and times. I'm capturing both UTC and CST timezones
1. __Availability__ start and end times. The timezone for the original data is UTC, so I included a calculation to convert this time to CST to ease analysis later.

```python
from datetime import datetime
from pytz import timezone

utc = timezone('UTC')
central = timezone('US/Central')

extract_date = datetime.strftime(datetime.now(),'%Y-%m-%d')
extract_time = datetime.strftime(datetime.now(),'%H:%M:%S')

cst_extract_date_time = datetime.strptime(extract_date + ' ' + extract_time, '%Y-%m-%d %H:%M:%S')
cst_extract_date_time = cst_extract_date_time.astimezone(central)
cst_extract_date = str(datetime.strftime(cst_extract_date_time,'%Y-%m-%d'))
cst_extract_time = str(datetime.strftime(cst_extract_date_time,'%H:%M:%S'))

utc_extract_date_time = datetime.strptime(extract_date + ' ' + extract_time, '%Y-%m-%d %H:%M:%S')
utc_extract_date_time = utc_extract_date_time.astimezone(utc)
utc_extract_date = str(datetime.strftime(utc_extract_date_time,'%Y-%m-%d'))
utc_extract_time = str(datetime.strftime(utc_extract_date_time,'%H:%M:%S'))

# Availability start date and time conversion to cst
df['date_time'] = df['availability_start_date'] + ' ' + df['availability_start_time']
df['date_time'] = df.apply(lambda x: datetime.strptime(x['date_time'], '%Y-%m-%d %H:%M:%S'),axis=1)
df['utc_time'] = df.apply(lambda x: utc.localize(x['date_time']),axis=1)
df['central_time'] = df.apply(lambda x: x['utc_time'].astimezone(central),axis=1)

df['availability_start_date_cst'] = df.apply(lambda x: str(datetime.strftime(x['central_time'],'%Y-%m-%d')),axis=1)
df['availability_start_time_cst'] = df.apply(lambda x: str(datetime.strftime(x['central_time'],'%H:%M:%S')),axis=1)
        
```

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