const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + '/public/'));
// app.use('/beta', express.static('public/beta'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/stable/index.html');
});

app.get('/beta', (req, res) => {
	// res.sendFile(__dirname + '/public/beta/index.html');
	res.send('The beta is now closed.');
});

app.get('/version', (req, res) => {
	res.sendFile(__dirname + '/public/hold/version.txt');
});

app.listen(3000, () => console.log('server started'));