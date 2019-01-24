const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const request = require('request');

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
	// res.redirect('https://raw.githubusercontent.com/Vandesm14/classaware/master/redirect-test.html');
	request('https://raw.githubusercontent.com/Vandesm14/classaware/master/public/' + req.path.substr(6)).pipe(res);
});

app.get('/version', (req, res) => {
	res.sendFile(__dirname + '/public/stable/hold/version.txt');
});

app.listen(3000, () => console.log('server started'));