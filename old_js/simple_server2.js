
const express = require('express');
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3500;

// first route
app.get('/', (req, res) => {
    res.send('indx route. welcome.');
})

server.listen(PORT, () => console.log('Server is listening at localhost on port 5000'));
