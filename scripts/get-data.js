// 
// This script loads the government employees data from the data.nashville.gov
// open data portal, and saves the results as a local csv file.
// 
// example useage from the command prompt:
// node get-data.js --outputFile=test.csv
//    or
// node get-data.js --outputFile=test.csv --url=https://data.nashville.gov/resource/4ibi-mxs4.csv
// url paramater is optional, the default value is https://data.nashville.gov/resource/4ibi-mxs4.csv
//
var request = require('request');
var fs = require('fs');

let args = require('minimist')(process.argv.slice(2));

const apiUrl = args['url'] || 'https://data.nashville.gov/resource/4ibi-mxs4.csv';
const destPath = '../local/';
const outputFile = args['outputFile']

const options = {
  'method': 'GET',
  'url': apiUrl,
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  let lines = response.body.split("\n");
  // previous files were downloaded as excel workbooks, and those
  // had sligtly different column titles.
  // the below object is used to translate the titles provided by the api
  // into the same titles as were previously used for the excel versions
  // of the files.
  //
  const titleTranslate = {
    "pay_grade_step": "Pay Grade / Step",
    "annual_salary": "Annual Salary",
    "class": "Class",
    "title": "Title",
    "current_dept_description": "Current Department",
    "employment_status": "Employment Status",
    "eeo_job_cat_desc": "EEO Job Category Description",
    "gender": "Gender",
    "ethnic_code_description": "Ethnic Code Description",
    "year_of_birth": "Year of Birth",
    "date_started": "Date Started",
    "flsa_exempt_y_n": "FLSA Exempt?",
    "county": "County"
  };

  for (const apiTitle in titleTranslate) {
    lines[0] = lines[0].replace(apiTitle, titleTranslate[apiTitle]);
  };

  const result = lines.join('\n');

  fs.writeFileSync(destPath + outputFile, result);
  console.log(`File ${destPath + outputFile} written.`);
});
