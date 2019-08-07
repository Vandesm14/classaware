/* jshint esversion: 6 */
var schedules = [{
		name: 'normal',
		days: '35',
		data: {
			times: ['7:50', '8:40', '9:30', '10:20', '11:10', '12:00'],
			names: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'],
			short: ['1', '2', '3', '4', '5', '6']
		}
	},
	{
		name: 'half-day',
		days: '124',
		data: {
			times: ['7:50', '8:40', '9:30'],
			names: ['Period 1', 'Period 2', 'Period 3'],
			short: ['1', '2', '3']
		}
	}
];

var time = -1;
var maxTime = 360;
var periodLength = maxTime / periods;
var remainingTime;

var scheduleIndex;
var currentSchedule;
var periods;
var currentPeriod;

var timerInterval;
var timeOffset = 28800;

getCurrentSchedule();

function increaseTimer() {
	let pointerWidth = $('.timer-pointer').width();
	let timerWidth = $('.timer').outerWidth() - pointerWidth;
	let vw = $(window).width() / 100;

	let cellSpacing = 45;
	let cellWidth = 10;

	time++;
	getCurrentPeriod();
	if (time > maxTime) {
		clearInterval(timerInterval);
		return;
	}

	if ($(window).width() <= 640) {
		cellSpacing = 32;
		cellWidth = 30;
	}

	// Update info
	$('.info-date').text(new Date().toLocaleString().split(', ')[0]);
	$('.info-time').text(new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' '));
	$('.info-day').text('F Day');

	// Move pointer
	$('.timer-pointer').animate({
		// left: ((vw * cellSpacing) + (timerWidth / maxTime) * (time % periodLength)) - (pointerWidth / 2)
	});

	// Move timer
	$('.timer').animate({
		// left: (vw * cellSpacing) - ((vw * cellWidth) * currentPeriod)
		left: (vw * cellSpacing) - ((vw * cellWidth) * currentPeriod)
	});

	// Update columns
	// ======= ADD Condition if not over max period time =======
	// Reset column classes
	$('.timer').children('.timer-column').removeClass('current');
	$('.timer').children('.timer-column').removeClass('next');
	$('.timer').children('.timer-column').css('opacity', '0.2');

	// Set main column class
	$('.timer').children(`.timer-column:eq(${currentPeriod})`).addClass('current');
	$('.timer').children(`.timer-column:eq(${currentPeriod})`).css('opacity', '1');

	// Show secondary columns
	$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).addClass('next');
	$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).css('opacity', '0.5');
	if (currentPeriod - 1 !== -1) {
		$('.timer').children(`.timer-column:eq(${currentPeriod - 1})`).css('opacity', '1');
	}
}

function getCurrentSchedule() {
	// get current day
	let day = new Date().getDay();
	// filter schedules by day
	for (let i in schedules) {
		if (schedules[i].days.includes(day)) {
			scheduleIndex = i;
			break;
		}
	}
	// set current schedule variable
	periods = schedules[scheduleIndex].data.times.length;
	currentSchedule = schedules[scheduleIndex];
	periodLength = 50*60;
	// set timer columns to names
	createColumns();
}

function createColumns() {
	let template = $('#column-template').html();
	for (let i in schedules[scheduleIndex].data.short) {
		let hold = template.replace('{{name}}', schedules[scheduleIndex].data.short[i]);
		$('.timer').append(hold);
	}

	timerInterval = setInterval(increaseTimer, 1000);
	increaseTimer();
}

function getCurrentPeriod() {
	// let remainingTime;
	// get current time

	// DEV offset
	let time = new Date();
	time.setTime(time.getTime() + (timeOffset * 1000));

	// find position in times array
	for (let i in currentSchedule.data.times) {
		let periodTime = new Date();
		periodTime.setHours(currentSchedule.data.times[i].split(':')[0]);
		periodTime.setMinutes(currentSchedule.data.times[i].split(':')[1]);
		periodTime.setSeconds(0);

		if (time < periodTime) {
			// perform subtraction function
			remainingTime = periodTime - time;
			currentPeriod = i;
			break;

			// console.table([periodTime.toLocaleString(), time.toLocaleString(), new Date(remainingTime).toLocaleString().split(', ')[1], currentPeriod	]);
		}
	}
	// output time left
	$('.timer-pointer-label').text(parseTime(new Date(remainingTime)) + ' left');
}

function parseTime(date) {
	let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return date.getMinutes() + ':' + seconds;
}