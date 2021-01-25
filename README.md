# open-data-portal
Publishing data of civic interest that may not be available elsewhere

Scripts contained in the scripts folder provide some code to clean Government Employees Demographic data that is downloaded from the data.Nashville.gov.  Because the scripts are written in javascript, and intended to be run in a nodejs environment, if you want to run the scripts, be sure to install the needed packages using the following command:

<code>npm install</code>

To execute the clean_data script, change to the scripts directors, and use the following command:

<code>cd scripts</code>
<code>node clean-data.js --templateFile=2020-08.csv --downloadedFile=General_Government_Employees_Demographics.csv --outputFile=2021-01.csv</code>

Where <code>--templateFile=</code> is set equal to an already cleaned data file from the past that the script can use as a template; <code>--downloadedFile=</code> is set equal to the name of the file downloaded from data.nashville.gov (note: the script expects this file to be saved in the <code>../local</code> directory); and the <code>--outputFile=</code> is set equal to the name of the file that should be created to be stored in this open data portal.
