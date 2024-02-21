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

        // Define regular expressions to match the return values of the functions
        const regexReturnQ4 = /function\s+Q4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function Q4
        const regexReturnZ4 = /function\s+Z4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function Z4
        const regexReturn$4 = /function\s+\$4\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function $4
        const regexReturnn5 = /function\s+n5\s*\(\)\s*\{[\s\S]*?return\s+['"](.+?)['"];/; // Matches the return statement of function n5

        // Find matches for the return statements in the response text
        const matchReturnQ4 = responseText.match(regexReturnQ4);
        const matchReturnZ4 = responseText.match(regexReturnZ4);
        const matchReturn$4 = responseText.match(regexReturn$4);
        const matchReturnn5 = responseText.match(regexReturnn5);

        // Check if matches are found
        if (matchReturnQ4 && matchReturnZ4 && matchReturn$4 && matchReturnn5) {
            // Extract the return values
            const returnQ4 = matchReturnQ4[1].trim();
            const returnZ4 = matchReturnZ4[1].trim();
            const return$4 = matchReturn$4[1].trim();
            const returnn5 = matchReturnn5[1].trim();

            // Construct the password/key
            const password = returnQ4 + returnZ4 + return$4 + returnn5;

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
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to fetch data
fetchData();
