/* jshint esversion: 6 */

$(document).ready(function () {
	$('#toggleEditor').on('click', function () {
		toggleEditor();
	});
	$('#submitEditor').on('click', function () {
		submitClasses();
	});
	$('#deleteClasses').on('click', function () {
		deleteClasses();
	});
	$('.schedule-selector').on('change', function () {
		changeSchedule();
	});
});

var schedules = [{
		name: 'Normal',
		days: '15',
		data: {
			startTime: '7:21',
			times: ['8:15', '9:06', '9:57', '10:48', '11:39', '12:30', '13:21', '14:12'],
			names: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'],
			short: ['1', '2', '3', '4', '5', '6', '7', '8']
		}
	},
	{
		name: '8B',
		days: '3',
		data: {
			startTime: '7:21',
			times: ['8:09', '8:56', '9:43', '10:30', '11:17', '12:04', '12:51', '1:38', '2:12'],
			names: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8', '8B'],
			short: ['1', '2', '3', '4', '5', '6', '7', '8', '8B']
		}
	},
	{
		name: 'KT',
		days: '24',
		data: {
			startTime: '7:21',
			times: ['8:05', '8:52', '9:39', '10:17', '11:04', '11:51', '12:38', '1:25', '2:12'],
			names: ['Period 1', 'Period 2', 'Knight Time', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'],
			short: ['1', '2', 'KT', '3', '4', '5', '6', '7', '8']
		}
	}
];

var remainingTime;
var scheduleIndex;
var currentSchedule;
var periods;
var currentPeriod;
var periodLength;

var normalIndex;
var customClasses;
var timerInterval;
var devOffest = 0;

getCurrentSchedule();

function getCurrentSchedule() {
	if (localStorage.getItem('customClasses') !== undefined) {
		customClasses = JSON.parse(localStorage.getItem('customClasses'));
	}
	// get current day
	let day = new Date().getDay();
	// filter schedules by day
	for (let i in schedules) {
		if (schedules[i].days.includes(day)) {
			scheduleIndex = i;
			normalIndex = i;
			break;
		}
	}
	// set current schedule variable
	periods = schedules[scheduleIndex].data.times.length;
	currentSchedule = schedules[scheduleIndex];
	// set timer columns to names
	createColumns();
	createClassRows();
	createSelectOptions();

	timerInterval = setInterval(increaseTimer, 1000);
	increaseTimer();
}

function createColumns() {
	let template = $('#column-template').html();
	$('.timer').html('');
	for (let i in schedules[scheduleIndex].data.short) {
		let hold = template.replace('{{name}}', schedules[scheduleIndex].data.short[i]);
		hold = hold.replace('{{endTime}}', schedules[scheduleIndex].data.times[i]);
		$('.timer').append(hold);
	}
}

function createClassRows() {
	let allClasses = [];
	for (let i in schedules) {
		for (let k in schedules[i].data.names) {
			if (!allClasses.includes(schedules[i].data.names[k])) {
				allClasses.push(schedules[i].data.names[k]);
			}
		}
	}

	let template = $('#class-template').html();
	for (let i in allClasses) {
		let hold = template.replace('{{class}}', allClasses[i]);
		if (customClasses !== null) {
			hold = hold.replace('{{customClass}}', customClasses[allClasses[i]]);
		} else {
			hold = hold.replace('{{customClass}}', '');
		}
		$('.form-row-container').append(hold);
	}
}

function createSelectOptions() {
	let template = $('#select-option-template').html();
	for (let i in schedules) {
		let hold = template.replace(/{{name}}/g, schedules[i].name);
		$('.schedule-selector').append(hold);
	}
}

function increaseTimer() {
	let pointerWidth = $('.timer-pointer').width();
	let timerWidth = $('.timer').outerWidth() - pointerWidth;
	let vw = $(window).width() / 100;

	let cellSpacing = 45;
	let cellWidth = 10;

	let date = new String(new Date()).split(' ').splice(0, 3).join(' ');
	let time = new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' ')

	// ======= ADD Condition if not over max period time =======
	getCurrentPeriod();

	if ($(window).width() <= 640) {
		cellSpacing = 32;
		cellWidth = 30;
	}

	// Update info
	// $('.info-date').text(new Date().toLocaleString().split(', ')[0]);
	$('.info-date').text(new String(new Date()).split(' ').splice(0, 3).join(' '));
	$('.info-time').text(new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' '));
	// $('.info-day').text('F Day');
	$('.info-day').text('');

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
	let period;

	// find position in times array
	// for (let i in currentSchedule.data.times) {
	for (let i in schedules[scheduleIndex].data.times) {
		let periodTime = new Date();
		let previousPeriodTime = new Date();
		// periodTime.setHours(currentSchedule.data.times[i].split(':')[0]);
		periodTime.setHours(schedules[scheduleIndex].data.times[i].split(':')[0]);
		// periodTime.setMinutes(currentSchedule.data.times[i].split(':')[1]);
		periodTime.setMinutes(schedules[scheduleIndex].data.times[i].split(':')[1]);
		periodTime.setSeconds(0);

		
		if (time < periodTime) {
			// perform subtraction function
			remainingTime = periodTime - time;
			currentPeriod = parseInt(i);
			
			// get period duration
			if (i == 0) { // Not triple "=" since i is a string, not a number
				// previousPeriodTime.setHours(currentSchedule.data.startTime.split(':')[0]);
				previousPeriodTime.setHours(schedules[scheduleIndex].data.startTime.split(':')[0]);
				// previousPeriodTime.setMinutes(currentSchedule.data.startTime.split(':')[1]);
				previousPeriodTime.setMinutes(schedules[scheduleIndex].data.startTime.split(':')[1]);
			} else {
				// previousPeriodTime.setHours(currentSchedule.data.times[i - 1].split(':')[0]);
				previousPeriodTime.setHours(schedules[scheduleIndex].data.times[i - 1].split(':')[0]);
				// previousPeriodTime.setMinutes(currentSchedule.data.times[i - 1].split(':')[1]);
				previousPeriodTime.setMinutes(schedules[scheduleIndex].data.times[i - 1].split(':')[1]);
			}
			previousPeriodTime.setSeconds(0);

			periodLength = periodTime - previousPeriodTime;
			break;
		}
	}

	// output time left
	if (remainingTime === undefined) {
		$('.timer-pointer-label').text('End of Day');
		$('.timer-period-label').text('');
	} else {
		if (customClasses === undefined || customClasses === null || customClasses[schedules[scheduleIndex].data.names[currentPeriod]] === '') {
			period = schedules[scheduleIndex].data.names[currentPeriod];
		} else {
			period = customClasses[schedules[scheduleIndex].data.names[currentPeriod]];
		}

		$('.timer-pointer-label').text(parseTime(new Date(remainingTime)) + ' left');
		$('.timer-period-label').text(period);
	}
}

function toggleEditor() {
	$('.editor').toggle();
}

function submitClasses() {
	customClasses = {};
	let period;
	$('.form-row-container').children('.form-row').each(function (elem) {
		period = $(this).children('.form-label').text();
		customClasses[period] = $(this).children('.form-input').val();
	});

	localStorage.setItem('customClasses', JSON.stringify(customClasses));
	$('.editor').hide();
}

function deleteClasses() {
	customClasses = null;
	localStorage.removeItem('customClasses');
	$('.form-row-container').children('.form-row').each(function (elem) {
		$(this).children('.form-input').val('');
	});
}

function changeSchedule() {
	if ($('.schedule-selector').val() === 'Auto') {
		scheduleIndex = normalIndex;
	} else {
		scheduleIndex = $('.schedule-selector > option:selected').index() - 1;
	}
	createColumns();
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