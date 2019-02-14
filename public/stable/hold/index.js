// // document.getElementById('newsfeed').innerHTML = scrollText[scrollIndex % (scrollText.length - 1)];

// function newsfeedAdd() {
// 	scrollIndex += 1;
// 	document.getElementById('newsfeed').innerHTML = scrollText[scrollIndex % scrollText.length];
// }

function convert(stamp) {
	var ret = [];
	for (i = 0; i < stamp.length; i++) {
		var raw = stamp[i].split(':');
		ret.push(raw[0]*60*60 + raw[1]*60);
	}
	return ret;
}

function durations(stamp) {
	var ret = [];
	for (i = 0; i < stamp.length; i++) {
		var raw = stamp[i] * 60;
		ret.push(raw);
	}
	return ret;
}

function calcTimes() {
	var arr1 = ['8:04','8:51','9:38','10:20','11:02','11:42','12:24','13:06','14:12'];
	var arr2 = [43,43,43,38,38,38,38,38,62];
	
	console.log(convert(arr1));
	console.log(durations(arr2));
}