var fs = require('fs');
var rimraf = require('rimraf');

// Params
let numberOfFilesPerBatch = 500;
// End of params

let currentFileIdentifier = 0;
let currentBatch = [];

// Clear the folder so any previous file will be deleted
rimraf('./parsedFiles', () => {
    // Create the folder
    fs.mkdirSync('./parsedFiles');

    // Read the file that contains the cids
    fs.readFile('./cids.txt', 'utf8', (error, data) => {
        // Split the file contents into an array
        data = data.split(',');
        // For each element
        data.forEach((e, i) => {
            // Push it into the current working batch
            currentBatch.push(e);
            // If the current batch has the desired size
            if((i+1)%numberOfFilesPerBatch === 0) {
                writeBatch();
            }
        });
        // If after writing the files, the current batch does not have yet the desired size
        // But has at least one element, write another file
        if (currentBatch.length > 0) {
            writeNewFile(currentBatch.join(','));
        }
    });
});

function writeBatch() {
    writeNewFile(currentBatch.join(','));
    currentFileIdentifier++;
    currentBatch = [];
}

function writeNewFile(cidsBatch) {
    fs.writeFile(`./parsedFiles/batch-${currentFileIdentifier}.txt`, cidsBatch, (err) => {
        if (err) throw err;
    });
}