/* jshint esversion: 6 */
var schedules = [{
		name: 'normal',
		days: '0123456',
		data: {
			startTime: '7:21',
			times: ['8:15', '9:06', '9:57', '10:48', '11:39', '12:30', '13:21', '14:12'],
			names: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'],
			short: ['1', '2', '3', '4', '5', '6', '7', '8']
		}
	},
	{
		name: 'half-day',
		days: '124',
		data: {
			startTime: '7:00',
			times: ['7:50', '8:40', '9:30'],
			names: ['Period 1', 'Period 2', 'Period 3'],
			short: ['1', '2', '3']
		}
	}
];

var remainingTime;
var scheduleIndex;
var currentSchedule;
var periods;
var currentPeriod;
var periodLength;

var timerInterval;
var devOffest = 0;

getCurrentSchedule();

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
	// set timer columns to names
	createColumns();
}

function createColumns() {
	let template = $('#column-template').html();
	for (let i in schedules[scheduleIndex].data.short) {
		let hold = template.replace('{{name}}', schedules[scheduleIndex].data.short[i]);
		hold = hold.replace('{{endTime}}', schedules[scheduleIndex].data.times[i]);
		$('.timer').append(hold);
	}

	timerInterval = setInterval(increaseTimer, 1000);
	increaseTimer();
}

function increaseTimer() {
	let pointerWidth = $('.timer-pointer').width();
	let timerWidth = $('.timer').outerWidth() - pointerWidth;
	let vw = $(window).width() / 100;

	let cellSpacing = 45;
	let cellWidth = 10;

	let date = new String(new Date()).split(' ').splice(0,3).join(' ');
	let time = new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' ')

	// ======= ADD Condition if not over max period time =======
	getCurrentPeriod();

	if ($(window).width() <= 640) {
		cellSpacing = 32;
		cellWidth = 30;
	}

	// Update info
	// $('.info-date').text(new Date().toLocaleString().split(', ')[0]);
	$('.info-date').text(new String(new Date()).split(' ').splice(0,3).join(' '));
	$('.info-time').text(new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' '));
	$('.info-day').text('F Day');

	// Move pointer
	$('.timer-pointer').animate({
		// left: ((vw * cellSpacing) + (timerWidth / maxTime) * (time % periodLength)) - (pointerWidth / 2)
		left: (vw * cellSpacing) + (vw * cellWidth * ((periodLength - remainingTime) / periodLength))
	});

	// Move timer
	$('.timer').animate({
		left: (vw * cellSpacing) - ((vw * cellWidth) * currentPeriod)
	});

	// Reset column classes
	$('.timer').children('.timer-column').removeClass('current');
	$('.timer').children('.timer-column').removeClass('next');
	// $('.timer').children('.timer-column').css('opacity', '0.2');
	$('.timer').children('.timer-column').css('opacity', '0.5');

	// Set main column class
	$('.timer').children(`.timer-column:eq(${currentPeriod})`).addClass('current');
	$('.timer').children(`.timer-column:eq(${currentPeriod})`).css('opacity', '1');

	// Show secondary columns
	$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).addClass('next');
	// $('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).css('opacity', '0.5');
	$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).css('opacity', '0.8');
	if (currentPeriod - 1 !== -1) {
		$('.timer').children(`.timer-column:eq(${currentPeriod - 1})`).css('opacity', '1');
	}
}

function getCurrentPeriod() {
	// DEV offset
	let time = new Date();
	time.setTime(time.getTime() + (devOffest * 1000));

	// find position in times array
	for (let i in currentSchedule.data.times) {
		let periodTime = new Date();
		let previousPeriodTime = new Date();
		periodTime.setHours(currentSchedule.data.times[i].split(':')[0]);
		periodTime.setMinutes(currentSchedule.data.times[i].split(':')[1]);
		periodTime.setSeconds(0);

		if (time < periodTime) {
			// perform subtraction function
			remainingTime = periodTime - time;
			currentPeriod = parseInt(i);

			// get period duration
			if (i === 0) {
				previousPeriodTime.setHours(currentSchedule.data.startTime.split(':')[0]);
				previousPeriodTime.setMinutes(currentSchedule.data.startTime.split(':')[1]);
			} else {
				previousPeriodTime.setHours(currentSchedule.data.times[i - 1].split(':')[0]);
				previousPeriodTime.setMinutes(currentSchedule.data.times[i - 1].split(':')[1]);
			}
			previousPeriodTime.setSeconds(0);

			periodLength = periodTime - previousPeriodTime;
			break;
		}
	}

	// output time left
	if (remainingTime === undefined) {
		$('.timer-pointer-label').text('End');
		$('.timer-period-label').text('');
	} else {
		$('.timer-pointer-label').text(parseTime(new Date(remainingTime)) + ' left');
		$('.timer-period-label').text(schedules[scheduleIndex].data.names[currentPeriod]);
	}
}

function parseTime(date) {
	let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	let hours = date / 3600000 < 1 ? '' : Math.floor(date / 3600000) + ':';
	let minutes;
	if (date.getMinutes() !== 0) {
		minutes = date.getMinutes() < 10 && hours !== '' ? '0' + date.getMinutes() : date.getMinutes() + ':';
	} else {
		minutes = '';
	}
	return hours + minutes + seconds;
}