var periods = 6;
var time = 0;
var maxTime = 60;

var timerInterval = setInterval(increaseTimer, 1000);

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

function increaseTimer() {
	time++;
	if (time > 60) {
		clearInterval(timerInterval);
		return;
	}

	let pointer = $('.timer-pointer').css('left');
	let pointerWidth = $('.timer-pointer').width();

	let timerWidth = $('.timer').outerWidth() - pointerWidth;

	let labelWidth = $('.timer-pointer-label').width();

	$('.timer-pointer').css('left', ($(window).width() / 100 * 15) + (timerWidth / 60) * time) - (pointerWidth / 2);
	// $('.timer-pointer').css('left', ($(window).width() / 100 * 15) + (timerWidth / 60) * time);

	$('.timer-pointer-label').css('left', ($(window).width() / 100 * 15) + (timerWidth / 60) * time) - (labelWidth / 2);
	$('.timer-pointer-label').text(time);
}