const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/timer.html');
});

app.listen(5500, () => console.log('server started on port: ' + 5500));