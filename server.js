const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

// Airtable configuration
const AIRTABLE_API_KEY = 'patQpyHsL9q07f4Pl.12362fe9b2e62ac082176d07908832b94bb6a8e21161a27aaaead7a8d08ebc69';
const AIRTABLE_BASE_ID = 'appNhuHZMjyAeV8gT';
const AIRTABLE_TABLE_NAME = encodeURIComponent('Form Submissions');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the form HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { firstName, lastName, email, phone, streetAddress, bedrooms, bathrooms, frequency } = req.body;

    try {
        await axios.post(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            fields: {
                'First Name': firstName,
                'Last Name': lastName,
                'Email': email,
                'Phone': phone,
                'Street Address': streetAddress,
                'Bedrooms': bedrooms,
                'Bathrooms': bathrooms,
                'Cleaning Frequency': frequency
            }
        }, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Form submission successful!');
    } catch (error) {
        console.error('Error saving form submission:', error.response ? error.response.data : error.message);
        res.status(500).send('Error saving form submission.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

