const df = require('data-forge');
require('data-forge-fs');
const hf = require('./helperFunctions.js');

let args = require('minimist')(process.argv.slice(2));

const destPath = '../nashville/metro-general-government-employees-demographic-data/renamed-csv/';
const templateFile = args['templateFile'];

const originPath = '../local/';
const newFile = args['downloadedFile'];
const outFileName = args['outputFile'];

// load some existing data to use as a template
//
let currentData = hf.getFile(destPath + templateFile);
console.log('Previous data file loaded, to use as template ...');
                
// extract the job categories with their codes into a new data frame
// these are the job categories that exist in the current data
// and add a category of 'Unknown'
// 
let jobCategories = hf.getCategory(currentData, 'EEO Job Category', 'EEO Job Category Description')
                        .concat(new df.DataFrame([{
                            'EEO Job Category': '99',
                            'EEO Job Category Description': 'Unknown'
                        }]));
console.log('\nJob categories: \n', jobCategories.toCSV());

// extract the ethnicities along wiht their ethnic codes into a new data frame
// these are the ethnic codes that exist in the current data
// 
let ethnicCategories = hf.getCategory(currentData, 'Ethnic Code', 'Ethnic Code Description');
console.log('\nEthnic categories: \n', ethnicCategories.toCSV());

// load the new data
// and replace any missing ethnic descriptions with 'Two or More Races'
// and replace any missing job descriptions with 'Unknown'
//
let newData = hf.getFile(originPath + newFile)
                .select(row => {
                    if (row['Ethnic Code Description'].trim() === '' || row['Ethnic Code Description'] === null) {
                        row['Ethnic Code Description'] = 'Two or More Races';
                    };

                    if (row['EEO Job Category Description'].trim() === '' || row['EEO Job Category Description'] === null) {
                        row['EEO Job Category Description'] = 'Unknown'
                    };

                    return row;
                });
// join jobCategories and ethnicCategories to the newly loaded data
// to make sure the job codes, and ethnic codes are consistent with
// previous data.
//
let combined = newData
    .join(
        jobCategories,
        left => left["EEO Job Category Description"],
        right => right["EEO Job Category Description"],
        (left, right) => {
            return {
                'Pay Grade / Step': left['Pay Grade / Step'],
                'Annual Salary': left['Annual Salary'],
                'Class': left['Class'],
                'Title': left['Title'],
                'Current Department': left['Current Department'],
                'Employment Status': left['Employment Status'],
                'EEO Job Category': right['EEO Job Category'],
                'EEO Job Category Description': left['EEO Job Category Description'],
                'Gender': left['Gender'],
                'Ethnic Code Description': left['Ethnic Code Description'],
                'Year of Birth': left['Year of Birth'],
                'Date Started': left['Date Started'],
                'FLSA Exempt?': left['FLSA Exempt?'],
                'County': left['County']
            }
        }
    )
    .join(
        ethnicCategories,
        left => left["Ethnic Code Description"],
        right => right["Ethnic Code Description"],
        (left, right) => {
            return {
                'Pay Grade / Step': left['Pay Grade / Step'],
                'Annual Salary': left['Annual Salary'],
                'Class': left['Class'],
                'Title': left['Title'],
                'Current Department': left['Current Department'],
                'Employment Status': left['Employment Status'],
                'EEO Job Category': left['EEO Job Category'],
                'EEO Job Category Description': left['EEO Job Category Description'],
                'Gender': left['Gender'],
                'Ethnic Code': right['Ethnic Code'],
                'Ethnic Code Description': left['Ethnic Code Description'],
                'Year of Birth': left['Year of Birth'],
                'Date Started': left['Date Started'],
                'FLSA Exempt?': left['FLSA Exempt?'],
                'County': left['County']
            }
        }
    );

// check if the columns in the template data and the newly loaded and
// adjusted data, are the same and in the same order.
// if they are, then write the new file to renamed-csv folder
// if they are not, then display some information about the columns, and 
// exit the application.
//
if (currentData.getColumnNames().every((v, i) => v === combined.getColumnNames()[i])) {
    console.log('\nCols in new data match all cols in current data.');
    console.log('new, num rows: ', newData.count());
    console.log('combined, new rows: ', combined.count());

    combined.asCSV().writeFileSync(destPath + outFileName);
    console.log('\nNew file ', outFileName, ' written to ', destPath, ' directory\n');
} else {
    console.log("Cols in current data: ",currentData.getColumnNames());
    console.log("Cols in new combined data: ", combined.getColumnNames());

    console.log('current, num cols: ', currentData.getColumnNames().length);
    console.log('combined, num cols: ', combined.getColumnNames().length);
    console.log(combined.head(10).toStrings("Date Started", "MM/DD/YYYY").toCSV());

    process.exitCode = 1;
}
