const reader = require('any-text');
const fs = require('fs')
const path = require('path')
const fields = require('./config')

const parse = data => {
    const regex = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/; //split by sentence
    return data
        .replace(/‘|’/g, '\'')  // replace U+2018 {‘} and U+2019 {’} characters with {'} 
        .replace(/–/g, '-') // replace long dash with short one
        // .replace(/«|»/g, '"') // replace « » to "
        .split(regex)
}

const directoryPath = path.join(__dirname, 'textData');
fs.readdir(directoryPath, function (err, files) {

    if (err)
        return console.log('Unable to scan directory: ' + err);

    const inputFile = files[0]
    const outputFile = `./output/${path.basename(inputFile, path.extname(inputFile))}.json`

    reader
        .getText(`${directoryPath}/${inputFile}`)
        .then(textDataFromFile => {

            const jsonData = {
                ...fields,
                "TextData": parse(textDataFromFile)
            }

            fs.writeFile(outputFile, JSON.stringify(jsonData), (err) => {
                if (err) return console.log(err);
                console.log("Done");
            })

        })
        .catch(err => console.log(err))
});

