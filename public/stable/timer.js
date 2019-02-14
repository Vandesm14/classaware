function changeColorScheme(scheme, preload = false) {
	if (localStorage.getItem('color') && preload) {
		scheme = localStorage.getItem('color');
		document.getElementById('colorSelect')[parseInt(scheme)].selected = true;
	} else if (preload && !localStorage.getItem('color')) {
		document.getElementById('npdarkop').selected = true;
	}
	localStorage.setItem('color', scheme);
	let sheets = document.styleSheets;
	for (i = 1; i < sheets.length; i++) {
		if (!["http://w.likebtn.com/css/w/icons.css?v=37", "http://w.likebtn.com/css/w/widget.css?v=37", window.location + 'alerts/alerts.css'].includes(sheets[i].href)) {
			sheets[i].disabled = true;
		}
	}
	sheets[parseInt(scheme) + 1].disabled = false;
}

changeColorScheme(1, true);

function openSettings() {
	document.getElementById('settingsWindow').style.display == 'none' ? document.getElementById('settingsWindow').style.display = 'block' : document.getElementById('settingsWindow').style.display = 'none';
}

var dsecs = new Date();
var csecs = 0;
var secs = 0;
var offsetVar = 0;

// setTimeout(function(){x = document.getElementById('snow'); x.parentNode.removeChild(x);}, 6000);

function killSnow() {
	x = document.getElementById('snow');
	// x.parentNode.removeChild(x);
	x.style.display = x.style.display == 'none' ? '' : 'none';
}

var scrollIndex = 0;
var scrollText = [
	'1.3 Has been released! Please notify me of any errors!',
	'A new layout is coming soon!',
	'This is the new newsfeed system. Tell me what you think!',
	'The personal schedule maker is creating errors. This will be fixed soon!',
	'Top bar: Class & Bottom bar: School Day',
	'Share this website with your friends!',
];
// setInterval(newsfeedAdd, 5000);

var normT = [29700, 32760, 35820, 38880, 41940, 45000, 48060, 51120];
var ktT = [29100, 31920, 34740, 37020, 39840, 42660, 45480, 48300, 51120];
var nBT = [29340, 32160, 34980, 37800, 40620, 43440, 46260, 49080, 51120];
var delayT = [35700, 37740, 39780, 42120, 44460, 46800, 49080, 51120];
var halfT = [29760, 33000, 36300, 39600];

var norm = ['1', '2', '3', '4', '5', '6', '7', '8'];
var kt = ['1', '2', '3', 'KT', '4', '5', '6', '7', '8'];
var nB = ['1', '2', '3', '4', '5', '6', '7', '8', '8-B'];
var delay = ['1', '2', '3', '4', '5', '6', '7', '8'];
var half = ['1', '2', '3', '8'];

var normD = [3240, 3060, 3060, 3060, 3060, 3060, 3060, 3060];
var ktD = [2640, 2820, 2820, 2280, 2820, 2820, 2820, 2820, 2820];
var nBD = [2880, 2820, 2820, 2820, 2820, 2820, 2820, 2820, 2040];
var delayD = [2040, 1800, 1800, 2100, 2100, 2100, 2040, 1800];
var halfD = [3300, 3000, 3060, 3060];

var letterDays = [
	'','E','','',
	'F','A','B','C','D','','',
	'E','F','A','B','C','','',
	'D','E','F','A','B','','',
	'C','D','E','F','A','','',
]; // Starts 2/1/19 (At index 1)
var dayOffset = 0;

var actT = [];
var act = [];
var actD = [];

var perOn = false;
var perArr = [];

var resT = [];
var res = [];
var resD = [];

var startTime = 51120;

var nsecs = 0;
var index = 0;

var period = '';
var timer = '';
var time = '';
var next = '';
var ampm = '';

var load = 0;
var generate = false;
var weekend = false;

switch (dsecs.getDay()) {
	case 1:
	case 5:
		actT = normT;
		act = norm;
		actD = normD;
		break;
	case 2:
	case 4:
		actT = ktT;
		act = kt;
		actD = ktD;
		break;
	case 3:
		actT = nBT;
		act = nB;
		actD = nBD;
		break;
	default:
		generate = false;
		weekend = true;
}

resT = actT;
res = act;
resD = actD;
setInterval(updsecs, 1000);

