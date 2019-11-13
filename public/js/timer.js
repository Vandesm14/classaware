/* version: 1.3.0 */

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

	$.get('https://Classaware-Server--vandesm14.repl.co/schedule', function (res) {
		schedules = res;
		getCurrentSchedule();
	});

	$.get('https://Classaware-Server--vandesm14.repl.co/alerts', function (res) {
		let template = $('#alert-template').html();
		$('.alerts').html('');
		for (let i in res) {
			let hold = template;
			hold = hold.replace('{{message}}', res[i].message);
			hold = hold.replace('{{color}}', res[i].color);
			$('.alerts').append(hold);
		}
		$('.alert').on('click', function () {
			$(this).hide();
		});
	});
});

var schedules;

var remainingTime;
var scheduleIndex;
var currentSchedule;
var periods;
var currentPeriod;
var periodLength;

var notTime;
var normalIndex;
var customClasses;
var timerInterval;
var devOffest = -60 * 60 * 5;


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
	$('.info-date').text(new String(new Date()).split(' ').splice(0, 3).join(' '));
	$('.info-time').text(new Date().toLocaleString().split(', ')[1].replace(/:\d\d([ ap]|$)/, ' '));
	// $('.info-day').text('F Day');
	$('.info-day').text('');

	if (!notTime) {
		// Move pointer
		$('.timer-pointer').stop(true, true);
		$('.timer-pointer').animate({
			left: (vw * cellSpacing) + (vw * cellWidth * ((periodLength - remainingTime) / periodLength))
		});

		// Move timer
		$('.timer').stop(true, true);
		$('.timer').animate({
			left: (vw * cellSpacing) - ((vw * cellWidth) * currentPeriod)
		});

		// Reset column classes
		$('.timer').children('.timer-column').removeClass('current');
		$('.timer').children('.timer-column').removeClass('next');
		$('.timer').children('.timer-column').css('opacity', '0.5');

		// Set main column class
		$('.timer').children(`.timer-column:eq(${currentPeriod})`).addClass('current');
		$('.timer').children(`.timer-column:eq(${currentPeriod})`).css('opacity', '1');

		// Show secondary columns
		$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).addClass('next');
		$('.timer').children(`.timer-column:eq(${currentPeriod + 1})`).css('opacity', '0.8');
		if (currentPeriod - 1 !== -1) {
			$('.timer').children(`.timer-column:eq(${currentPeriod - 1})`).css('opacity', '1');
		}
	}
}

function getCurrentPeriod() {
	// DEV offset
	let time = new Date();
	time.setTime(time.getTime() + (devOffest * 1000));
	let period;
	let startTime = new Date();
	startTime.setHours(schedules[scheduleIndex].data.startTime.split(':')[0]);
	startTime.setMinutes(schedules[scheduleIndex].data.startTime.split(':')[1]);
	startTime.setSeconds(0);

	// find position in times array
	for (let i in schedules[scheduleIndex].data.times) {
		let periodTime = new Date();
		let previousPeriodTime = new Date();
		periodTime.setHours(schedules[scheduleIndex].data.times[i].split(':')[0]);
		periodTime.setMinutes(schedules[scheduleIndex].data.times[i].split(':')[1]);
		periodTime.setSeconds(0);

		if (time < periodTime) {
			// perform subtraction function
			remainingTime = periodTime - time;
			currentPeriod = parseInt(i);

			// get period duration
			if (i == 0) { // Not triple "=" since i is a string, not a number
				previousPeriodTime.setHours(schedules[scheduleIndex].data.startTime.split(':')[0]);
				previousPeriodTime.setMinutes(schedules[scheduleIndex].data.startTime.split(':')[1]);
			} else {
				previousPeriodTime.setHours(schedules[scheduleIndex].data.times[i - 1].split(':')[0]);
				previousPeriodTime.setMinutes(schedules[scheduleIndex].data.times[i - 1].split(':')[1]);
			}
			previousPeriodTime.setSeconds(0);

			periodLength = periodTime - previousPeriodTime;
			break;
		}
	}

	// output time left
	if (remainingTime === undefined || time < startTime) {
		notTime = true;
		$('.timer-pointer-label').text('Not School Hours');
		$('.timer-period-label').text('');

		$('.timer-pointer').hide();
	} else {
		notTime = false;
		$('.timer-pointer').show();

		if (customClasses && customClasses[schedules[scheduleIndex].data.names[currentPeriod]]) {
			period = customClasses[schedules[scheduleIndex].data.names[currentPeriod]];
		} else {
			period = schedules[scheduleIndex].data.names[currentPeriod];
		}

		$('.timer-pointer-label').text(parseTime(new Date(remainingTime)) + ' left');
		$('.timer-period-label').text(period);
		$(document).attr('title', 'Classaware | Timer: ' + new Date(remainingTime).getMinutes() + 'm');
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