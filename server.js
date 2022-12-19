
const express = require('express');
const { dirname } = require('path');
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3500;

// middleware to provide response for static and "other" requests
app.use(express.static(path.join(__dirname, '/public')));

// first route for index
app.get('/', (req, res) => {   // can also put '~/$|/index(.html)?' to signify that starts with /, ends w / OR includes the whole shabang or without the file type
    //res.sendFile('./html/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
})

app.get('/newpage', (req, res) => {
    res.send('new page, wassup');
})

app.get('/oldpage', (req, res) => {
    res.redirect(301, '/newpage'); // 302 by default, need 301 for permenant redirect
})

app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'portfolio.html'));
})

app.get('/*', (req, res) => {
    res.status(404).send('that page cannot be found');
})

app.listen(PORT, () => console.log(`Server is listening at localhost on port ${PORT}`));
