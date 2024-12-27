const express = require('express');
const { number } = require('joi');
const path = require('path');
const { password } = require('../validation/custom.validation');

const app = express();

// Define the route to serve the image
app.get('/get-image/:id', (req, res) => {
    const image_to_find = req.params.id
    // console.log(image_to_find)
    // console.log(__dirname, "---------------__dirname---------------");
    // const imagePath = path.join(__dirname,"eventBookings", '1735290164184-anantnew.jpeg');
    const imagePath = path.join(__dirname, "eventBookings", image_to_find);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error serving the image.');
        }
    });
});

app.get('/get-qr/:id', (req, res) => {
    const image_to_find = req.params.id
    // console.log(image_to_find)
    // console.log(__dirname, "---------------__dirname---------------");
    // 'qrcode_0_676e77d8b5a86167eb46e30c.png'
    const imagePath = path.join(__dirname, "qrCode", image_to_find);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error serving the image.');
        }
    });
});

app.get('/get-event/:id', (req, res) => {
    const image_to_find = req.params.id
    // console.log(image_to_find)
    // console.log(__dirname, "---------------__dirname---------------");
    const imagePath = path.join(__dirname, "eventDetails", image_to_find);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error serving the image.');
        }
    });
});
module.exports = app;

