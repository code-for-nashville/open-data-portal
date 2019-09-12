# Nashville Shared Urban Mobility Device (SUMD) Parking Compliance

# Source:
https://data.nashville.gov/browse?tags=scooter&utf8=%E2%9C%93

There are two kinds of datasets to work with:
- Simple Extract (one day)
- Active Rides Extract (multi-day)

# Simple Extract (one day)
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


# Active Rides Extract (multi-day)
## Two new files:

### scooter_extract-2019-07-22-through-2019-09-09.csv
Contains data across all scooter extracts from 7-20 to 9-9. For each parked scooter, I've captured the first and last extract date for each unique combination of sumd_id, availability_start_date, availability_start_time and company_name. Combined with the file: extract_schedule.csv a user could recreate any extract.

SQL example:
```sql
select * from scooters where '2019-08-18 08:30:11' between first_extract_date_cst || ' ' || first_extract_time_cst and last_extract_date_cst || ' ' || last_extract_time_cst; 
```

Python example:
```python
import pandas as pd

df = pd.read_csv('scooter_extract-2019-07-22-through-2019-09-09.csv')
extract_date = '2019-08-18 08:30:11'
mask = ((df['first_extract_date_cst'] + ' ' + df['first_extract_time_cst']  <= extract_date) &  (df['last_extract_date_cst'] + ' ' + df['last_extract_time_cst']  >= extract_date))
df[mask]
```

#### Columns:
- **'availability_duration'**: company supplied timing (do not use)
- **'availability_start_date'**: when the scooter was parked/dropped off and ready for a rider, timezone = UTC
- **'availability_start_time'**: parked time in UTC
- **'company_name'**
- **'company_phone'**
- **'company_website'**
- **'gps_latitude'**: latitude of parked scooter
- **'gps_longitude'**: longitude of parked scooter
- **'real_time_fare'**: cost per minute
- **'sumd_group'**: Scooter or scooter
-  **'sumd_id**': unique identifier for a device/scooter
-  **'sumd_type'**: device type (all scooters)
- **'availability_start_date_cst'**:start date converted to local cst time
- **'availability_start_time_cst'**,
- **'availability_duration_seconds'**: calculated seconds between availability_start_date/time and extract date/time
- **'last_extract_date_cst'**: final extract on which this scooter appeared at this availability start date/time based on CST
- **'last_extract_time_cst'**: final extract on which this scooter appeared at this availability start date/time based on CST
- **'last_extract_date_utc'**: final extract on which this scooter appeared at this availability start date/time based on UTC
- **'last_extract_time_utc'v: final extract on which this scooter appeared at this availability start date/time based on UTC
- **'first_extract_date_cst':** first extract on which this device appeared with this availability start/datetime based on cst
- **'first_extract_time_cst'**: first extract on which this device appeared with this availability start/datetime based on cst
- **'first_extract_date_utc'**
- **'first_extract_time_utc'**


### extract_schedule.csv
Column: extract_datetime_cst
One record for each extract, use this as a reference to recreate extracts.

### Notes
This represents the raw extract data except for two issues:
1. If the scooter had been available for 10 or more days at the same location, I stopped updating it unless something changed (this helped speed up processing time)
2. There were 20-80 **Bird** scooters that would disappear from the extracts, but then reappear in the same location several extracts later with the same availability start date and time. I decided to keep the records in the dataset because theoretically the scooters did not move and the availability 'clock' continued to tick from the original drop-off time, suggesting they were not moved, charged or ridden. This was specific to Bird.

### Data Concerns
- some data appears missing from some days of data (e.g. 2019-07-24 and 2019-08-09)
