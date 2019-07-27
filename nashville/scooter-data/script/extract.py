## Extraction Process
# This data represents 15 minute extracts from https://data.nashville.gov

### Extaction Script
# The script below uses an app_token per https://dev.socrata.com/consumers/getting-started.html. However,
# you can make a certain number of requests without an application token.

import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime
from pytz import timezone
import sqlite3


def main():

    lime = {'company':'lime','endpoint':'https://data.nashville.gov/resource/ntar-zcjt.json?','color':'lime','timezone':'UTC'}
    bird = {'company': 'bird','endpoint':'https://data.nashville.gov/resource/nar3-8j89.json?','color': 'black','timezone':'UTC'}
    uber = {'company':'uber','endpoint':'https://data.nashville.gov/resource/jwwr-v4rf.json?','color': 'red','timezone':'UTC'}
    lyft = {'company':'lyft','endpoint':'https://data.nashville.gov/resource/bmb2-fucd.json?', 'color': 'pink','timezone':'UTC'}
    gotcha = {'company': 'gotcha','endpoint':'https://data.nashville.gov/resource/anqi-zsnc.json?','color': 'aqua','timezone':'UTC'}
    spin = {'company':'spin','endpoint':'https://data.nashville.gov/resource/2gne-qgxz.json?','color': 'orange','timezone':'UTC'}
    bolt = {'company':'bolt','endpoint':'https://data.nashville.gov/resource/rxpd-ez2h.json?','color': 'yellow','timezone':'UTC'}


    # bolt data lat and long is inaccurate
    scooter_companies = [lime, bird, uber, lyft, gotcha, spin, bolt]

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

    conn = sqlite3.connect("scooters.db")

    all_data = []

    for scooter in scooter_companies:

        company = scooter['company']
        endpoint = scooter['endpoint']
        color = scooter['color']

        # app_token = '.json?' #add $$app_token=APPTOKEN
        url = endpoint # + app_token

        response = requests.get(url)

        data = json.loads(response.text)

        df = pd.DataFrame(data)
        df['gps_longitude'] = df['gps_longitude'].astype('float')
        df['gps_latitude'] = df['gps_latitude'].astype('float')
        df['company_name'] = company

        # converting date time to central - TODO: create a function
        df['date_time'] = df['availability_start_date'] + ' ' + df['availability_start_time']
        df['date_time'] = df.apply(lambda x: datetime.strptime(x['date_time'], '%Y-%m-%d %H:%M:%S'),axis=1)
        df['utc_time'] = df.apply(lambda x: utc.localize(x['date_time']),axis=1)
        df['central_time'] = df.apply(lambda x: x['utc_time'].astimezone(central),axis=1)

        df['availability_start_date_cst'] = df.apply(lambda x: str(datetime.strftime(x['central_time'],'%Y-%m-%d')),axis=1)
        df['availability_start_time_cst'] = df.apply(lambda x: str(datetime.strftime(x['central_time'],'%H:%M:%S')),axis=1)

        df['extract_date_cst'] = cst_extract_date
        df['extract_time_cst'] = cst_extract_time

        df['extract_date_utc'] = utc_extract_date
        df['extract_time_utc'] = utc_extract_time

        extract_datetime = datetime.strptime(cst_extract_date + ' ' + cst_extract_time, '%Y-%m-%d %H:%M:%S')
        df['availability_duration_seconds'] = df.apply(lambda x: (central.localize(extract_datetime) - x['central_time']).total_seconds(),axis=1)

        # remove the conversion columns - we don't need them
        df_cleansed = df[['availability_duration', 'availability_start_date',
            'availability_start_time', 'company_name','company_phone', 'company_website',
            'gps_latitude', 'gps_longitude', 'real_time_fare', 'sumd_group',
            'sumd_id', 'sumd_type', 'availability_start_date_cst',
            'availability_start_time_cst','availability_duration_seconds',
            'extract_date_cst','extract_time_cst','extract_date_utc','extract_time_utc']]

        all_data.append(df_cleansed)

    full_data_set = pd.concat(all_data)

    full_data_set.to_sql('scooters',conn,if_exists='append',index=False)

    conn.commit()
    conn.close()

if __name__=='__main__':
    main()

