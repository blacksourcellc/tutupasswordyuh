const axios = require('axios');
const fs = require('fs');
// Define the URL
const url = 'https://raw.githubusercontent.com/matecky/bub/keys/keys.json';

async function fetchData() {
    try {
        const response = await axios.get(url);
        const responseText = response.data;

        // Define the regex to extract the structure of the c section
        const regexCSection = /(?:let|const)\s+c\s*=\s*(?:''|")(.+?)(?:''|");|let\s+c\s*=\s*'';([\s\S]*?)return\s+c;/;
        const matchCSection = responseText.match(regexCSection);

        if (matchCSection && (matchCSection[1] || matchCSection[2])) {
            const cContent = matchCSection[1] || matchCSection[2];
            console.log("CSECTION: ", JSON.stringify(cContent));

            const data = {
                functionData: [],
                concatenatedStrings: [],
                finalPassword: ''
            };

   // Define regex patterns for string extraction and function argument extraction
const regexString = /'(.*?)'/g;
const regexFunctionArgument = /(?:t\.)?\w+\((.*?)\)/g;
// Determine the number of steps needed based on the length of cContent
const numSteps = 4;
// Define an array to store extracted items
const extractedItems = [];

// Iterate through each step
for (let i = 0; i < numSteps; i++) {
    // Extract the current step content
    const currentStepContent = cContent.split(';')[i];

    // Check if the current step content is a string
    if (currentStepContent.includes("'")) {
        const regexStringMatches = currentStepContent.match(regexString);
        if (regexStringMatches) {
            regexStringMatches.forEach(match => {
                extractedItems.push(match.substring(1, match.length - 1)); // Remove the quotes
                console.log(`Step ${i + 1} - Extracted String: ${match.substring(1, match.length - 1)}`);
            });
        } else {
            console.log(`Step ${i + 1} - No string found.`);
        }
        
    } else {
        // Extract function argument
        let match;
        while ((match = regexFunctionArgument.exec(currentStepContent)) !== null) {
            
                // Define the regular expression pattern for extracting function return values
                const regexFunctionReturns = new RegExp(`function\\s+${match[1]}\\s*\\(\\)\\s*\\{[\\s\\S]*?return\\s+['"](.+?)['"];`);
                
                // Match the content within the variable c definition
                const matchCSection2 = responseText.match(regexFunctionReturns);

                // Extract the return value
                const returnValue = matchCSection2 && matchCSection2[1] ? matchCSection2[1] : 'No return value';
                
            extractedItems.push(returnValue);
            console.log(`Step ${i + 1} - Extracted Function Argument: ${match[1]}`);
        }
       
    }
}


// Output the extracted items as a string
console.log("Extracted Items:", extractedItems.join(''));


            // Further processing or output as needed
            // data.finalPassword = data.concatenatedStrings.join('');
            // console.log("Final Password:", data.finalPassword);
             fs.writeFileSync('password.txt', extractedItems.join(''));
        } else {
            console.log("Unable to extract the variable c section from the code.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();
