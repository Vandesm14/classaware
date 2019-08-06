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

	let pointerWidth = $('.timer-pointer').width();
	let timerWidth = $('.timer').outerWidth() - pointerWidth;

	// Set time Left
	$('.timer-pointer-label').text(((Math.floor(time / periodLength) + 1) * periodLength) - time);

	// Move pointer
	$('.timer-pointer').animate({
		left: (($(window).width() / 100 * 43) + (timerWidth / maxTime) * (time % periodLength)) - (pointerWidth / 2)
	}, 500);

	if (time < periodLength * periods) {
		$('.timer').animate({
			left: (($(window).width() / 100 * 15) - (timerWidth / maxTime) * Math.floor(time / periodLength) * periodLength) + (timerWidth / 2.5)
		}, 500);
	}

	// Update Timer
	if (time % periodLength === 0 || time === 0 && time < periodLength * (periods - 1)) {
		// Move Timer

		// Reset column classes
		$('.timer').children('.timer-column').removeClass('current');
		$('.timer').children('.timer-column').css('opacity', '0.2');

		// Set main column class
		$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength)})`).addClass('current');
		$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength)})`).css('opacity', '1');

		// Show secondary columns
		$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength) + 1})`).css('opacity', '1');
		if ((Math.floor(time / periodLength) - 1) !== -1) {
			$('.timer').children(`.timer-column:eq(${Math.floor(time / periodLength) - 1})`).css('opacity', '1');
		}
	}
}

function updateTimer() {

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