const df = require('data-forge');
require('data-forge-fs');

exports.getFile = function getFile(filename) {
    return result = df.readFileSync(filename)
                        .parseCSV();
};

exports.getCategory = function getCategory(data, categoryIdColumn, categoryDescColumn) {
    return data
            .groupBy(row => row[categoryIdColumn])
            .select(group => {
                return {
                    [categoryIdColumn]: group.first()[categoryIdColumn],
                    [categoryDescColumn]: group.deflate(row => row[categoryDescColumn]).first()
                };
            })
            .orderBy(row => row[categoryIdColumn])
            .inflate();
};
