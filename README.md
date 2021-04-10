# open-data-portal
Publishing data of civic interest that may not be available elsewhere

## Scripts To Get And Clean Data
Scripts contained in the scripts folder provide some code to clean Government Employees Demographic data that is downloaded from the data.Nashville.gov.  Because the scripts are written in javascript, and intended to be run in a nodejs environment, if you want to run the scripts, be sure to install the needed packages using the following command:

<code>npm install</code>

### get-data.js
To execute the get-data script, change to the scripts directory, and use the following
command:

<code>cd scripts</code>

<code>node clean-data.js --outputFile=test.csv</code>

Where <code>--outputFile</code> is set equal to a file name that will be created in the
local directory for use by the clean-data script.  There is an optional parameter
<code>--url=</code> that can be used to specify the url of the api, if not specified
the code will use the default value of https://data.nashville.gov/resource/4ibi-mxs4.csv

### clean-data.js
To execute the clean-data script, change to the scripts directors, and use the following command:

<code>cd scripts</code>

<code>node clean-data.js --templateFile=2020-08.csv
--downloadedFile=General_Government_Employees_Demographics.csv --outputFile=2021-01.csv</code>

Where <code>--templateFile=</code> is set equal to an already cleaned data file from the past that the script can use as a template; <code>--downloadedFile=</code> is set equal to the name of the file downloaded from data.nashville.gov (note: the script expects this file to be saved in the <code>../local</code> directory); and the <code>--outputFile=</code> is set equal to the name of the file that should be created to be stored in this open data portal.
