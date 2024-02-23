const axios = require('axios');
const fs = require('fs');

// Define the URL
const url = 'https://raw.githubusercontent.com/matecky/bub/keys/keys.json';

// Function to fetch the data from the URL
async function fetchData() {
    try {
        // Fetch data from the URL
        const response = await axios.get(url);

        // Extract the response text
        const responseText = response.data;

        // Define regular expression patterns
        const regexCSection = /let\s+c\s*=\s*'';([\s\S]*?)return\s+c;/;
        const regexFunctionNames = /(?:t\.)?(\w+)\((.*?)\)/g;
        const regexStringConcatenations = /c\s*\+=\s*'(.+?)';/g;

        // Match the content within the variable c definition
        const matchCSection = responseText.match(regexCSection);

        if (matchCSection && matchCSection[1]) {
            const cContent = matchCSection[1];

            // Initialize arrays to store function return values and concatenated strings
            const returnValues = [];
            const concatenatedStrings = [];

            // Match and store function calls and their arguments
            let functionMatches;
            while ((functionMatches = regexFunctionNames.exec(cContent)) !== null) {
                const functionName = functionMatches[1];
                const functionArgument = functionMatches[2] || '';

                // Define the regular expression pattern for extracting function return values
                const regexFunctionReturns = new RegExp(`function\\s+${functionArgument}\\s*\\(\\)\\s*\\{[\\s\\S]*?return\\s+['"](.+?)['"];`);
                
                // Match the content within the variable c definition
                const matchCSection2 = responseText.match(regexFunctionReturns);

                // Extract the return value
                const returnValue = matchCSection2 && matchCSection2[1] ? matchCSection2[1] : 'No return value';
                
                // Store the return value
                returnValues.push(returnValue);
            }

            // Match and store simple string concatenations
            let stringMatches;
            while ((stringMatches = regexStringConcatenations.exec(cContent)) !== null) {
                const concatenatedString = stringMatches[1];
                // Store the concatenated string
                concatenatedStrings.push(concatenatedString);
            }

            // Create the formatted password string
            let password = returnValues[0] + concatenatedStrings.join('') + returnValues[1];

            // Log the password
            console.log("The password is:", password);

            // Write the password to a file
            fs.writeFileSync('password.txt', password);
        } else {
            console.log("Unable to extract the variable c section from the code.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to fetch data
fetchData();
