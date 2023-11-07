const fs = require('fs');
const { PDFDocument,rgb } = require('pdf-lib');
const express = require('express');

let jsonData; 

//Task 1

// Read the data.json file
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error in reading data.json:', err);
        return;
    }

    // Parse the JSON data into a JavaScript object
     jsonData = JSON.parse(data);

    // Modify the object 
    jsonData.isAdmin = false;

    // Print the modified object to the console
    console.log('Modified Data:', jsonData);

    // Write the modified object to modified_data.json
    fs.writeFile('modified_data.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error in writing modified_data.json:', err);
        } else {
            console.log('Successfully wrote modified_data.json');

            //call generatePDF
            generatePDF();

        }
    });
});

//Task 2

// Create a new PDF document

const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize()


    // Add the modified data to the PDF document
    page.drawText('Modified Data:\n' + JSON.stringify(jsonData, null, 2), {
        x: 50,
        y: height - 200,
        fontColour: rgb(0, 0, 0)
    });

    // Save the PDF document to result.pdf
    try {
        const pdfBytes = await pdfDoc.save();
        fs.writeFile('result.pdf', pdfBytes, (err) => {
            if (err) {
                console.error('Error writing result.pdf:', err);
            } else {
                console.log('Successfully wrote result.pdf');
            }
        });
    } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
    }
};

//Task 3

const app = express();
const port = 3000;

// Define a GET route that responds with the modified data as JSON
app.get('/modifiedData', (req, res) => {
    res.json({
        modifiedData: {
            name: 'John Doe',
            age: 25,
            email: 'john@example.com',
            isAdmin: false
        }
    });
});

// Start the Express.js server on port 3000
app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});

