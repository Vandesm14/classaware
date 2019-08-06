var periods = 6;
var time = -1;
var maxTime = 360;
var periodLength = maxTime / periods;

// increaseTimer();
var timerInterval = setInterval(increaseTimer, 1000);

function increaseTimer() {
	time++;
	if (time > maxTime) {
		clearInterval(timerInterval);
		return;
	}

	// ((Math.floor(time / periodLength) + 1) * periodLength) - time

	let pointer = $('.timer-pointer').css('left');
	let pointerWidth = $('.timer-pointer').width();

	let timerWidth = $('.timer').outerWidth() - pointerWidth;

	// $('.timer-pointer-label').text(time);
	$('.timer-pointer-label').text(((Math.floor(time / periodLength) + 1) * periodLength) - time);
	let labelWidth = $('.timer-pointer-label').width();

	// $('.timer-pointer').css('left', ($(window).width() / 100 * 15) + (timerWidth / maxTime) * time) - (pointerWidth / 2);
	$('.timer').css('left', (($(window).width() / 100 * 15) - (timerWidth / maxTime) * time) + (timerWidth / 2));

	// $('.timer-pointer-label').css('left', ($(window).width() / 100 * 15) + (timerWidth / maxTime) * time - (labelWidth / 2 - 3));

	$('.timer').children('.timer-column').removeClass('current');
	$('.timer').children('.timer-column').css('opacity', '0');

	$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength)})`).addClass('current');
	$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength)})`).css('opacity', '100');

	$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength) + 1})`).css('opacity', '100');
	if ((Math.floor(time / periodLength) - 1) !== - 1) {
		$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength) - 1})`).css('opacity', '100');
	}
}

var schedules = [{
		name: 'normal',
		days: '35',
		data: {
			times: ['7:50', '8:40', '9:30', '10:20', '11:10', '12:00'],
			names: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6']
		}
	},
	{
		name: 'half-day',
		days: '124',
		data: {
			times: ['7:50', '8:40', '9:30'],
			names: ['Period 1', 'Period 2', 'Period 3']
		}
	}
];

function getCurrentSchedule() {
	// get current day
	// filter schedules by day
	// set current schedule variable
	// set timer columns to names
}

function getCurrentPeriod() {
	// get current time
	// get current schedule variable
	// find position in times array
	// perform subtraction function
	// output time left
	// set current period emphasis
}