const axios = require('axios');
const fs = require('fs');
const simpleGit = require('simple-git')();

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
        const regexCSection = /let\s+c\s*=\s*'';[\s\S]*?c\s*\+=\s*'(.+?)';[\s\S]*?c\s*\+=\s*'(.+?)';[\s\S]*?c\s*\+=\s*'(.+?)';[\s\S]*?c\s*\+=\s*'(.+?)';[\s\S]*?return\s+c;/;
 // Define regular expressions to match the return values of the functions
 const regexReturnQ4 = /function\s+Q4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function Q4
 const regexReturnZ4 = /function\s+Z4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function Z4
 const regexReturn$4 = /function\s+\$4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function $4
 const regexReturnn5 = /function\s+n5\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function n5

        // Match the first option: extraction of password/key
        const matchReturnQ4 = responseText.match(regexReturnQ4);
        const matchReturnZ4 = responseText.match(regexReturnZ4);
        const matchReturn$4 = responseText.match(regexReturn$4);
        const matchReturnn5 = responseText.match(regexReturnn5);

        let password = '';

        // Check if matches are found for the first option
        if (matchReturnQ4 && matchReturnZ4 && matchReturn$4 && matchReturnn5) {
            const returnQ4 = matchReturnQ4[1].trim();
            const returnZ4 = matchReturnZ4[1].trim();
            const return$4 = matchReturn$4[1].trim();
            const returnn5 = matchReturnn5[1].trim();

            // Construct the password/key
            password = returnQ4 + returnZ4 + return$4 + returnn5;

            console.log("The password/key is:", password);

            // Write the password to a file
            fs.writeFileSync('password.txt', password);

            // Push changes to the keys branch
            await simpleGit.add('.')
                .commit('Update password')
                .push(['-f', 'origin', 'keys']);

            console.log('Password updated and pushed to keys branch');
        } else {
            console.log("Return statements for the specified functions not found in the response.");

            // Match the second option if the first one fails
            const matchCSection = responseText.match(regexCSection);

            // Check if matches are found for the second option
            if (matchCSection && matchCSection.length >= 5) {
                const c1 = matchCSection[1];
                const c2 = matchCSection[2];
                const c3 = matchCSection[3];
                const c4 = matchCSection[4];

                // Concatenate the strings
                password = c1 + c2 + c3 + c4;
                console.log("The password/key is:", password);

                // Write the password to a file
                fs.writeFileSync('password.txt', password);
            } else {
                console.log("Unable to extract the variable c section from the code.");
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


// Call the function to fetch data
fetchData();