function updsecs() {
	switch (document.getElementById('alternate').value) {
		case '0':
			actT = resT;
			act = res;
			break;
		case '1':
			actT = normT;
			act = norm;
			actD = normD;
			break;
		case '2':
			actT = ktT;
			act = kt;
			actD = ktD;
			break;
		case '3':
			actT = nBT;
			act = nB;
			actD = nBD;
			break;
		case '4':
			actT = delayT;
			act = delay;
			actD = delayD;
			break;
		case '5':
			actT = halfT;
			act = half;
			actD = halfD;
			break;
		case '6':
			actT = [ 28260,30300,37920,40560,43200,45840,48480,51120 ];
			act = ['1', '2', '3', '4', '5', '6', '7', '8'];
			actD = [ 1800,2040,7620,2640,2640,2640,2640,2640 ];
	}
	var offset = 0;
	dsecs = new Date();
	csecs =
		dsecs.getSeconds() + 60 * dsecs.getMinutes() + 60 * 60 * dsecs.getHours();
	csecs = (csecs | 0) - 0;

	for (i = 0; i < actT.length; i++) {
		if (csecs < actT[i] && load == 0) {
			nsecs = actT[i];
			index = i;
			load = 1;
		}
	}

	load = 0;

	perOn == true
		? (period = 'Period ' + act[index] + '<br>' + perArr[index])
		: (period = 'Period ' + act[index]);

	if (dsecs.getHours() < 12) {
		ampm = ' am';
	} else if (csecs > 43200) {
		ampm = ' pm';
	}

	if (dsecs.getHours() == 12) {
		dsecs.getMinutes() < 10
			? (time = '12' + ':0' + dsecs.getMinutes() + ampm)
			: (time = '12' + ':' + dsecs.getMinutes() + ampm);
	} else {
		dsecs.getMinutes() < 10
			? (time = dsecs.getHours() % 12 + ':0' + dsecs.getMinutes() + ampm)
			: (time = dsecs.getHours() % 12 + ':' + dsecs.getMinutes() + ampm);
	}

	timer =
		Math.floor((nsecs - csecs) / 60 % 60) +
		((nsecs - csecs) % 60 < 10 ? ':0' : ':') +
		(nsecs - csecs) % 60 +
		' Left';
	if (weekend == false) {
		csecs > 51120 ? (generate = false) : (generate = true);
	}

	document.getElementById('Timer').className = nsecs - csecs <=
		420 && generate
		? 'red'
		: 'lightgrey';
	if (nsecs - csecs == 1080 && generate) {
		document.getElementById('Timer').className = 'yellow';
		setTimeout(function () {
			document.getElementById('Timer').className = 'lightgrey';
			setTimeout(function () {
				document.getElementById('Timer').className = 'yellow';
				setTimeout(function () {
					document.getElementById('Timer').className = 'lightgrey';
				}, 1000);
			}, 1000);
		}, 1000);
	}

	next = 'Next Period: ';
	next += act[index + 1] == undefined ? 'N/A' : act[index + 1];

	if (generate == true) {
		document.getElementById('Date').innerHTML = dsecs.toDateString();
		document.getElementById('Day').innerHTML = letterDays[dsecs.getDate() - dayOffset] + ' Day';
		document.getElementById('Period').innerHTML = period;
		document.getElementById('Timer').innerHTML = timer;
		document.getElementById('Time').innerHTML = time;
		document.getElementById('Next').innerHTML = next;
		document.getElementById('title').innerHTML = timer + ' of ' + act[index];
		if (
			window.innerWidth * ((nsecs - csecs) / actD[index]) >
			window.innerWidth - 2
		) {
			document.getElementById('bar').innerHTML = '100%';
			document.getElementById('bar').style.width =
				document.getElementById('box').style.width + 'px';
		} else {
			document.getElementById('bar').style.width =
				window.innerWidth * ((nsecs - csecs) / actD[index]) + 'px';
			document.getElementById('bar').innerHTML =
				((nsecs - csecs) / actD[index] * 100).toFixed(0) + '%';
		}

		if (
			window.innerWidth *
			((actT[actT.length - 1] - csecs) / actT[actT.length - 1]) >
			window.innerWidth - 2
		) {
			// document.getElementById('bar2').innerHTML = '100%';
			// document.getElementById('bar2').style.width =
			// 	document.getElementById('box2').style.width + 'px';
		} else {
			// document.getElementById('bar2').style.width =
			// 	window.innerWidth * (csecs / startTime - 26460) +
			// 	'px';
			// document.getElementById('bar2').innerHTML =
			// 	((csecs / startTime - 26460) * 100).toFixed(0) + '%';
		}
	} else {
		document.getElementById('title').innerHTML = 'Not School Hours';
		document.getElementById('Date').innerHTML = dsecs.toDateString();
		document.getElementById('Day').innerHTML = 'N/A';
		document.getElementById('Period').innerHTML = 'Not School Hours';
		document.getElementById('Timer').innerHTML = 'N/A';
		document.getElementById('Time').innerHTML = time;
		document.getElementById('Next').innerHTML = 'N/A';
	}
}